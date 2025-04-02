
import { useState, useEffect } from "react";
import { useUserAchievements } from "./useUserAchievements";
import { useUserChallenges } from "./useUserChallenges";
import { calculatePlayerStats } from "./achievementUtils";

export const usePlayerStats = () => {
  const { achievements, totalPenaltyPoints, loading: achievementsLoading } = useUserAchievements();
  const { challengesData, userChallengesData, loading: challengesLoading } = useUserChallenges();
  
  const [level, setLevel] = useState(1);
  const [experience, setExperience] = useState(0);
  const [nextLevelExp, setNextLevelExp] = useState(100);
  
  useEffect(() => {
    if (!achievementsLoading && !challengesLoading && challengesData) {
      const stats = calculatePlayerStats(
        achievements,
        userChallengesData,
        challengesData,
        totalPenaltyPoints
      );
      
      setLevel(stats.level);
      setExperience(stats.experience);
      setNextLevelExp(stats.nextLevelExp);
    }
  }, [achievements, challengesData, userChallengesData, totalPenaltyPoints, achievementsLoading, challengesLoading]);
  
  return {
    level,
    experience,
    nextLevelExp,
    loading: achievementsLoading || challengesLoading
  };
};
