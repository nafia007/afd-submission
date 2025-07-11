
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface FilmmakerProfile {
  id: string;
  bio: string | null;
  portfolio_url: string | null;
  website_url: string | null;
  skills: string[] | null;
}

interface ProfileFormProps {
  userId: string;
  filmmakerProfile: FilmmakerProfile | null;
  setFilmmakerProfile: (profile: FilmmakerProfile | null) => void;
  initialBio: string;
  initialPortfolioUrl: string;
  initialWebsiteUrl: string;
}

const ProfileForm = ({ 
  userId,
  filmmakerProfile, 
  setFilmmakerProfile,
  initialBio,
  initialPortfolioUrl,
  initialWebsiteUrl
}: ProfileFormProps) => {
  const [bio, setBio] = useState<string>(initialBio);
  const [portfolioUrl, setPortfolioUrl] = useState<string>(initialPortfolioUrl);
  const [websiteUrl, setWebsiteUrl] = useState<string>(initialWebsiteUrl);
  const [updating, setUpdating] = useState(false);

  const handleProfileUpdate = async () => {
    setUpdating(true);
    try {
      console.log("Attempting to update profile for user:", userId);
      console.log("Current filmmaker profile:", filmmakerProfile);
      
      if (filmmakerProfile) {
        // Update existing profile
        const { error } = await supabase
          .from('filmmaker_profiles')
          .update({
            bio,
            portfolio_url: portfolioUrl,
            website_url: websiteUrl
          })
          .eq('id', userId);
        
        if (error) {
          console.error("Error updating profile:", error);
          throw error;
        }
        
        // Update local state with new values
        setFilmmakerProfile({
          ...filmmakerProfile,
          bio,
          portfolio_url: portfolioUrl,
          website_url: websiteUrl
        });
        
        console.log("Profile updated successfully");
      } else {
        // Create new profile
        console.log("Creating new filmmaker profile for user:", userId);
        const { data, error } = await supabase
          .from('filmmaker_profiles')
          .insert({
            id: userId,
            bio,
            portfolio_url: portfolioUrl,
            website_url: websiteUrl
          })
          .select()
          .single();
        
        if (error) {
          console.error("Error creating profile:", error);
          throw error;
        }
        
        // Set the new profile in state
        setFilmmakerProfile(data as FilmmakerProfile);
        console.log("New profile created successfully:", data);
      }
      
      toast.success("Profile updated successfully!");
    } catch (error: any) {
      console.error("Error updating profile:", error);
      toast.error(error.message || "Failed to update profile");
    } finally {
      setUpdating(false);
    }
  };

  return (
    <Card className="md:col-span-2">
      <CardHeader>
        <CardTitle>Edit Profile</CardTitle>
        <CardDescription>Update your filmmaker profile information</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="bio">Bio</Label>
          <Textarea 
            id="bio" 
            placeholder="Tell us about yourself as a filmmaker"
            value={bio}
            onChange={(e) => setBio(e.target.value)}
            rows={4}
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="portfolio">Portfolio URL</Label>
          <Input 
            id="portfolio" 
            type="url" 
            placeholder="https://your-portfolio.com"
            value={portfolioUrl}
            onChange={(e) => setPortfolioUrl(e.target.value)}
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="website">Website</Label>
          <Input 
            id="website" 
            type="url" 
            placeholder="https://your-website.com"
            value={websiteUrl}
            onChange={(e) => setWebsiteUrl(e.target.value)}
          />
        </div>
      </CardContent>
      <CardFooter>
        <Button 
          onClick={handleProfileUpdate} 
          disabled={updating}
          className="w-full"
        >
          {updating ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin mr-2" />
              Saving...
            </>
          ) : "Save Profile"}
        </Button>
      </CardFooter>
    </Card>
  );
};

export default ProfileForm;
