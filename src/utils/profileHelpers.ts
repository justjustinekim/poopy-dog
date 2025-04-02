
import { supabase } from '@/integrations/supabase/client';
import { Profile } from '@/contexts/ProfileContext';

// Fallback function to get a profile when the RPC function isn't available
export async function fetchProfileWithFallback(userId: string) {
  try {
    // First try the RPC function
    const { data: rpcData, error: rpcError } = await supabase
      .rpc('get_profile', { user_id_input: userId })
      .single();
      
    if (!rpcError && rpcData) {
      return { data: rpcData as Profile, error: null };
    }
    
    // If RPC fails, fall back to a direct query with type assertion
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
    // First try the RPC function
    const { error: rpcError } = await supabase
      .rpc('update_profile', {
        user_id_input: userId,
        username_input: updates.username,
        avatar_url_input: updates.avatar_url
      });
      
    if (!rpcError) {
      return { error: null };
    }
    
    // If RPC fails, fall back to a direct update with type assertion
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
