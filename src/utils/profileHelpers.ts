
import { supabase } from '@/integrations/supabase/client';
import { Profile } from '@/contexts/ProfileContext';

// Helper function to check if the data matches the Profile structure
function isProfile(data: any): data is Profile {
  return (
    data &&
    typeof data.id === 'string' &&
    (data.username === null || typeof data.username === 'string') &&
    (data.avatar_url === null || typeof data.avatar_url === 'string') &&
    typeof data.created_at === 'string' &&
    typeof data.updated_at === 'string'
  );
}

// Fallback function to get a profile when the RPC function isn't available
export async function fetchProfileWithFallback(userId: string) {
  try {
    // Use type assertions to handle 'profiles' table not being in type definitions
    const { data, error } = await supabase
      .from('profiles' as any)
      .select('*')
      .eq('id', userId)
      .single();
      
    if (error) {
      throw error;
    }
    
    // Verify the data is a Profile before returning it
    if (isProfile(data)) {
      return { data, error: null };
    } else {
      console.error('Data returned does not match Profile structure:', data);
      return { data: null, error: new Error('Invalid profile data structure') };
    }
  } catch (error) {
    console.error('Error in profile fallback:', error);
    return { data: null, error };
  }
}

// Fallback function to update a profile when the RPC function isn't available
export async function updateProfileWithFallback(userId: string, updates: Partial<Profile>) {
  try {
    // Use type assertions to handle 'profiles' table not being in type definitions
    const { error } = await supabase
      .from('profiles' as any)
      .update(updates)
      .eq('id', userId);
      
    if (error) {
      throw error;
    }
    
    return { error: null };
  } catch (error) {
    console.error('Error in profile update fallback:', error);
    return { error };
  }
}
