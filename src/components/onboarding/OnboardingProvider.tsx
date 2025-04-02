
import React, { createContext, useContext, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { Dog } from "@/types";
import { v4 as uuidv4 } from 'uuid';
import { useDogs } from "@/hooks/useDogs";
import { useAuth } from "@/contexts/AuthContext";

interface OnboardingContextType {
  step: number;
  setStep: (step: number) => void;
  dogData: Partial<Dog>;
  setDogData: (data: Partial<Dog>) => void;
  dogs: Dog[];
  addDog: (dog: Dog) => void;
  dogAdded: boolean;
  setDogAdded: (added: boolean) => void;
  completedSteps: number[];
  setCompletedSteps: (steps: number[]) => void;
  healthData: any;
  setHealthData: (data: any) => void;
  lifestyleData: any;
  setLifestyleData: (data: any) => void;
  onboardingProgress: number;
  handleNextStep: () => void;
  handleBackStep: () => void;
  handleDogSubmit: (dog: Dog) => void;
  handleHealthAssessmentComplete: (data: any) => void;
  handleLifestyleAssessmentComplete: (data: any) => void;
  goToAddAnotherDog: () => void;
  totalSteps: number;
}

const OnboardingContext = createContext<OnboardingContextType | null>(null);

export const useOnboarding = () => {
  const context = useContext(OnboardingContext);
  if (!context) {
    throw new Error('useOnboarding must be used within an OnboardingProvider');
  }
  return context;
};

interface OnboardingProviderProps {
  children: React.ReactNode;
}

export const OnboardingProvider: React.FC<OnboardingProviderProps> = ({ children }) => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { dogs: dbDogs, addDog: addDogToDb } = useDogs();
  
  const [step, setStep] = useState(0);
  const [dogData, setDogData] = useState<Partial<Dog>>({
    name: "",
    breed: "",
    age: 0,
    weight: 0,
  });
  const [dogs, setDogs] = useState<Dog[]>([]);
  const [dogAdded, setDogAdded] = useState(false);
  const [completedSteps, setCompletedSteps] = useState<number[]>([]);
  const [healthData, setHealthData] = useState<any>(null);
  const [lifestyleData, setLifestyleData] = useState<any>(null);
  const [onboardingProgress, setOnboardingProgress] = useState(0);
  const totalSteps = 8; // Total number of steps in the onboarding process

  // Sync dogs from database
  useEffect(() => {
    if (dbDogs.length > 0) {
      setDogs(dbDogs);
    }
  }, [dbDogs]);

  useEffect(() => {
    // If user is coming back to onboarding and already has completed it,
    // redirect to dashboard
    const hasCompletedOnboarding = localStorage.getItem("onboardingCompleted");
    if (hasCompletedOnboarding === "true") {
      navigate("/dashboard");
    }
  }, [navigate]);

  useEffect(() => {
    // Update progress based on current step
    const progressPercentage = Math.min(100, Math.round((step / (totalSteps - 1)) * 100));
    setOnboardingProgress(progressPercentage);
  }, [step]);

  const goToAddAnotherDog = () => {
    setDogData({
      name: "",
      breed: "",
      age: 0,
      weight: 0,
    });
    setHealthData(null);
    setLifestyleData(null);
    setStep(4); // Go back to the add dog step
  };

  const handleNextStep = () => {
    if (!completedSteps.includes(step)) {
      setCompletedSteps([...completedSteps, step]);
    }
    
    if (step === totalSteps - 1) {
      // Complete onboarding
      localStorage.setItem("onboardingCompleted", "true");
      
      // Also store the dogs in local storage for demo purposes
      if (dogs.length > 0) {
        localStorage.setItem("dogs", JSON.stringify(dogs));
      }
      
      navigate("/dashboard");
      toast.success("Welcome to PoopyDog! Your dog(s) have been added.");
    } else {
      setStep(step + 1);
    }
  };

  const handleBackStep = () => {
    if (step > 0) {
      setStep(step - 1);
    } else {
      navigate("/");
    }
  };

  const handleDogSubmit = async (dog: Dog) => {
    try {
      // Save to Supabase if the user is logged in
      if (user) {
        const tempId = dog.id; // Store the temp ID
        delete dog.id; // Remove the ID so Supabase can generate a proper one
        
        // Add health and lifestyle data
        const dogWithData = {
          ...dog,
          healthAssessment: healthData,
          lifestyleData: lifestyleData,
        };
        
        // Add to Supabase
        const newDog = await addDogToDb(dogWithData);
        
        if (newDog) {
          // Set the new dog with DB-generated ID
          setDogData(newDog);
          setDogs(prevDogs => [...prevDogs, newDog]);
        } else {
          // Fallback to local storage if there was an error
          const dogWithId = {
            ...dog,
            id: tempId || uuidv4(),
          };
          
          setDogs(prevDogs => [...prevDogs, dogWithId]);
          setDogData(dogWithId);
        }
      } else {
        // Fallback for non-logged in users
        const dogWithId = {
          ...dog,
          id: dog.id || uuidv4(),
        };
        
        setDogs(prevDogs => [...prevDogs, dogWithId]);
        setDogData(dogWithId);
        
        // Store in local storage
        const storedDogs = JSON.parse(localStorage.getItem("dogs") || "[]");
        localStorage.setItem("dogs", JSON.stringify([...storedDogs, dogWithId]));
      }
      
      toast.success(`${dog.name} has been added!`);
      setDogAdded(true);
      handleNextStep();
    } catch (error) {
      console.error("Error adding dog:", error);
      toast.error("There was a problem adding your dog. Please try again.");
    }
  };

  const addDog = (dog: Dog) => {
    setDogs(prevDogs => [...prevDogs, dog]);
  };

  const handleHealthAssessmentComplete = (data: any) => {
    setHealthData(data);
    
    // In a real app, we would store this data with the dog profile
    // Will be done in handleDogSubmit for Supabase storage
    if (dogAdded && dogs.length > 0) {
      const updatedDogs = [...dogs];
      const lastDog = updatedDogs[updatedDogs.length - 1];
      
      if (lastDog) {
        lastDog.healthAssessment = data;
        setDogs(updatedDogs);
      }
    }
    
    handleNextStep();
  };

  const handleLifestyleAssessmentComplete = (data: any) => {
    setLifestyleData(data);
    
    // Store lifestyle data with the dog profile
    // Will be done in handleDogSubmit for Supabase storage
    if (dogAdded && dogs.length > 0) {
      const updatedDogs = [...dogs];
      const lastDog = updatedDogs[updatedDogs.length - 1];
      
      if (lastDog) {
        lastDog.lifestyleData = data;
        setDogs(updatedDogs);
      }
    }
    
    handleNextStep();
  };

  const value = {
    step,
    setStep,
    dogData,
    setDogData,
    dogs,
    addDog,
    dogAdded,
    setDogAdded,
    completedSteps,
    setCompletedSteps,
    healthData,
    setHealthData,
    lifestyleData,
    setLifestyleData,
    onboardingProgress,
    handleNextStep,
    handleBackStep,
    handleDogSubmit,
    handleHealthAssessmentComplete,
    handleLifestyleAssessmentComplete,
    goToAddAnotherDog,
    totalSteps
  };

  return (
    <OnboardingContext.Provider value={value}>
      {children}
    </OnboardingContext.Provider>
  );
};

export default OnboardingProvider;
