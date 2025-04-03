
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
      
      // Create a new profile with the user ID
      const { data: newProfile, error: createError } = await supabase
        .from('profiles')
        .insert([{ id: userId }])
        .select()
        .maybeSingle();
      
      if (createError) {
        console.error('Error creating profile:', createError);
        throw createError;
      }
      
      if (!newProfile) {
        console.error('Failed to create profile - no data returned');
        throw new Error('Failed to create profile');
      }
      
      console.log('Successfully created new profile:', newProfile);
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
