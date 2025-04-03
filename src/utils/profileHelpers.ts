
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

// Fetch profile with better error handling
export async function fetchProfileWithFallback(userId: string) {
  try {
    console.log('Fetching profile for user:', userId);
    
    // Use maybeSingle() instead of single() to handle the case where no profile exists
    const { data: existingProfile, error: fetchError } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .maybeSingle();
    
    if (fetchError) {
      console.error('Error fetching profile with standard query:', fetchError);
      throw fetchError;
    }
    
    // If no profile exists, create one
    if (!existingProfile) {
      console.log('No profile found, creating one for user:', userId);
      
      // Important change: Use auth.uid() to verify current user ID
      const { data: newProfile, error: createError } = await supabase.rpc('create_profile_for_user');
      
      if (createError) {
        console.error('Error creating profile with RPC:', createError);
        console.log('Falling back to direct insert with auth.uid() check...');
        
        // Fallback method: This should work because of our RLS policy
        const { data: fallbackProfile, error: fallbackError } = await supabase
          .from('profiles')
          .insert({ id: userId })
          .select()
          .single();
        
        if (fallbackError) {
          console.error('Error in fallback profile creation:', fallbackError);
          throw fallbackError;
        }
        
        if (!fallbackProfile) {
          console.error('Failed to create profile - no data returned from fallback');
          throw new Error('Failed to create profile with fallback method');
        }
        
        console.log('Successfully created new profile with fallback:', fallbackProfile);
        return { data: fallbackProfile, error: null };
      }
      
      if (!newProfile) {
        console.error('Failed to create profile - no data returned from RPC');
        throw new Error('Failed to create profile with RPC');
      }
      
      console.log('Successfully created new profile with RPC:', newProfile);
      return { data: newProfile, error: null };
    }
    
    console.log('Found existing profile:', existingProfile);
    
    // Verify the data matches the Profile structure
    if (isProfile(existingProfile)) {
      return { data: existingProfile, error: null };
    } else {
      console.error('Invalid profile data structure:', existingProfile);
      return { 
        data: null, 
        error: new Error('Invalid profile data structure') 
      };
    }
  } catch (error) {
    console.error('Error in profile fallback:', error);
    return { data: null, error };
  }
}

// Fallback function to update a profile when the RPC function isn't available
export async function updateProfileWithFallback(userId: string, updates: Partial<Profile>) {
  try {
    console.log('Updating profile for user:', userId, 'with updates:', updates);
    
    const { error } = await supabase
      .from('profiles')
      .update(updates)
      .eq('id', userId);
      
    if (error) {
      console.error('Error updating profile:', error);
      throw error;
    }
    
    console.log('Profile updated successfully');
    return { error: null };
  } catch (error) {
    console.error('Error in profile update fallback:', error);
    return { error };
  }
}
