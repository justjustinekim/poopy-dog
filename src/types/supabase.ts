
// Custom Supabase database types
export interface PoopEntryRow {
  id: string;
  user_id: string;
  dog_id: string;
  image_path: string | null;
  consistency: string;
  color: string;
  date: string;
  notes: string | null;
  location: string | null;
  created_at: string;
}

export interface AchievementRow {
  id: string;
  title: string;
  description: string;
  icon: string;
  is_negative: boolean;
  penalty_points: number | null;
  max_progress: number | null;
  achievement_type: string;
  trigger_condition: string | null;
  trigger_value: number | null;
  created_at: string;
  updated_at: string;
}

export interface UserAchievementRow {
  id: string;
  user_id: string;
  achievement_id: string;
  progress: number;
  unlocked: boolean;
  unlocked_at: string | null;
  created_at: string;
  updated_at: string;
}

export interface ChallengeRow {
  id: string;
  title: string;
  description: string;
  icon: string;
  points: number;
  start_date: string;
  end_date: string;
  challenge_type: string;
  condition: string;
  condition_value: number;
  created_at: string;
  updated_at: string;
}

export interface UserChallengeRow {
  id: string;
  user_id: string;
  challenge_id: string;
  progress: number;
  completed: boolean;
  completed_at: string | null;
  created_at: string;
  updated_at: string;
}
