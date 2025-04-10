export interface Dog {
  id: string;
  name: string;
  breed: string;
  age: number;
  weight: number;
  imageUrl?: string;
  dietType?: string;
  digestiveHealth?: string;
  poopFrequency?: string;
  foodSensitivity?: string;
  digestiveIssues?: string[];
  personalityTraits?: string[];
  favoriteTreats?: string;
  birthdate?: string;
  microchipped?: boolean;
  adoptionStory?: string;
  healthAssessment?: any;
  lifestyleData?: any;
}

export type PoopConsistency = 'solid' | 'soft' | 'liquid' | 'normal' | 'other';
export type PoopColor = 'brown' | 'green' | 'yellow' | 'red' | 'black' | 'white' | 'other';

export interface PoopEntry {
  id: string;
  dogId: string;
  date: string;
  imageUrl?: string;
  consistency: PoopConsistency;
  color: PoopColor;
  notes?: string;
  tags?: string[];
  location?: string;
  colorSpectrum?: string;
}

export interface HealthInsight {
  title: string;
  description: string;
  severity: 'low' | 'medium' | 'high';
  recommendation?: string;
}

export interface HealthAssessmentData {
  consistency: string;
  frequency: string;
  issues: string[];
  customConsistency?: string;
  customFrequency?: string;
  customIssue?: string;
}

export interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  unlocked: boolean;
  isNegative?: boolean;
  progress?: number;
  maxProgress?: number;
  dateUnlocked?: string;
  penaltyPoints?: number;
  achievementType: 'standard' | 'daily' | 'weekly' | 'monthly' | string;
}

export interface Challenge {
  id: string;
  title: string;
  description: string;
  icon: string;
  points: number;
  startDate: string;
  endDate: string;
  progress?: number;
  maxProgress: number;
  completed?: boolean;
  dateCompleted?: string;
  challengeType: 'daily' | 'weekly' | 'monthly' | string;
  memeTemplate?: string;
}

export interface BadgeType {
  id: string;
  name: string;
  icon: string;
  rarity: 'common' | 'uncommon' | 'rare' | 'epic' | 'legendary';
  description: string;
}

export interface UserProfile {
  id: string;
  username: string;
  avatarUrl?: string;
  bio?: string;
  location?: string;
  joinDate: string;
  level: number;
  experience: number;
  badges: BadgeType[];
  achievements: Achievement[];
  streak: number;
  dogs: Dog[];
}

export interface SocialPost {
  id: string;
  userId: string;
  username: string;
  userAvatarUrl?: string;
  content: string;
  imageUrl?: string;
  poopEntryId?: string;
  likes: number;
  comments: number;
  createdAt: string;
  tags?: string[];
  dogName?: string;
}

export interface Comment {
  id: string;
  postId: string;
  userId: string;
  username: string;
  userAvatarUrl?: string;
  content: string;
  createdAt: string;
  likes: number;
}

export interface RewardItem {
  id: string;
  name: string;
  description: string;
  imageUrl: string;
  cost: number;
  type: 'badge' | 'filter' | 'flair' | 'emote';
  unlocked: boolean;
}

export interface UserRewards {
  poopCoins: number;
  stinkBadges: number;
  unlockedItems: RewardItem[];
}

export interface MemeTemplate {
  id: string;
  name: string;
  imageUrl: string;
  topText?: string;
  bottomText?: string;
  challengeId?: string;
}

export interface LeaderboardUser {
  id: string;
  username: string;
  avatarUrl?: string;
  perfectPoops: number;
  rank: number;
}

export interface LeaderboardData {
  currentUser?: LeaderboardUser;
  topUsers: LeaderboardUser[];
}
