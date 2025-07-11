import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Film, Coins, TrendingUp } from "lucide-react";
import FilmGrid from "./FilmGrid";
import IPTradingSection from "./IPTradingSection";
import { Film as FilmType } from "@/types/film";
interface MarketplaceTabsProps {
  films: FilmType[];
  isLoading: boolean;
  onMint: (film: FilmType) => Promise<void>;
  onDelete: (filmId: string) => Promise<void>;
  userProfile: {
    id: string;
    role: 'admin' | 'user';
  } | null;
}
const MarketplaceTabs = ({
  films,
  isLoading,
  onMint,
  onDelete,
  userProfile
}: MarketplaceTabsProps) => {
  return <Tabs defaultValue="films" className="w-full">
      <TabsList className="grid w-full grid-cols-3">
        <TabsTrigger value="films" className="gap-2">
          <Film className="w-4 h-4" />
          Film NFTs
        </TabsTrigger>
        <TabsTrigger value="ip-tokens" className="gap-2">
          <Coins className="w-4 h-4" />
          IP Tokens
        </TabsTrigger>
        <TabsTrigger value="trending" className="gap-2">
          <TrendingUp className="w-4 h-4" />
          Trending
        </TabsTrigger>
      </TabsList>

      <TabsContent value="films" className="mt-6">
        <FilmGrid films={films} isLoading={isLoading} onMint={onMint} onDelete={onDelete} userProfile={userProfile} />
      </TabsContent>

      <TabsContent value="ip-tokens" className="mt-6">
        <IPTradingSection />
      </TabsContent>

      <TabsContent value="trending" className="mt-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="space-y-4">
            
            <FilmGrid films={films.slice(0, 3)} isLoading={isLoading} onMint={onMint} onDelete={onDelete} userProfile={userProfile} />
          </div>
          <div className="space-y-4">
            
            <IPTradingSection />
          </div>
        </div>
      </TabsContent>
    </Tabs>;
};
export default MarketplaceTabs;