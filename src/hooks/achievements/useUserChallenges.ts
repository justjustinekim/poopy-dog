
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Challenge } from "@/types";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";
import { ChallengeRow, UserChallengeRow } from "@/types/supabase";
import { mapChallengesWithProgress } from "./achievementUtils";

export const useUserChallenges = () => {
  const { user } = useAuth();
  const [challenges, setChallenges] = useState<Challenge[]>([]);
  const [challengesData, setChallengesData] = useState<ChallengeRow[]>([]);
  const [userChallengesData, setUserChallengesData] = useState<UserChallengeRow[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchChallenges = async () => {
    if (!user) {
      setLoading(false);
      return;
    }

    try {
      // Fetch active challenges
      const { data: fetchedChallengesData, error: challengesError } = await supabase
        .from('challenges')
        .select('*')
        .gte('end_date', new Date().toISOString())
        .order('start_date');
      
      if (challengesError) throw challengesError;
      setChallengesData(fetchedChallengesData as ChallengeRow[]);
      
      // Fetch user's challenge progress
      const { data: fetchedUserChallengesData, error: userChallengesError } = await supabase
        .from('user_challenges')
        .select('*')
        .eq('user_id', user.id);
      
      if (userChallengesError) throw userChallengesError;
      setUserChallengesData(fetchedUserChallengesData as UserChallengeRow[]);
      
      // Map challenges with user progress
      const mappedChallenges = mapChallengesWithProgress(
        fetchedChallengesData as ChallengeRow[],
        fetchedUserChallengesData as UserChallengeRow[]
      );
      
      setChallenges(mappedChallenges);
      
    } catch (error) {
      console.error("Error fetching challenges:", error);
      toast.error("Failed to load challenges");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchChallenges();
  }, [user]);

  return {
    challenges,
    challengesData,
    userChallengesData,
    loading,
    refreshChallenges: fetchChallenges
  };
};
