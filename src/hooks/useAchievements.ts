
import { useState, useEffect } from "react";
import { Achievement, Challenge } from "@/types";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";
import { AchievementRow, UserAchievementRow, ChallengeRow, UserChallengeRow } from "@/types/supabase";

export const useAchievements = () => {
  const { user } = useAuth();
  const [achievements, setAchievements] = useState<Achievement[]>([]);
  const [challenges, setChallenges] = useState<Challenge[]>([]);
  const [loading, setLoading] = useState(true);
  const [streak, setStreak] = useState(0);
  const [totalPenaltyPoints, setTotalPenaltyPoints] = useState(0);
  const [level, setLevel] = useState(1);
  const [experience, setExperience] = useState(0);
  const [nextLevelExp, setNextLevelExp] = useState(100);

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
      const mappedAchievements: Achievement[] = (achievementsData as AchievementRow[]).map((achievement) => {
        const userAchievement = (userAchievementsData as UserAchievementRow[])?.find(
          (ua) => ua.achievement_id === achievement.id
        );
        
        return {
          id: achievement.id,
          title: achievement.title,
          description: achievement.description,
          icon: achievement.icon,
          isNegative: achievement.is_negative || false,
          penaltyPoints: achievement.penalty_points,
          maxProgress: achievement.max_progress || achievement.trigger_value,
          progress: userAchievement?.progress || 0,
          unlocked: userAchievement?.unlocked || false,
          dateUnlocked: userAchievement?.unlocked_at,
          achievementType: achievement.achievement_type
        };
      });
      
      setAchievements(mappedAchievements);
      
      // Calculate total penalty points
      const penaltyPoints = mappedAchievements
        .filter(a => a.isNegative && a.unlocked)
        .reduce((total, achievement) => total + (achievement.penaltyPoints || 0), 0);
      
      setTotalPenaltyPoints(penaltyPoints);
      
      // Calculate current streak
      const streakAchievement = mappedAchievements.find(
        a => a.title.includes('Streak') && !a.isNegative
      );
      if (streakAchievement) {
        setStreak(streakAchievement.progress || 0);
      }
      
    } catch (error) {
      console.error("Error fetching achievements:", error);
      toast.error("Failed to load achievements");
    } finally {
      setLoading(false);
    }
  };

  const fetchChallenges = async () => {
    if (!user) {
      return;
    }

    try {
      // Fetch active challenges
      const { data: challengesData, error: challengesError } = await supabase
        .from('challenges')
        .select('*')
        .gte('end_date', new Date().toISOString())
        .order('start_date');
      
      if (challengesError) throw challengesError;
      
      // Fetch user's challenge progress
      const { data: userChallengesData, error: userChallengesError } = await supabase
        .from('user_challenges')
        .select('*')
        .eq('user_id', user.id);
      
      if (userChallengesError) throw userChallengesError;
      
      // Map challenges with user progress
      const mappedChallenges: Challenge[] = (challengesData as ChallengeRow[]).map((challenge) => {
        const userChallenge = (userChallengesData as UserChallengeRow[])?.find(
          (uc) => uc.challenge_id === challenge.id
        );
        
        return {
          id: challenge.id,
          title: challenge.title,
          description: challenge.description,
          icon: challenge.icon,
          points: challenge.points,
          startDate: challenge.start_date,
          endDate: challenge.end_date,
          progress: userChallenge?.progress || 0,
          maxProgress: challenge.condition_value,
          completed: userChallenge?.completed || false,
          dateCompleted: userChallenge?.completed_at,
          challengeType: challenge.challenge_type
        };
      });
      
      setChallenges(mappedChallenges);
      
      // Calculate level and experience
      // Simple formula: each completed achievement gives 50 XP, each challenge gives its points value
      const achievementXP = achievements
        .filter(a => a.unlocked && !a.isNegative)
        .length * 50;
      
      const challengeXP = (userChallengesData as UserChallengeRow[])
        ?.filter((uc) => uc.completed)
        .reduce((total: number, uc) => {
          const challenge = (challengesData as ChallengeRow[]).find((c) => c.id === uc.challenge_id);
          return total + (challenge?.points || 0);
        }, 0) || 0;
      
      const totalXP = achievementXP + challengeXP - totalPenaltyPoints;
      setExperience(Math.max(0, totalXP));
      
      // Simple level calculation: level = 1 + floor(totalXP / 100)
      const calculatedLevel = 1 + Math.floor(totalXP / 100);
      setLevel(calculatedLevel);
      setNextLevelExp((calculatedLevel) * 100);
      
    } catch (error) {
      console.error("Error fetching challenges:", error);
      toast.error("Failed to load challenges");
    }
  };

  const checkForNewAchievements = () => {
    const newlyUnlocked = achievements.filter(
      a => a.unlocked && !a.isNegative && a.dateUnlocked && 
      new Date(a.dateUnlocked).getTime() > (Date.now() - 1000 * 10) // Unlocked in last 10 seconds
    );
    
    const newlyNegative = achievements.filter(
      a => a.unlocked && a.isNegative && a.dateUnlocked && 
      new Date(a.dateUnlocked).getTime() > (Date.now() - 1000 * 10) // Unlocked in last 10 seconds
    );
    
    // Show toast for newly unlocked achievements
    newlyUnlocked.forEach(achievement => {
      toast.success(`Achievement Unlocked: ${achievement.title}`, {
        description: achievement.description
      });
    });
    
    // Show toast for newly triggered negative achievements
    newlyNegative.forEach(achievement => {
      toast.error(`Setback Occurred: ${achievement.title}`, {
        description: achievement.description
      });
    });
    
    return newlyUnlocked.length > 0 || newlyNegative.length > 0;
  };

  useEffect(() => {
    fetchAchievements();
  }, [user]);

  useEffect(() => {
    if (achievements.length > 0) {
      fetchChallenges();
      checkForNewAchievements();
    }
  }, [achievements]);

  return {
    achievements,
    challenges,
    loading,
    streak,
    totalPenaltyPoints,
    level,
    experience,
    nextLevelExp,
    refreshAchievements: fetchAchievements,
    refreshChallenges: fetchChallenges
  };
};
