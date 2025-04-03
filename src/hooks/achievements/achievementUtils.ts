
import { Achievement, Challenge } from "@/types";
import { AchievementRow, UserAchievementRow, ChallengeRow, UserChallengeRow } from "@/types/supabase";
import { toast } from "sonner";

/**
 * Maps database achievement records to the application Achievement type
 */
export const mapAchievementsWithProgress = (
  achievementsData: AchievementRow[],
  userAchievementsData: UserAchievementRow[]
): Achievement[] => {
  return achievementsData.map((achievement) => {
    const userAchievement = userAchievementsData?.find(
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
      achievementType: achievement.achievement_type as Achievement['achievementType']
    };
  });
};

/**
 * Maps database challenge records to the application Challenge type
 */
export const mapChallengesWithProgress = (
  challengesData: ChallengeRow[],
  userChallengesData: UserChallengeRow[]
): Challenge[] => {
  return challengesData.map((challenge) => {
    const userChallenge = userChallengesData?.find(
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
      challengeType: challenge.challenge_type as Challenge['challengeType']
    };
  });
};

/**
 * Calculates total penalty points from achievements
 */
export const calculatePenaltyPoints = (achievements: Achievement[]): number => {
  return achievements
    .filter(a => a.isNegative && a.unlocked)
    .reduce((total, achievement) => total + (achievement.penaltyPoints || 0), 0);
};

/**
 * Finds the streak achievement and returns its progress
 */
export const getCurrentStreak = (achievements: Achievement[]): number => {
  const streakAchievement = achievements.find(
    a => a.title.includes('Streak') && !a.isNegative
  );
  return streakAchievement?.progress || 0;
};

/**
 * Checks for newly unlocked achievements and displays toast notifications
 * Will only notify if there are actual achievements to show and user is authenticated
 */
export const notifyNewAchievements = (achievements: Achievement[]): boolean => {
  // Skip notification if no achievements or empty array
  if (!achievements || achievements.length === 0) {
    return false;
  }
  
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
      description: `${achievement.description} (+50 Poop Coins!)`
    });
  });
  
  // Show toast for newly triggered negative achievements
  newlyNegative.forEach(achievement => {
    toast.error(`Setback Occurred: ${achievement.title}`, {
      description: `${achievement.description} (+1 Stink Badge)`
    });
  });
  
  return newlyUnlocked.length > 0 || newlyNegative.length > 0;
};

/**
 * Calculate player level and experience from achievements and challenges
 */
export const calculatePlayerStats = (
  achievements: Achievement[], 
  userChallengesData: UserChallengeRow[],
  challengesData: ChallengeRow[],
  penaltyPoints: number
) => {
  // Simple formula: each completed achievement gives 50 XP, each challenge gives its points value
  const achievementXP = achievements
    .filter(a => a.unlocked && !a.isNegative)
    .length * 50;
  
  const challengeXP = userChallengesData
    ?.filter((uc) => uc.completed)
    .reduce((total: number, uc) => {
      const challenge = challengesData.find((c) => c.id === uc.challenge_id);
      return total + (challenge?.points || 0);
    }, 0) || 0;
  
  const totalXP = Math.max(0, achievementXP + challengeXP - penaltyPoints);
  
  // Simple level calculation: level = 1 + floor(totalXP / 100)
  const calculatedLevel = 1 + Math.floor(totalXP / 100);
  const nextLevelXP = calculatedLevel * 100;
  
  return {
    experience: totalXP,
    level: calculatedLevel,
    nextLevelExp: nextLevelXP
  };
};

/**
 * Converts challenge points to Poop Coins
 */
export const calculatePoopCoins = (
  achievements: Achievement[],
  completedChallenges: Challenge[]
): number => {
  // Each non-negative achievement gives 50 coins
  const achievementCoins = achievements
    .filter(a => a.unlocked && !a.isNegative)
    .length * 50;
  
  // Each completed challenge gives its points value in coins
  const challengeCoins = completedChallenges
    .filter(c => c.completed)
    .reduce((total, c) => total + c.points, 0);
  
  return achievementCoins + challengeCoins;
};

/**
 * Calculate StinkBadges from negative achievements
 */
export const calculateStinkBadges = (
  achievements: Achievement[]
): number => {
  // Each negative achievement gives 1 stink badge
  return achievements
    .filter(a => a.unlocked && a.isNegative)
    .length;
};
