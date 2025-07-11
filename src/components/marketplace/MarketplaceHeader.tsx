
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";

interface MarketplaceHeaderProps {
  onSubmitClick: () => void;
  showSubmissionForm: boolean;
  userProfile: { id: string; role: 'admin' | 'user' } | null;
}

const MarketplaceHeader = ({ onSubmitClick, showSubmissionForm, userProfile }: MarketplaceHeaderProps) => {
  return (
    <div className="flex justify-between items-start">
      <div>
        <h1 className="font-heading text-4xl font-bold mb-4">Film IP Marketplace</h1>
        <p className="text-foreground/70 max-w-2xl">
          Discover and invest in unique film IP tokens. Each token represents partial ownership
          in the intellectual property rights of groundbreaking films.
        </p>
      </div>
      {userProfile && (
        <Button 
          onClick={onSubmitClick}
          className="gap-2"
        >
          <Plus className="w-4 h-4" />
          {showSubmissionForm ? "Close Form" : "Submit Film"}
        </Button>
      )}
    </div>
  );
};

export default MarketplaceHeader;
