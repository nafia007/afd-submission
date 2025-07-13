import { useState } from "react";
import { Button } from "@/components/ui/button";
import AFDSubmissions from "@/components/afd/AFDSubmissions";
import AFDUploadForm from "@/components/afd/AFDUploadForm";
import { toast } from "sonner";

export default function AFD() {
  const [refreshSubmissions, setRefreshSubmissions] = useState(false);

  const handleSubmissionSuccess = () => {
    toast.success("Project submitted successfully!");
    setRefreshSubmissions(prev => !prev);
  };

  return (
    <div className="min-h-screen bg-background pb-12">
      <div className="container mx-auto pt-20 px-4">
        <h1 className="text-3xl md:text-4xl font-bold mb-6 text-center">AFD Submissions</h1>
        <div className="mb-8 max-w-2xl mx-auto">
          <AFDUploadForm onSuccess={handleSubmissionSuccess} />
          <div className="text-center mt-4">
            <a href="https://opensea.io/collection/african-film-dao-member-nft/overview" target="_blank" rel="noopener noreferrer">
              <Button className="w-full gap-2" size="lg" variant="outline">
                Get AFD Member NFT
              </Button>
            </a>
          </div>
        </div>
        <AFDSubmissions key={refreshSubmissions ? 'refreshed' : 'initial'} />
      </div>
    </div>
  );
}
