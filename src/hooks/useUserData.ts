
import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { Dog, PoopEntry } from '@/types';

export function useUserData() {
  const { user } = useAuth();
  const [dogs, setDogs] = useState<Dog[]>([]);
  const [entries, setEntries] = useState<PoopEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    let isMounted = true;
    
    const fetchUserData = async () => {
      if (!user) {
        if (isMounted) {
          setDogs([]);
          setEntries([]);
          setLoading(false);
        }
        return;
      }
      
      try {
        setLoading(true);
        
        // Fetch user's dogs
        const { data: dogsData, error: dogsError } = await supabase
          .from('dogs')
          .select('*')
          .eq('user_id', user.id);
        
        if (dogsError) throw dogsError;
        
        // Fetch user's poop entries
        const { data: entriesData, error: entriesError } = await supabase
          .from('poop_entries')
          .select('*')
          .eq('user_id', user.id)
          .order('date', { ascending: false });
        
        if (entriesError) throw entriesError;
        
        if (isMounted) {
          setDogs(dogsData as Dog[]);
          
          // Format entries to match our PoopEntry type
          const formattedEntries: PoopEntry[] = await Promise.all(
            entriesData.map(async (entry: any) => {
              let imageUrl = null;
              
              if (entry.image_path) {
                const { data: urlData } = supabase.storage
                  .from('poop_images')
                  .getPublicUrl(entry.image_path);
                
                imageUrl = urlData.publicUrl;
              }
              
              return {
                id: entry.id,
                dogId: entry.dog_id,
                date: entry.date,
                imageUrl: imageUrl,
                consistency: entry.consistency,
                color: entry.color,
                notes: entry.notes || undefined,
                tags: entry.notes?.split(" ").filter((tag: string) => tag.startsWith("#")) || [],
                location: entry.location || undefined,
              };
            })
          );
          
          setEntries(formattedEntries);
        }
      } catch (err) {
        console.error('Error fetching user data:', err);
        if (isMounted) {
          setError(err as Error);
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };
    
    fetchUserData();
    
    return () => {
      isMounted = false;
    };
  }, [user]);

  return {
    dogs,
    entries,
    loading,
    error
  };
}
