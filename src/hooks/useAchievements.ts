
import { useEffect } from "react";
import { useUserAchievements } from "./achievements/useUserAchievements";
import { useUserChallenges } from "./achievements/useUserChallenges";
import { usePlayerStats } from "./achievements/usePlayerStats";
import { notifyNewAchievements } from "./achievements/achievementUtils";

/**
 * Main hook to access user achievements, challenges, and stats
 */
export const useAchievements = () => {
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
    if (!achievementsLoading && achievements.length > 0) {
      notifyNewAchievements(achievements);
    }
  }, [achievements, achievementsLoading]);

  return {
    achievements,
    challenges,
    loading,
    streak,
    totalPenaltyPoints,
    level,
    experience,
    nextLevelExp,
    refreshAchievements,
    refreshChallenges
  };
};
