
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Dog } from "@/types";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";

export const useDogs = () => {
  const [dogs, setDogs] = useState<Dog[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuth();

  // Fetch dogs from Supabase
  const fetchDogs = async () => {
    if (!user) {
      setDogs([]);
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      
      const { data, error } = await supabase
        .from("dogs")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) {
        throw error;
      }

      // Transform database data to match our Dog type
      const transformedDogs: Dog[] = data.map((dog) => ({
        id: dog.id,
        name: dog.name,
        breed: dog.breed,
        age: dog.age,
        weight: dog.weight,
        imageUrl: dog.image_url || undefined,
        dietType: dog.diet_type || undefined,
        digestiveHealth: dog.digestive_health || undefined,
        poopFrequency: dog.poop_frequency || undefined,
        foodSensitivity: dog.food_sensitivity || undefined,
        digestiveIssues: dog.digestive_issues || undefined,
        personalityTraits: dog.personality_traits || undefined,
        favoriteTreats: dog.favorite_treats || undefined,
        birthdate: dog.birthdate || undefined,
        microchipped: dog.microchipped || undefined,
        adoptionStory: dog.adoption_story || undefined,
        healthAssessment: dog.health_assessment || undefined,
        lifestyleData: dog.lifestyle_data || undefined,
      }));

      setDogs(transformedDogs);
    } catch (error) {
      console.error("Error fetching dogs:", error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  // Add a new dog to Supabase
  const addDog = async (dog: Omit<Dog, "id">) => {
    if (!user) {
      toast.error("You need to be logged in to add a dog");
      return null;
    }

    try {
      // Transform dog data to match database schema
      const dogData = {
        name: dog.name,
        breed: dog.breed,
        age: dog.age,
        weight: dog.weight,
        image_url: dog.imageUrl,
        diet_type: dog.dietType,
        digestive_health: dog.digestiveHealth,
        poop_frequency: dog.poopFrequency,
        food_sensitivity: dog.foodSensitivity,
        digestive_issues: dog.digestiveIssues,
        personality_traits: dog.personalityTraits,
        favorite_treats: dog.favoriteTreats,
        birthdate: dog.birthdate,
        microchipped: dog.microchipped,
        adoption_story: dog.adoptionStory,
        health_assessment: dog.healthAssessment,
        lifestyle_data: dog.lifestyleData,
      };

      const { data, error } = await supabase
        .from("dogs")
        .insert(dogData)
        .select("*")
        .single();

      if (error) {
        throw error;
      }

      // Transform the returned data back to our Dog type
      const newDog: Dog = {
        id: data.id,
        name: data.name,
        breed: data.breed,
        age: data.age,
        weight: data.weight,
        imageUrl: data.image_url || undefined,
        dietType: data.diet_type || undefined,
        digestiveHealth: data.digestive_health || undefined,
        poopFrequency: data.poop_frequency || undefined,
        foodSensitivity: data.food_sensitivity || undefined,
        digestiveIssues: data.digestive_issues || undefined,
        personalityTraits: data.personality_traits || undefined,
        favoriteTreats: data.favorite_treats || undefined,
        birthdate: data.birthdate || undefined,
        microchipped: data.microchipped || undefined,
        adoptionStory: data.adoption_story || undefined,
        healthAssessment: data.health_assessment || undefined,
        lifestyleData: data.lifestyle_data || undefined,
      };

      setDogs(prevDogs => [newDog, ...prevDogs]);
      toast.success(`${newDog.name} has been added to your pack!`);
      return newDog;
    } catch (error) {
      console.error("Error adding dog:", error);
      toast.error("Failed to add dog");
      return null;
    }
  };

  // Update a dog in Supabase
  const updateDog = async (dog: Dog) => {
    if (!user) {
      toast.error("You need to be logged in to update a dog");
      return false;
    }

    try {
      // Transform dog data to match database schema
      const dogData = {
        name: dog.name,
        breed: dog.breed,
        age: dog.age,
        weight: dog.weight,
        image_url: dog.imageUrl,
        diet_type: dog.dietType,
        digestive_health: dog.digestiveHealth,
        poop_frequency: dog.poopFrequency,
        food_sensitivity: dog.foodSensitivity,
        digestive_issues: dog.digestiveIssues,
        personality_traits: dog.personalityTraits,
        favorite_treats: dog.favoriteTreats,
        birthdate: dog.birthdate,
        microchipped: dog.microchipped,
        adoption_story: dog.adoptionStory,
        health_assessment: dog.healthAssessment,
        lifestyle_data: dog.lifestyleData,
      };

      const { error } = await supabase
        .from("dogs")
        .update(dogData)
        .eq("id", dog.id);

      if (error) {
        throw error;
      }

      setDogs(prevDogs =>
        prevDogs.map(d => (d.id === dog.id ? dog : d))
      );
      
      toast.success(`${dog.name}'s profile has been updated`);
      return true;
    } catch (error) {
      console.error("Error updating dog:", error);
      toast.error("Failed to update dog");
      return false;
    }
  };

  // Delete a dog from Supabase
  const deleteDog = async (dogId: string) => {
    if (!user) {
      toast.error("You need to be logged in to delete a dog");
      return false;
    }

    try {
      const { error } = await supabase
        .from("dogs")
        .delete()
        .eq("id", dogId);

      if (error) {
        throw error;
      }

      setDogs(prevDogs => prevDogs.filter(dog => dog.id !== dogId));
      toast.success("Dog removed successfully");
      return true;
    } catch (error) {
      console.error("Error deleting dog:", error);
      toast.error("Failed to delete dog");
      return false;
    }
  };

  // Fetch dogs when the component mounts or user changes
  useEffect(() => {
    fetchDogs();
  }, [user]);

  return {
    dogs,
    loading,
    error,
    fetchDogs,
    addDog,
    updateDog,
    deleteDog
  };
};
