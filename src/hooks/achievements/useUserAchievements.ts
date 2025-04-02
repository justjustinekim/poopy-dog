
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Achievement } from "@/types";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";
import { AchievementRow, UserAchievementRow } from "@/types/supabase";
import { mapAchievementsWithProgress, calculatePenaltyPoints, getCurrentStreak } from "./achievementUtils";

export const useUserAchievements = () => {
  const { user } = useAuth();
  const [achievements, setAchievements] = useState<Achievement[]>([]);
  const [loading, setLoading] = useState(true);
  const [streak, setStreak] = useState(0);
  const [totalPenaltyPoints, setTotalPenaltyPoints] = useState(0);

  const fetchAchievements = async () => {
    if (!user) {
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      
      // Fetch all available achievements
      const { data: achievementsData, error: achievementsError } = await supabase
        .from('achievements')
        .select('*')
        .order('id');
      
      if (achievementsError) throw achievementsError;
      
      // Fetch user's achievement progress
      const { data: userAchievementsData, error: userAchievementsError } = await supabase
        .from('user_achievements')
        .select('*')
        .eq('user_id', user.id);
      
      if (userAchievementsError) throw userAchievementsError;
      
      // Map achievements with user progress
      const mappedAchievements = mapAchievementsWithProgress(
        achievementsData as AchievementRow[], 
        userAchievementsData as UserAchievementRow[]
      );
      
      setAchievements(mappedAchievements);
      
      // Calculate total penalty points
      const penaltyPoints = calculatePenaltyPoints(mappedAchievements);
      setTotalPenaltyPoints(penaltyPoints);
      
      // Calculate current streak
      const currentStreak = getCurrentStreak(mappedAchievements);
      setStreak(currentStreak);
      
    } catch (error) {
      console.error("Error fetching achievements:", error);
      toast.error("Failed to load achievements");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAchievements();
  }, [user]);

  return {
    achievements,
    loading,
    streak,
    totalPenaltyPoints,
    refreshAchievements: fetchAchievements
  };
};
