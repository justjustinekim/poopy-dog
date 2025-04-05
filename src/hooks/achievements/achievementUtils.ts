
import { Achievement, Challenge } from "@/types";
import { AchievementRow, UserAchievementRow, ChallengeRow, UserChallengeRow } from "@/types/supabase";
import { toast } from "sonner";

// Track which achievements have been notified recently to prevent duplicates
const recentlyNotifiedAchievements = new Set<string>();
const NOTIFICATION_COOLDOWN_MS = 60000; // 1 minute cooldown

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
 * Implements deduplication to prevent notification spam
 */
export const notifyNewAchievements = (achievements: Achievement[]): boolean => {
  // Skip notification if no achievements or empty array
  if (!achievements || achievements.length === 0) {
    return false;
  }
  
  // Only notify about achievements unlocked in the last 10 seconds that haven't been recently notified
  const newlyUnlocked = achievements.filter(
    a => a.unlocked && !a.isNegative && a.dateUnlocked && 
    new Date(a.dateUnlocked).getTime() > (Date.now() - 1000 * 10) && // Unlocked in last 10 seconds
    !recentlyNotifiedAchievements.has(a.id) // Not recently notified
  );
  
  const newlyNegative = achievements.filter(
    a => a.unlocked && a.isNegative && a.dateUnlocked && 
    new Date(a.dateUnlocked).getTime() > (Date.now() - 1000 * 10) && // Unlocked in last 10 seconds
    !recentlyNotifiedAchievements.has(a.id) // Not recently notified
  );
  
  // Show at most one toast for positive achievements and one for negative
  // to prevent notification spam
  const positiveAchievement = newlyUnlocked.length > 0 ? newlyUnlocked[0] : null;
  const negativeAchievement = newlyNegative.length > 0 ? newlyNegative[0] : null;
  
  if (positiveAchievement) {
    // Add to recently notified set and set timeout to remove it
    recentlyNotifiedAchievements.add(positiveAchievement.id);
    setTimeout(() => {
      recentlyNotifiedAchievements.delete(positiveAchievement.id);
    }, NOTIFICATION_COOLDOWN_MS);
    
    // Show consolidated notification if there are multiple achievements
    if (newlyUnlocked.length > 1) {
      toast.success(`${newlyUnlocked.length} Achievements Unlocked!`, {
        description: `Including: ${positiveAchievement.title} (+50 Poop Coins)`,
        duration: 4000,
        dismissible: true
      });
    } else {
      toast.success(`Achievement Unlocked: ${positiveAchievement.title}`, {
        description: `${positiveAchievement.description} (+50 Poop Coins)`,
        duration: 4000,
        dismissible: true
      });
    }
  }
  
  if (negativeAchievement) {
    // Add to recently notified set and set timeout to remove it
    recentlyNotifiedAchievements.add(negativeAchievement.id);
    setTimeout(() => {
      recentlyNotifiedAchievements.delete(negativeAchievement.id);
    }, NOTIFICATION_COOLDOWN_MS);
    
    // Show consolidated notification if there are multiple negative achievements
    if (newlyNegative.length > 1) {
      toast.error(`${newlyNegative.length} Setbacks Occurred`, {
        description: `Including: ${negativeAchievement.title} (+1 Stink Badge)`,
        duration: 4000,
        dismissible: true
      });
    } else {
      toast.error(`Setback Occurred: ${negativeAchievement.title}`, {
        description: `${negativeAchievement.description} (+1 Stink Badge)`,
        duration: 4000,
        dismissible: true
      });
    }
  }
  
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
