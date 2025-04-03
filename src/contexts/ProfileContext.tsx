
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './AuthContext';
import { toast } from 'sonner';
import { fetchProfileWithFallback, updateProfileWithFallback } from '@/utils/profileHelpers';

export interface Profile {
  id: string;
  username: string | null;
  avatar_url: string | null;
  created_at: string;
  updated_at: string;
}

interface ProfileContextType {
  profile: Profile | null;
  loading: boolean;
  error: Error | null;
  updateProfile: (updates: Partial<Profile>) => Promise<void>;
  uploadAvatar: (file: File) => Promise<string | null>;
}

const ProfileContext = createContext<ProfileContextType | undefined>(undefined);

export function useProfile() {
  const context = useContext(ProfileContext);
  if (context === undefined) {
    throw new Error('useProfile must be used within a ProfileProvider');
  }
  return context;
}

interface ProfileProviderProps {
  children: ReactNode;
}

export const ProfileProvider: React.FC<ProfileProviderProps> = ({ children }) => {
  const { user } = useAuth();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [fetchAttempted, setFetchAttempted] = useState(false);

  // Fetch profile when user changes
  useEffect(() => {
    let isMounted = true;
    
    const fetchProfile = async () => {
      if (!user) {
        if (isMounted) {
          // Clear profile when user logs out
          setProfile(null);
          setError(null);
          setLoading(false);
          setFetchAttempted(false);
        }
        return;
      }
      
      try {
        setLoading(true);
        console.log('Fetching profile for user:', user.id);
        
        // Use our fallback mechanism that handles both RPC and direct queries
        const { data, error } = await fetchProfileWithFallback(user.id);
        
        if (error) {
          console.error('Error fetching profile:', error);
          throw error;
        }
        
        if (isMounted && data) {
          console.log('Profile fetched successfully:', data);
          setProfile(data);
          setError(null);
        } else if (isMounted) {
          console.warn('No profile data returned for user:', user.id);
          setProfile(null);
          setError(new Error('No profile data returned'));
        }
      } catch (error) {
        console.error('Error in fetchProfile:', error);
        if (isMounted) {
          setError(error as Error);
          setProfile(null);
        }
      } finally {
        if (isMounted) {
          setLoading(false);
          setFetchAttempted(true);
        }
      }
    };

    fetchProfile();
    
    return () => {
      isMounted = false;
    };
  }, [user]);

  // Update profile function
  const updateProfile = async (updates: Partial<Profile>) => {
    if (!user) {
      toast.error('You must be logged in to update your profile');
      return;
    }
    
    try {
      setLoading(true);
      console.log('Updating profile with:', updates);
      
      // Use our fallback mechanism
      const { error: updateError } = await updateProfileWithFallback(user.id, updates);
        
      if (updateError) {
        throw updateError;
      }
      
      // Update local state
      setProfile(prev => prev ? { ...prev, ...updates } : null);
      toast.success('Profile updated successfully');
    } catch (error) {
      console.error('Error updating profile:', error);
      setError(error as Error);
      toast.error('Failed to update profile');
    } finally {
      setLoading(false);
    }
  };

  // Upload avatar function
  const uploadAvatar = async (file: File): Promise<string | null> => {
    if (!user) {
      toast.error('You must be logged in to upload an avatar');
      return null;
    }
    
    try {
      console.log('Uploading avatar for user:', user.id);
      const fileExt = file.name.split('.').pop();
      const fileName = `${user.id}/${Date.now()}.${fileExt}`;
      
      // Upload to Storage
      const { error: uploadError } = await supabase.storage
        .from('avatars')
        .upload(fileName, file, {
          cacheControl: '3600',
          upsert: true
        });
        
      if (uploadError) {
        console.error('Error uploading file:', uploadError);
        throw uploadError;
      }
      
      // Get public URL
      const { data } = supabase.storage
        .from('avatars')
        .getPublicUrl(fileName);
      
      const avatarUrl = data.publicUrl;
      console.log('Avatar uploaded successfully, URL:', avatarUrl);
      
      // Update profile
      await updateProfile({ avatar_url: avatarUrl });
      
      return avatarUrl;
    } catch (error) {
      console.error('Error uploading avatar:', error);
      toast.error('Failed to upload avatar');
      return null;
    }
  };

  // Add debug effect to log profile state changes
  useEffect(() => {
    console.log('ProfileContext state updated:', {
      profile,
      loading,
      error,
      fetchAttempted,
      userExists: !!user
    });
  }, [profile, loading, error, fetchAttempted, user]);

  const value = {
    profile,
    loading,
    error,
    updateProfile,
    uploadAvatar
  };

  return (
    <ProfileContext.Provider value={value}>
      {children}
    </ProfileContext.Provider>
  );
};

export default ProfileProvider;
