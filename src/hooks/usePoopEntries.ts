
import { useState, useEffect } from "react";
import { PoopEntry, Dog } from "@/types";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { PoopEntryRow } from "@/types/supabase";

export const usePoopEntries = (selectedDog: Dog | null) => {
  const { user } = useAuth();
  const [entries, setEntries] = useState<PoopEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchEntries = async () => {
    if (!user || !selectedDog) {
      setEntries([]);
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('poop_entries')
        .select('*')
        .eq('user_id', user.id)
        .eq('dog_id', selectedDog.id)
        .order('date', { ascending: false });

      if (error) throw error;

      if (data) {
        const formattedEntries: PoopEntry[] = await Promise.all(data.map(async (entry: PoopEntryRow) => {
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
            consistency: entry.consistency as any,
            color: entry.color as any,
            notes: entry.notes || undefined,
            tags: entry.notes?.split(" ").filter(tag => tag.startsWith("#")) || [],
            location: entry.location || undefined,
          };
        }));
        
        setEntries(formattedEntries);
      }
    } catch (err) {
      setError(err as Error);
      console.error("Error fetching poop entries:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEntries();
  }, [user, selectedDog]);

  const addEntry = (newEntry: PoopEntry) => {
    setEntries(prevEntries => [newEntry, ...prevEntries]);
  };

  return {
    entries,
    loading,
    error,
    fetchEntries,
    addEntry
  };
};
