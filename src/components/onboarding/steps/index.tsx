
import React from "react";
import { AlertCircle, ArrowRight, Dog as DogIcon, Camera, Trophy, Check, Heart, Star } from "lucide-react";
import WelcomeStep from "./WelcomeStep";
import InfoStep from "./InfoStep";
import StatementStep from "./StatementStep";
import FeaturesStep from "./FeaturesStep";
import AddDogStep from "./AddDogStep";
import CompletionStep from "./CompletionStep";
import { Dog } from "@/types";

export const getOnboardingSteps = (
  dogData: Partial<Dog>,
  handleDogSubmit: (dog: Dog) => void,
  handleHealthAssessmentComplete: (data: any) => void,
  handleLifestyleAssessmentComplete: (data: any) => void,
  handleNextStep: () => void,
  handleBackStep: () => void
) => {
  return [
    {
      title: "Welcome",
      content: <WelcomeStep onNext={handleNextStep} />,
      icon: <DogIcon className="h-5 w-5" />,
    },
    {
      title: "About PoopyDog",
      content: <InfoStep onNext={handleNextStep} />,
      icon: <DogIcon className="h-5 w-5" />,
    },
    {
      title: "Health Statement",
      content: <StatementStep onNext={handleNextStep} />,
      icon: <Heart className="h-5 w-5" />,
    },
    {
      title: "Key Features",
      content: <FeaturesStep onNext={handleNextStep} />,
      icon: <Star className="h-5 w-5" />,
    },
    {
      title: "Add Your Dog",
      content: <AddDogStep dogData={dogData} onSubmit={handleDogSubmit} onBack={handleBackStep} />,
      icon: <DogIcon className="h-5 w-5" />,
    },
    {
      title: "Lifestyle Questions",
      content: (
        <div className="space-y-6 animate-fade-in">
          <LifestyleAssessment 
            dogName={dogData.name || "your dog"}
            onComplete={handleLifestyleAssessmentComplete}
            onSkip={handleNextStep}
          />
        </div>
      ),
      icon: <DogIcon className="h-5 w-5" />,
    },
    {
      title: "Health Assessment",
      content: (
        <div className="space-y-6 animate-fade-in">
          <HealthAssessment 
            onComplete={handleHealthAssessmentComplete}
            onSkip={handleNextStep}
          />
        </div>
      ),
      icon: <Heart className="h-5 w-5" />,
    },
    {
      title: "All Set",
      content: <CompletionStep onNext={handleNextStep} />,
      icon: <Check className="h-5 w-5" />,
    }
  ];
};

import LifestyleAssessment from "../lifestyle-assessment";
import HealthAssessment from "../health-assessment";
