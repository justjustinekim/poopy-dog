
import React, { useState } from "react";
import { Dialog, DialogContent, DialogTrigger, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Gift } from "lucide-react";
import RewardsShop from "@/components/RewardsShop";
import { UserRewards } from "@/types";

interface RewardsShopDialogProps {
  rewards: UserRewards;
}

const RewardsShopDialog: React.FC<RewardsShopDialogProps> = ({ rewards }) => {
  const [showRewardsShop, setShowRewardsShop] = useState(false);
  
  return (
    <Dialog open={showRewardsShop} onOpenChange={setShowRewardsShop}>
      <DialogTrigger asChild>
        <Button variant="outline" className="gap-2">
          <Gift className="h-4 w-4" />
          <span>Rewards Shop</span>
          <span className="bg-primary/20 text-primary px-2 py-0.5 rounded-full text-xs">
            {rewards.poopCoins} 💩
          </span>
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl p-6">
        <DialogTitle className="sr-only">Rewards Shop</DialogTitle>
        <DialogDescription className="sr-only">
          Spend your Poop Coins on rewards and special items
        </DialogDescription>
        <RewardsShop onClose={() => setShowRewardsShop(false)} />
      </DialogContent>
    </Dialog>
  );
};

export default RewardsShopDialog;
