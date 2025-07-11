import { useAuth } from "@/contexts/AuthContext";
import { LoadingSpinner } from "@/components/LoadingSpinner";
import CommunityPosts from "@/components/community/CommunityPosts";
const Community = () => {
  const {
    user,
    loading
  } = useAuth();
  console.log("Community page - user:", user, "loading:", loading);
  if (loading) {
    return <div className="min-h-screen bg-background flex items-center justify-center">
        <LoadingSpinner size="lg" text="Loading community..." />
      </div>;
  }
  return <div className="min-h-screen bg-background pb-12">
      <div className="container mx-auto pt-20 px-4">
        <h1 className="text-3xl md:text-4xl font-bold mb-6 text-center">AFD Community</h1>
        <CommunityPosts />
      </div>
    </div>;
};
export default Community;