
import { supabase } from '@/integrations/supabase/client';
import { Profile } from '@/contexts/ProfileContext';

// Fallback function to get a profile when the RPC function isn't available
export async function fetchProfileWithFallback(userId: string) {
  try {
    // Use type assertions to handle 'profiles' table not being in type definitions
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single();
      
    if (error) {
      throw error;
    }
    
    return { data: data as Profile, error: null };
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
      .from('profiles')
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
