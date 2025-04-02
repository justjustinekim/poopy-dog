
import React from "react";
import { useUserRewards } from "@/hooks/useUserRewards";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { RewardItem } from "@/types";
import { Award, Gift, ThumbsUp, X } from "lucide-react";
import { useIsMobile } from "@/hooks/use-mobile";

interface RewardsShopProps {
  onClose?: () => void;
}

const RewardsShop: React.FC<RewardsShopProps> = ({ onClose }) => {
  const { rewards, availableItems, purchaseRewardItem, loading } = useUserRewards();
  const isMobile = useIsMobile();

  const filterItemsByType = (type: RewardItem['type']) => {
    return availableItems.filter(item => item.type === type);
  };
  
  const renderItem = (item: RewardItem) => (
    <Card key={item.id} className="overflow-hidden transition-all hover:shadow-md">
      <CardHeader className="p-4 pb-2">
        <div className="flex items-center justify-between">
          <CardTitle className="text-base">{item.name}</CardTitle>
          <div className="text-xl p-1 bg-primary/10 rounded-full h-10 w-10 flex items-center justify-center">
            {item.imageUrl}
          </div>
        </div>
        <CardDescription>{item.description}</CardDescription>
      </CardHeader>
      <CardFooter className="p-4 pt-2 flex justify-between items-center">
        <Badge variant="secondary" className="font-semibold">
          {item.cost} <span className="ml-1">💩</span>
        </Badge>
        <Button 
          size="sm" 
          variant={item.unlocked ? "outline" : "default"}
          disabled={item.unlocked || rewards.poopCoins < item.cost}
          onClick={() => purchaseRewardItem(item.id)}
        >
          {item.unlocked ? "Owned" : "Purchase"}
        </Button>
      </CardFooter>
    </Card>
  );
  
  if (loading) {
    return <div className="p-4 text-center">Loading rewards shop...</div>;
  }
  
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between mb-2">
        <h2 className="text-2xl font-bold">Rewards Shop</h2>
        {onClose && (
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={onClose}
            className="flex items-center gap-1"
            aria-label="Close rewards shop"
          >
            <X className="h-4 w-4" />
            <span className={isMobile ? "sr-only" : ""}>Close</span>
          </Button>
        )}
      </div>
      
      {/* Fixed close button for mobile */}
      {isMobile && onClose && (
        <Button
          className="fixed bottom-20 right-4 z-50 rounded-full shadow-lg"
          size="icon"
          onClick={onClose}
          aria-label="Close rewards shop"
        >
          <X className="h-6 w-6" />
        </Button>
      )}
      
      <div className="flex gap-4 p-4 bg-background rounded-lg border mb-6">
        <div className="flex-1 flex items-center gap-2">
          <div className="bg-primary/10 p-2 rounded-full">
            <Gift className="h-5 w-5 text-primary" />
          </div>
          <div>
            <p className="font-semibold text-sm">Poop Coins</p>
            <p className="text-lg font-bold">{rewards.poopCoins} 💩</p>
          </div>
        </div>
        
        <div className="flex-1 flex items-center gap-2">
          <div className="bg-secondary/10 p-2 rounded-full">
            <Award className="h-5 w-5 text-secondary" />
          </div>
          <div>
            <p className="font-semibold text-sm">Stink Badges</p>
            <p className="text-lg font-bold">{rewards.stinkBadges} 🏆</p>
          </div>
        </div>
      </div>
      
      <Tabs defaultValue="all">
        <TabsList className="grid grid-cols-5">
          <TabsTrigger value="all">All</TabsTrigger>
          <TabsTrigger value="badge">Badges</TabsTrigger>
          <TabsTrigger value="flair">Flair</TabsTrigger>
          <TabsTrigger value="filter">Filters</TabsTrigger>
          <TabsTrigger value="emote">Emotes</TabsTrigger>
        </TabsList>
        
        <TabsContent value="all" className="mt-4 space-y-4">
          {availableItems.length === 0 ? (
            <p className="text-center text-gray-500 py-8">No items available</p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {availableItems.map(renderItem)}
            </div>
          )}
        </TabsContent>
        
        {(['badge', 'flair', 'filter', 'emote'] as const).map(type => (
          <TabsContent key={type} value={type} className="mt-4 space-y-4">
            {filterItemsByType(type).length === 0 ? (
              <p className="text-center text-gray-500 py-8">No {type}s available</p>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {filterItemsByType(type).map(renderItem)}
              </div>
            )}
          </TabsContent>
        ))}
      </Tabs>
      
      <div className="border-t pt-4 mt-6 pb-16">
        <p className="text-sm text-gray-500 text-center">
          Complete challenges and track consistently to earn more Poop Coins!
        </p>
      </div>
    </div>
  );
};

export default RewardsShop;
