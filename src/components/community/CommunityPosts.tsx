
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useAuthState } from "@/hooks/useAuthState";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Loader2, UserCircle } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useState } from "react";
import { toast } from "sonner";

interface Post {
  id: string;
  user_id: string;
  content: string;
  created_at: string;
}

export default function CommunityPosts() {
  const { user, loading: userLoading } = useAuthState();
  const [postContent, setPostContent] = useState("");
  const queryClient = useQueryClient();

  // Fetch all posts (newest first)
  const { data: posts, isLoading, error } = useQuery<Post[]>({
    queryKey: ["community-posts"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("posts")
        .select("*")
        .order("created_at", { ascending: false });
      if (error) throw error;
      return data as Post[];
    },
  });

  // Create a new post
  const { mutate: createPost, isPending: posting } = useMutation({
    mutationFn: async (content: string) => {
      if (!user) throw new Error("You must be signed in to post.");
      const { error } = await supabase.from("posts").insert({
        user_id: user.id,
        content,
      });
      if (error) throw error;
    },
    onSuccess: () => {
      setPostContent("");
      queryClient.invalidateQueries({ queryKey: ["community-posts"] });
      toast.success("Posted to community!");
    },
    onError: (err: any) => {
      toast.error(err.message || "Could not post.");
    },
  });

  return (
    <div className="max-w-2xl mx-auto w-full space-y-6 pt-10">
      <Card>
        <CardHeader>
          <CardTitle>Community Board</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {user ? (
            <form
              onSubmit={(e) => {
                e.preventDefault();
                if (postContent.trim()) createPost(postContent.trim());
              }}
              className="flex gap-2 items-start"
            >
              <Textarea
                placeholder="Share something with the Holocene community…"
                value={postContent}
                onChange={(e) => setPostContent(e.target.value)}
                maxLength={500}
                className="flex-1 min-h-[64px]"
                disabled={posting}
              />
              <Button 
                type="submit" 
                disabled={posting || !postContent.trim()} 
                className="self-end"
              >
                {posting ? <Loader2 className="w-4 h-4 animate-spin" /> : "Post"}
              </Button>
            </form>
          ) : (
            <p className="text-muted-foreground">
              Please log in to post and interact.
            </p>
          )}
        </CardContent>
      </Card>

      <div className="space-y-4">
        {isLoading ? (
          <div className="flex items-center justify-center p-6">
            <Loader2 className="w-6 h-6 animate-spin" />
          </div>
        ) : error ? (
          <div className="text-destructive text-center">
            {error instanceof Error ? error.message : "Failed to load posts."}
          </div>
        ) : posts && posts.length > 0 ? (
          posts.map((post) => (
            <Card key={post.id} className="w-full">
              <CardContent className="py-4 flex gap-3">
                <UserCircle className="w-6 h-6 text-accent shrink-0 mt-0.5" />
                <div>
                  <div className="text-xs text-muted-foreground mb-1">
                    {post.user_id.slice(0, 8)} •{" "}
                    {new Date(post.created_at).toLocaleString()}
                  </div>
                  <div className="text-foreground text-base whitespace-pre-line">
                    {post.content}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        ) : (
          <div className="text-center text-muted-foreground py-6">
            No posts yet. Be the first to start the conversation!
          </div>
        )}
      </div>
    </div>
  );
}
