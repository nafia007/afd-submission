import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { format } from "date-fns";
import { toast } from "sonner";
import { useAuth } from "@/contexts/AuthContext";
import { 
  Download, 
  Users, 
  FileText, 
  AlertCircle, 
  CheckCircle, 
  XCircle, 
  Eye, 
  Clock,
  Calendar,
  User,
  FileType,
  Globe,
  DollarSign,
  MessageSquare,
  Send
} from "lucide-react";

interface UserProfile {
  id: string;
  role: 'admin' | 'user';
  email: string;
  created_at: string;
  last_sign_in_at: string | null;
}

interface AFDSubmission {
  id: string;
  user_id: string;
  title: string;
  description: string | null;
  director: string | null;
  tier: 'script' | 'work_in_progress' | 'finished_film';
  file_url: string;
  file_type: string;
  created_at: string;
  status?: 'pending' | 'approved' | 'rejected';
  budget?: string | null;
  country_of_origin?: string | null;
  country_of_production?: string | null;
  format?: string | null;
  genre?: string | null;
  partners?: string | null;
}

interface SubmissionAction {
  submissionId: string;
  action: 'approve' | 'reject';
  notes?: string;
}

const AdminDashboard = () => {
  const navigate = useNavigate();
  const { user, loading: authLoading } = useAuth();
  const queryClient = useQueryClient();
  const [activeTab, setActiveTab] = useState("users");
  const [selectedSubmission, setSelectedSubmission] = useState<AFDSubmission | null>(null);
  const [actionNotes, setActionNotes] = useState("");
  const [isActionDialogOpen, setIsActionDialogOpen] = useState(false);
  const [pendingAction, setPendingAction] = useState<SubmissionAction | null>(null);

  // Check if user is admin (nafiakocks76@gmail.com)
  useEffect(() => {
    if (!authLoading && (!user || user.email !== 'nafiakocks76@gmail.com')) {
      navigate('/');
      toast.error("Access denied. Admin privileges required.");
    }
  }, [user, authLoading, navigate]);

  // Fetch user profiles - simplified query
  const { data: users, isLoading: loadingUsers, error: usersError } = useQuery({
    queryKey: ['admin-users'],
    queryFn: async () => {
      console.log("Fetching users...");
      
      // Try to get users from user_profiles view first
      let { data, error } = await supabase
        .from('user_profiles')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        console.log("Error with user_profiles, trying profiles table:", error);
        
        // Fallback to profiles table
        const { data: profilesData, error: profilesError } = await supabase
          .from('profiles')
          .select('*')
          .order('created_at', { ascending: false });
        
        if (profilesError) {
          console.error("Error fetching profiles:", profilesError);
          throw profilesError;
        }
        
        // Transform profiles data to match expected format
        data = profilesData?.map(profile => ({
          id: profile.id,
          role: profile.role || 'user',
          email: 'User ID: ' + profile.user_id, // Since profiles table doesn't have email
          created_at: profile.created_at,
          last_sign_in_at: null
        })) || [];
      }

      console.log("Users data:", data);
      return data as UserProfile[];
    },
    enabled: user?.email === 'nafiakocks76@gmail.com',
    retry: 3,
    retryDelay: 1000
  });

  // Fetch AFD submissions - simplified query
  const { data: submissions, isLoading: loadingSubmissions, error: submissionsError } = useQuery({
    queryKey: ['admin-submissions'],
    queryFn: async () => {
      console.log("Fetching submissions...");
      
      const { data, error } = await supabase
        .from('afd_submissions')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        console.error("Error fetching submissions:", error);
        throw error;
      }

      console.log("Submissions data:", data);
      return data as AFDSubmission[];
    },
    enabled: user?.email === 'nafiakocks76@gmail.com',
    retry: 3,
    retryDelay: 1000
  });

  // Mutation for updating submission status
  const updateSubmissionStatus = useMutation({
    mutationFn: async ({ submissionId, status, notes }: { submissionId: string; status: 'approved' | 'rejected'; notes?: string }) => {
      const { error } = await supabase
        .from('afd_submissions')
        .update({ status })
        .eq('id', submissionId);
      
      if (error) throw error;
      return { submissionId, status, notes };
    },
    onSuccess: ({ submissionId, status, notes }) => {
      toast.success(`Submission ${status} successfully${notes ? ' with notes' : ''}`);
      queryClient.invalidateQueries({ queryKey: ['admin-submissions'] });
      setIsActionDialogOpen(false);
      setActionNotes("");
      setPendingAction(null);
    },
    onError: (error) => {
      console.error('Error updating submission:', error);
      toast.error('Failed to update submission status');
    }
  });

  // Handle submission action
  const handleSubmissionAction = (submission: AFDSubmission, action: 'approve' | 'reject') => {
    setSelectedSubmission(submission);
    setPendingAction({ submissionId: submission.id, action });
    setIsActionDialogOpen(true);
  };

  // Confirm action with notes
  const confirmAction = () => {
    if (!pendingAction) return;
    
    const status = pendingAction.action === 'approve' ? 'approved' : 'rejected';
    updateSubmissionStatus.mutate({ 
      submissionId: pendingAction.submissionId, 
      status, 
      notes: actionNotes 
    });
  };

  // Download file function
  const downloadFile = async (fileUrl: string, fileName: string) => {
    try {
      const response = await fetch(fileUrl);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = fileName;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (error) {
      console.error('Error downloading file:', error);
      toast.error('Failed to download file');
    }
  };

  if (authLoading) {
    return (
      <div className="container mx-auto px-4 pt-32 pb-16 flex items-center justify-center min-h-[50vh]">
        <div className="w-8 h-8 animate-spin rounded-full border-2 border-primary border-t-transparent"></div>
      </div>
    );
  }

  if (!user || user.email !== 'nafiakocks76@gmail.com') {
    return null;
  }

  const getTierColor = (tier: string) => {
    switch (tier) {
      case 'script': return 'bg-blue-100 text-blue-800';
      case 'work_in_progress': return 'bg-yellow-100 text-yellow-800';
      case 'finished_film': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusColor = (status: string | undefined) => {
    switch (status) {
      case 'approved': return 'bg-green-100 text-green-800';
      case 'rejected': return 'bg-red-100 text-red-800';
      case 'pending':
      default: return 'bg-yellow-100 text-yellow-800';
    }
  };

  const getStatusIcon = (status: string | undefined) => {
    switch (status) {
      case 'approved': return <CheckCircle className="w-4 h-4" />;
      case 'rejected': return <XCircle className="w-4 h-4" />;
      case 'pending':
      default: return <Clock className="w-4 h-4" />;
    }
  };

  const getSubmissionStats = () => {
    if (!submissions) return { pending: 0, approved: 0, rejected: 0, total: 0 };
    
    const stats = submissions.reduce((acc, sub) => {
      const status = sub.status || 'pending';
      acc[status]++;
      acc.total++;
      return acc;
    }, { pending: 0, approved: 0, rejected: 0, total: 0 });
    
    return stats;
  };

  const stats = getSubmissionStats();

  return (
    <div className="container mx-auto px-4 pt-32 pb-16">
      <div className="flex flex-col gap-8">
        <div>
          <h1 className="font-heading text-4xl font-bold mb-4">Admin Dashboard</h1>
          <p className="text-foreground/70 max-w-2xl">
            Manage users and review AFD submissions. Only accessible to authorized administrators.
          </p>
          <p className="text-sm text-foreground/50 mt-2">
            Logged in as: {user.email}
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-2">
                <Clock className="w-5 h-5 text-yellow-600" />
                <div>
                  <p className="text-sm text-muted-foreground">Pending</p>
                  <p className="text-2xl font-bold">{stats.pending}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-2">
                <CheckCircle className="w-5 h-5 text-green-600" />
                <div>
                  <p className="text-sm text-muted-foreground">Approved</p>
                  <p className="text-2xl font-bold">{stats.approved}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-2">
                <XCircle className="w-5 h-5 text-red-600" />
                <div>
                  <p className="text-sm text-muted-foreground">Rejected</p>
                  <p className="text-2xl font-bold">{stats.rejected}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-2">
                <FileText className="w-5 h-5 text-blue-600" />
                <div>
                  <p className="text-sm text-muted-foreground">Total</p>
                  <p className="text-2xl font-bold">{stats.total}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="users" className="flex items-center gap-2">
              <Users className="w-4 h-4" />
              Users ({users?.length || 0})
            </TabsTrigger>
            <TabsTrigger value="submissions" className="flex items-center gap-2">
              <FileText className="w-4 h-4" />
              Submissions ({submissions?.length || 0})
            </TabsTrigger>
          </TabsList>

          <TabsContent value="users" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle>User Management</CardTitle>
                <CardDescription>
                  View all registered users in the system
                </CardDescription>
              </CardHeader>
              <CardContent>
                {usersError && (
                  <div className="flex items-center gap-2 text-red-600 mb-4 p-3 bg-red-50 rounded-md">
                    <AlertCircle className="w-4 h-4" />
                    Error loading users: {usersError.message}
                  </div>
                )}
                
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>ID</TableHead>
                      <TableHead>Email/User ID</TableHead>
                      <TableHead>Role</TableHead>
                      <TableHead>Created At</TableHead>
                      <TableHead>Last Sign In</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {loadingUsers ? (
                      <TableRow>
                        <TableCell colSpan={5} className="text-center py-8">
                          Loading users...
                        </TableCell>
                      </TableRow>
                    ) : users && users.length > 0 ? (
                      users.map((user) => (
                        <TableRow key={user.id}>
                          <TableCell className="font-mono text-sm">{user.id.slice(0, 8)}...</TableCell>
                          <TableCell className="font-medium">{user.email}</TableCell>
                          <TableCell>
                            <Badge variant={user.role === 'admin' ? 'default' : 'secondary'}>
                              {user.role}
                            </Badge>
                          </TableCell>
                          <TableCell>{format(new Date(user.created_at), 'PPp')}</TableCell>
                          <TableCell>
                            {user.last_sign_in_at 
                              ? format(new Date(user.last_sign_in_at), 'PPp')
                              : 'Never'}
                          </TableCell>
                        </TableRow>
                      ))
                    ) : (
                      <TableRow>
                        <TableCell colSpan={5} className="text-center py-8 text-muted-foreground">
                          No users found. Check if the profiles table has data and RLS policies are correct.
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="submissions" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle>AFD Submissions Review</CardTitle>
                <CardDescription>
                  Review and manage film submissions. Approve or reject submissions as needed.
                </CardDescription>
              </CardHeader>
              <CardContent>
                {submissionsError && (
                  <div className="flex items-center gap-2 text-red-600 mb-4 p-3 bg-red-50 rounded-md">
                    <AlertCircle className="w-4 h-4" />
                    Error loading submissions: {submissionsError.message}
                  </div>
                )}
                
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Title</TableHead>
                      <TableHead>Director</TableHead>
                      <TableHead>User ID</TableHead>
                      <TableHead>Tier</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Submitted</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {loadingSubmissions ? (
                      <TableRow>
                        <TableCell colSpan={7} className="text-center py-8">
                          Loading submissions...
                        </TableCell>
                      </TableRow>
                    ) : submissions && submissions.length > 0 ? (
                      submissions.map((submission) => (
                        <TableRow key={submission.id}>
                          <TableCell className="font-medium">{submission.title}</TableCell>
                          <TableCell>{submission.director || 'N/A'}</TableCell>
                          <TableCell className="font-mono text-sm">{submission.user_id.slice(0, 8)}...</TableCell>
                          <TableCell>
                            <Badge className={getTierColor(submission.tier)}>
                              {submission.tier.replace('_', ' ')}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <Badge className={getStatusColor(submission.status)}>
                              <div className="flex items-center gap-1">
                                {getStatusIcon(submission.status)}
                                {submission.status || 'pending'}
                              </div>
                            </Badge>
                          </TableCell>
                          <TableCell>{format(new Date(submission.created_at), 'PPp')}</TableCell>
                          <TableCell>
                            <div className="flex items-center gap-2">
                              <Dialog>
                                <DialogTrigger asChild>
                                  <Button variant="outline" size="sm">
                                    <Eye className="w-4 h-4" />
                                  </Button>
                                </DialogTrigger>
                                <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
                                  <DialogHeader>
                                    <DialogTitle>Submission Details</DialogTitle>
                                    <DialogDescription>
                                      Review the complete submission details
                                    </DialogDescription>
                                  </DialogHeader>
                                  <div className="space-y-4">
                                    <div className="grid grid-cols-2 gap-4">
                                      <div>
                                        <Label className="text-sm font-medium">Title</Label>
                                        <p className="text-sm text-muted-foreground">{submission.title}</p>
                                      </div>
                                      <div>
                                        <Label className="text-sm font-medium">Director</Label>
                                        <p className="text-sm text-muted-foreground">{submission.director || 'N/A'}</p>
                                      </div>
                                      <div>
                                        <Label className="text-sm font-medium">Tier</Label>
                                        <Badge className={getTierColor(submission.tier)}>
                                          {submission.tier.replace('_', ' ')}
                                        </Badge>
                                      </div>
                                      <div>
                                        <Label className="text-sm font-medium">Status</Label>
                                        <Badge className={getStatusColor(submission.status)}>
                                          {submission.status || 'pending'}
                                        </Badge>
                                      </div>
                                      <div>
                                        <Label className="text-sm font-medium">Budget</Label>
                                        <p className="text-sm text-muted-foreground">{submission.budget || 'N/A'}</p>
                                      </div>
                                      <div>
                                        <Label className="text-sm font-medium">Format</Label>
                                        <p className="text-sm text-muted-foreground">{submission.format || 'N/A'}</p>
                                      </div>
                                      <div>
                                        <Label className="text-sm font-medium">Genre</Label>
                                        <p className="text-sm text-muted-foreground">{submission.genre || 'N/A'}</p>
                                      </div>
                                      <div>
                                        <Label className="text-sm font-medium">Country of Origin</Label>
                                        <p className="text-sm text-muted-foreground">{submission.country_of_origin || 'N/A'}</p>
                                      </div>
                                    </div>
                                    {submission.description && (
                                      <div>
                                        <Label className="text-sm font-medium">Description</Label>
                                        <p className="text-sm text-muted-foreground">{submission.description}</p>
                                      </div>
                                    )}
                                    {submission.partners && (
                                      <div>
                                        <Label className="text-sm font-medium">Partners</Label>
                                        <p className="text-sm text-muted-foreground">{submission.partners}</p>
                                      </div>
                                    )}
                                    <div className="flex gap-2">
                                      <Button
                                        variant="outline"
                                        onClick={() => downloadFile(submission.file_url, `${submission.title}.${submission.file_type}`)}
                                      >
                                        <Download className="w-4 h-4 mr-2" />
                                        Download File
                                      </Button>
                                    </div>
                                  </div>
                                </DialogContent>
                              </Dialog>
                              
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => downloadFile(submission.file_url, `${submission.title}.${submission.file_type}`)}
                              >
                                <Download className="w-4 h-4" />
                              </Button>
                              
                              {(submission.status === 'pending' || !submission.status) && (
                                <>
                                  <Button
                                    variant="outline"
                                    size="sm"
                                    className="text-green-600 hover:text-green-700"
                                    onClick={() => handleSubmissionAction(submission, 'approve')}
                                    disabled={updateSubmissionStatus.isPending}
                                  >
                                    <CheckCircle className="w-4 h-4" />
                                  </Button>
                                  <Button
                                    variant="outline"
                                    size="sm"
                                    className="text-red-600 hover:text-red-700"
                                    onClick={() => handleSubmissionAction(submission, 'reject')}
                                    disabled={updateSubmissionStatus.isPending}
                                  >
                                    <XCircle className="w-4 h-4" />
                                  </Button>
                                </>
                              )}
                            </div>
                          </TableCell>
                        </TableRow>
                      ))
                    ) : (
                      <TableRow>
                        <TableCell colSpan={7} className="text-center py-8 text-muted-foreground">
                          No submissions found. Check if the afd_submissions table has data and RLS policies are correct.
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>

      {/* Action Confirmation Dialog */}
      <Dialog open={isActionDialogOpen} onOpenChange={setIsActionDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {pendingAction?.action === 'approve' ? 'Approve' : 'Reject'} Submission
            </DialogTitle>
            <DialogDescription>
              {pendingAction?.action === 'approve' 
                ? 'Are you sure you want to approve this submission?' 
                : 'Are you sure you want to reject this submission?'
              }
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            {selectedSubmission && (
              <div className="p-3 bg-muted rounded-md">
                <p className="font-medium">{selectedSubmission.title}</p>
                <p className="text-sm text-muted-foreground">
                  by {selectedSubmission.director || 'Unknown Director'}
                </p>
              </div>
            )}
            <div>
              <Label htmlFor="notes">Notes (Optional)</Label>
              <Textarea
                id="notes"
                placeholder={`Add notes for ${pendingAction?.action === 'approve' ? 'approval' : 'rejection'}...`}
                value={actionNotes}
                onChange={(e) => setActionNotes(e.target.value)}
                rows={3}
              />
            </div>
            <div className="flex gap-2 justify-end">
              <Button
                variant="outline"
                onClick={() => {
                  setIsActionDialogOpen(false);
                  setActionNotes("");
                  setPendingAction(null);
                }}
              >
                Cancel
              </Button>
              <Button
                onClick={confirmAction}
                disabled={updateSubmissionStatus.isPending}
                className={
                  pendingAction?.action === 'approve' 
                    ? 'bg-green-600 hover:bg-green-700' 
                    : 'bg-red-600 hover:bg-red-700'
                }
              >
                {updateSubmissionStatus.isPending ? (
                  <div className="w-4 h-4 animate-spin rounded-full border-2 border-white border-t-transparent"></div>
                ) : (
                  <>
                    {pendingAction?.action === 'approve' ? <CheckCircle className="w-4 h-4 mr-2" /> : <XCircle className="w-4 h-4 mr-2" />}
                    {pendingAction?.action === 'approve' ? 'Approve' : 'Reject'}
                  </>
                )}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AdminDashboard; 