
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
