
import { useEffect } from "react";
import { useUserAchievements } from "./achievements/useUserAchievements";
import { useUserChallenges } from "./achievements/useUserChallenges";
import { usePlayerStats } from "./achievements/usePlayerStats";
import { notifyNewAchievements } from "./achievements/achievementUtils";
import { useAuth } from "@/contexts/AuthContext";

/**
 * Main hook to access user achievements, challenges, and stats
 */
export const useAchievements = () => {
  const { user } = useAuth();
  const { 
    achievements, 
    loading: achievementsLoading, 
    streak, 
    totalPenaltyPoints,
    refreshAchievements 
  } = useUserAchievements();
  
  const { 
    challenges, 
    loading: challengesLoading,
    refreshChallenges 
  } = useUserChallenges();
  
  const { 
    level, 
    experience, 
    nextLevelExp,
    loading: statsLoading 
  } = usePlayerStats();
  
  const loading = achievementsLoading || challengesLoading || statsLoading;

  useEffect(() => {
    // Only notify about achievements if user is logged in and we have actual achievements
    if (user && !achievementsLoading && achievements.length > 0) {
      notifyNewAchievements(achievements);
    }
  }, [achievements, achievementsLoading, user]);

  return {
    achievements: user ? achievements : [],
    challenges: user ? challenges : [],
    loading,
    streak: user ? streak : 0,
    totalPenaltyPoints: user ? totalPenaltyPoints : 0,
    level: user ? level : 1,
    experience: user ? experience : 0,
    nextLevelExp: user ? nextLevelExp : 100,
    refreshAchievements,
    refreshChallenges
  };
};
