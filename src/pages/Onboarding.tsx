
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import Layout from "@/components/Layout";
import { useAuth } from "@/contexts/AuthContext";
import OnboardingStep from "@/components/onboarding/OnboardingStep";
import DogOnboardingForm from "@/components/onboarding/DogOnboardingForm";
import { Dog } from "@/types";
import { toast } from "sonner";
import { Poop, ArrowRight, Dog as DogIcon, Camera, Trophy, Check } from "lucide-react";
import { v4 as uuidv4 } from 'uuid';

const Onboarding = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [step, setStep] = useState(0);
  const [dogData, setDogData] = useState<Partial<Dog>>({
    name: "",
    breed: "",
    age: 0,
    weight: 0,
  });
  const [dogAdded, setDogAdded] = useState(false);
  const [completedSteps, setCompletedSteps] = useState<number[]>([]);

  useEffect(() => {
    // If user is coming back to onboarding and already has completed it,
    // redirect to dashboard
    const hasCompletedOnboarding = localStorage.getItem("onboardingCompleted");
    if (hasCompletedOnboarding === "true") {
      navigate("/dashboard");
    }
  }, [navigate]);

  const handleNextStep = () => {
    if (!completedSteps.includes(step)) {
      setCompletedSteps([...completedSteps, step]);
    }
    
    if (step === 5) {
      // Complete onboarding
      localStorage.setItem("onboardingCompleted", "true");
      
      // Also store the dog in local storage for demo purposes
      if (dogAdded) {
        const existingDogs = JSON.parse(localStorage.getItem("dogs") || "[]");
        localStorage.setItem("dogs", JSON.stringify([...existingDogs]));
      }
      
      navigate("/dashboard");
      toast.success("Welcome to PoopyDog! Your dog has been added.");
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

  const handleDogSubmit = (dog: Dog) => {
    // For demo purposes, we'll just store it in local storage
    // In a real app, this would be sent to a backend
    const dogWithId = {
      ...dog,
      id: uuidv4(),
    };
    
    const existingDogs = JSON.parse(localStorage.getItem("dogs") || "[]");
    localStorage.setItem("dogs", JSON.stringify([...existingDogs, dogWithId]));
    
    toast.success(`${dog.name} has been added!`);
    setDogAdded(true);
    handleNextStep();
  };

  const welcomeContent = (
    <div className="text-center space-y-6">
      <div className="flex justify-center">
        <div className="relative">
          <DogIcon className="h-24 w-24 text-primary animate-float" />
          <div className="absolute inset-0 bg-primary/20 rounded-full blur-md -z-10 scale-110"></div>
        </div>
      </div>
      
      <h1 className="text-3xl font-bold">Welcome to PoopyDog</h1>
      <p className="text-lg text-gray-600 dark:text-gray-300">
        Let's start tracking your dog's gut health for a happier, healthier pooch!
      </p>
      <div className="flex flex-col space-y-4 max-w-xs mx-auto">
        <Button onClick={handleNextStep} className="w-full">
          Get Started <ArrowRight className="ml-2 h-4 w-4" />
        </Button>
      </div>
    </div>
  );
  
  const infoContent = (
    <div className="text-center space-y-6">
      <div className="flex justify-center">
        <div className="relative">
          <Poop className="h-20 w-20 text-primary animate-pulse" />
          <div className="absolute inset-0 bg-primary/20 rounded-full blur-md -z-10 scale-110"></div>
        </div>
      </div>
      
      <h1 className="text-2xl font-bold">Poop Tracking Made Easy</h1>
      <p className="text-gray-600 dark:text-gray-300">
        Monitoring your dog's digestive health is crucial for their overall wellbeing. We'll help you track consistency, color, and frequency to identify potential issues early.
      </p>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-left">
        <div className="bg-background p-4 rounded-lg border">
          <Camera className="h-6 w-6 text-primary mb-2" />
          <h3 className="font-medium">Snap a Photo</h3>
          <p className="text-sm text-gray-500 dark:text-gray-400">Easily document your dog's stool with photos</p>
        </div>
        <div className="bg-background p-4 rounded-lg border">
          <Poop className="h-6 w-6 text-primary mb-2" />
          <h3 className="font-medium">Analyze Health</h3>
          <p className="text-sm text-gray-500 dark:text-gray-400">Get insights on stool health and potential issues</p>
        </div>
        <div className="bg-background p-4 rounded-lg border">
          <Trophy className="h-6 w-6 text-primary mb-2" />
          <h3 className="font-medium">Track Progress</h3>
          <p className="text-sm text-gray-500 dark:text-gray-400">Monitor improvements over time and earn achievements</p>
        </div>
      </div>
    </div>
  );

  const statementContent = (
    <div className="text-center space-y-6">
      <div className="p-6 bg-green-50 dark:bg-green-900/20 rounded-xl mb-6">
        <Check className="h-12 w-12 text-green-500 mx-auto mb-4" />
        <h2 className="text-xl font-bold text-green-700 dark:text-green-300">Guiding You With Care</h2>
        <p className="text-gray-600 dark:text-gray-300 mt-2">
          PoopyDog provides health insights backed by research. However, this app is not a substitute for professional veterinary advice.
        </p>
        <div className="mt-4 border-t border-green-200 dark:border-green-800 pt-4">
          <p className="text-sm text-gray-500 dark:text-gray-400">
            If your dog has ongoing digestive issues, unusual stool, or any health concerns, 
            always consult a qualified veterinarian.
          </p>
        </div>
      </div>
      <Button onClick={handleNextStep} className="w-full max-w-xs mx-auto">
        Got it!
      </Button>
    </div>
  );

  const features = (
    <div className="text-center space-y-6">
      <h1 className="text-2xl font-bold">PoopyDog's Unique Approach Works</h1>
      
      <div className="grid grid-cols-1 gap-6 mt-6">
        <div className="bg-background p-6 rounded-lg border flex items-center">
          <div className="bg-purple-100 dark:bg-purple-900/30 p-3 rounded-full mr-4">
            <Camera className="h-6 w-6 text-primary" />
          </div>
          <div className="text-left">
            <h3 className="font-medium">Take a Photo</h3>
            <p className="text-sm text-gray-500 dark:text-gray-400">Just snap a photo of your dog's stool</p>
          </div>
        </div>
        
        <div className="bg-background p-6 rounded-lg border flex items-center">
          <div className="bg-blue-100 dark:bg-blue-900/30 p-3 rounded-full mr-4">
            <Poop className="h-6 w-6 text-blue-500" />
          </div>
          <div className="text-left">
            <h3 className="font-medium">AI Analysis</h3>
            <p className="text-sm text-gray-500 dark:text-gray-400">Our AI analyzes the stool sample</p>
          </div>
        </div>
        
        <div className="bg-background p-6 rounded-lg border flex items-center">
          <div className="bg-green-100 dark:bg-green-900/30 p-3 rounded-full mr-4">
            <Check className="h-6 w-6 text-green-500" />
          </div>
          <div className="text-left">
            <h3 className="font-medium">Get Health Insights</h3>
            <p className="text-sm text-gray-500 dark:text-gray-400">Receive detailed gut health information</p>
          </div>
        </div>
      </div>
      
      <Button onClick={handleNextStep} className="mt-6">
        Let's Go <ArrowRight className="ml-2 h-4 w-4" />
      </Button>
    </div>
  );
  
  const addDog = (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-center">Add Your Dog</h1>
      <p className="text-center text-gray-600 dark:text-gray-300">
        Let's get to know your furry friend so we can track their gut health
      </p>
      
      <DogOnboardingForm 
        initialValues={dogData}
        onSubmit={handleDogSubmit}
        onCancel={handleBackStep}
      />
    </div>
  );
  
  const completionContent = (
    <div className="text-center space-y-6">
      <div className="flex justify-center mb-8">
        <div className="relative">
          <Check className="h-20 w-20 text-green-500" />
          <div className="absolute inset-0 bg-green-500/20 rounded-full blur-md -z-10 scale-150"></div>
        </div>
      </div>
      
      <h1 className="text-3xl font-bold">You're All Set!</h1>
      <p className="text-gray-600 dark:text-gray-300">
        You've successfully set up PoopyDog to track your dog's gut health.
      </p>
      
      <div className="mt-8">
        <Button onClick={handleNextStep} size="lg" className="mx-auto">
          Start Tracking
        </Button>
      </div>
    </div>
  );

  const steps = [
    {
      title: "Welcome",
      content: welcomeContent,
    },
    {
      title: "About PoopyDog",
      content: infoContent,
    },
    {
      title: "Health Statement",
      content: statementContent,
    },
    {
      title: "Key Features",
      content: features,
    },
    {
      title: "Add Your Dog",
      content: addDog,
    },
    {
      title: "All Set",
      content: completionContent,
    }
  ];

  return (
    <Layout className="py-6">
      <div className="w-full max-w-2xl mx-auto px-4">
        {step > 0 && step < steps.length - 1 && (
          <div className="mb-6">
            <OnboardingStep 
              currentStep={step} 
              totalSteps={steps.length - 2} 
              completedSteps={completedSteps}
              onBack={handleBackStep}
            />
          </div>
        )}
        
        <div className="min-h-[60vh] flex items-center">
          <div className="w-full">
            {steps[step].content}
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Onboarding;
