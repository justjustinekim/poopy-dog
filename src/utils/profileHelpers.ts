
import { supabase } from '@/integrations/supabase/client';
import { Profile } from '@/contexts/ProfileContext';

// Fallback function to get a profile when the RPC function isn't available
export async function fetchProfileWithFallback(userId: string) {
  try {
    // First try using a raw query instead of the typed RPC function
    const { data: rpcData, error: rpcError } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single();
      
    if (!rpcError && rpcData) {
      return { data: rpcData as Profile, error: null };
    }
    
    // If the first approach fails, try a direct query as fallback
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
    // Use a direct update approach instead of RPC
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
