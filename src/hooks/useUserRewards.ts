
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { RewardItem, UserRewards } from "@/types";
import { toast } from "sonner";

// Mock rewards data - in a real app, this would come from the database
const MOCK_REWARD_ITEMS: RewardItem[] = [
  {
    id: "1",
    name: "Poop King Crown",
    description: "A majestic crown for the true Poop King",
    imageUrl: "👑",
    cost: 100,
    type: "flair",
    unlocked: false
  },
  {
    id: "2",
    name: "Too Cool for Stool",
    description: "Poop emoji wearing sunglasses",
    imageUrl: "💩😎",
    cost: 50,
    type: "badge",
    unlocked: false
  },
  {
    id: "3",
    name: "Doge Filter",
    description: "Turn your poop pics into a Doge meme",
    imageUrl: "🐕",
    cost: 200,
    type: "filter",
    unlocked: false
  },
  {
    id: "4",
    name: "Poop Emoji Rain",
    description: "It's raining poop emojis!",
    imageUrl: "☔💩",
    cost: 75,
    type: "emote",
    unlocked: false
  }
];

export const useUserRewards = () => {
  const { user } = useAuth();
  const [rewards, setRewards] = useState<UserRewards>({
    poopCoins: 0,
    stinkBadges: 0,
    unlockedItems: []
  });
  const [availableItems, setAvailableItems] = useState<RewardItem[]>(MOCK_REWARD_ITEMS);
  const [loading, setLoading] = useState(true);

  // This would fetch from the database in a real implementation
  const fetchUserRewards = async () => {
    if (!user) {
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      
      // For now, we're using mock data
      // In a real app, you would fetch from Supabase here
      const mockPoopCoins = Math.floor(Math.random() * 500);
      const mockStinkBadges = Math.floor(Math.random() * 10);
      
      // Simulate some unlocked items
      const unlockedItems = MOCK_REWARD_ITEMS
        .filter(() => Math.random() > 0.7)
        .map(item => ({ ...item, unlocked: true }));
      
      setRewards({
        poopCoins: mockPoopCoins,
        stinkBadges: mockStinkBadges,
        unlockedItems
      });
      
      // Update available items with unlocked status
      setAvailableItems(MOCK_REWARD_ITEMS.map(item => {
        const unlocked = unlockedItems.some(unlockedItem => unlockedItem.id === item.id);
        return { ...item, unlocked };
      }));
      
    } catch (error) {
      console.error("Error fetching rewards:", error);
      toast.error("Failed to load rewards");
    } finally {
      setLoading(false);
    }
  };

  const purchaseRewardItem = async (itemId: string) => {
    const itemToPurchase = availableItems.find(item => item.id === itemId);
    
    if (!itemToPurchase) {
      toast.error("Item not found");
      return false;
    }
    
    if (itemToPurchase.unlocked) {
      toast.error("You already own this item");
      return false;
    }
    
    if (rewards.poopCoins < itemToPurchase.cost) {
      toast.error("Not enough Poop Coins!");
      return false;
    }
    
    try {
      // In a real app, you would update this in the database
      setRewards(prev => ({
        ...prev,
        poopCoins: prev.poopCoins - itemToPurchase.cost,
        unlockedItems: [...prev.unlockedItems, { ...itemToPurchase, unlocked: true }]
      }));
      
      // Update available items
      setAvailableItems(prev => 
        prev.map(item => 
          item.id === itemId ? { ...item, unlocked: true } : item
        )
      );
      
      toast.success(`You purchased ${itemToPurchase.name}!`);
      return true;
    } catch (error) {
      console.error("Error purchasing item:", error);
      toast.error("Failed to purchase item");
      return false;
    }
  };

  // This would add coins in a real implementation
  const addPoopCoins = (amount: number) => {
    setRewards(prev => ({
      ...prev,
      poopCoins: prev.poopCoins + amount
    }));
    
    toast.success(`You earned ${amount} Poop Coins!`);
  };
  
  const addStinkBadges = (amount: number) => {
    setRewards(prev => ({
      ...prev,
      stinkBadges: prev.stinkBadges + amount
    }));
    
    toast.success(`You earned ${amount} Stink Badges!`);
  };

  useEffect(() => {
    fetchUserRewards();
  }, [user]);

  return {
    rewards,
    availableItems,
    loading,
    purchaseRewardItem,
    addPoopCoins,
    addStinkBadges,
    refreshRewards: fetchUserRewards
  };
};
