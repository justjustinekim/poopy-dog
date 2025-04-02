
import React, { useEffect } from "react";
import { useOnboarding } from "../OnboardingProvider";
import WelcomeStep from "./WelcomeStep";
import InfoStep from "./InfoStep";
import StatementStep from "./StatementStep";
import FeaturesStep from "./FeaturesStep";
import AddDogStep from "./AddDogStep";
import LifestyleAssessment from "@/components/onboarding/lifestyle-assessment";
import HealthAssessment from "@/components/onboarding/health-assessment";
import CompletionStep from "./CompletionStep";
import { DogIcon, Heart, Check, Star } from "lucide-react";

export const useStepConfig = () => {
  const { 
    handleNextStep, 
    handleBackStep, 
    dogData, 
    handleDogSubmit,
    handleLifestyleAssessmentComplete,
    handleHealthAssessmentComplete
  } = useOnboarding();

  const stepComponents = [
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
      content: (
        <AddDogStep 
          dogData={dogData} 
          onSubmit={handleDogSubmit} 
          onBack={handleBackStep} 
        />
      ),
      icon: <DogIcon className="h-5 w-5" />,
    },
    {
      title: "Lifestyle Questions",
      content: (
        <LifestyleAssessment 
          dogName={dogData.name || "your dog"}
          onComplete={handleLifestyleAssessmentComplete}
          onSkip={handleNextStep}
        />
      ),
      icon: <DogIcon className="h-5 w-5" />,
    },
    {
      title: "Health Assessment",
      content: (
        <HealthAssessment 
          onComplete={handleHealthAssessmentComplete}
          onSkip={handleNextStep}
        />
      ),
      icon: <Heart className="h-5 w-5" />,
    },
    {
      title: "All Set",
      content: <CompletionStep onNext={handleNextStep} />,
      icon: <Check className="h-5 w-5" />,
    }
  ];

  return stepComponents;
};

const OnboardingSteps: React.FC = () => {
  const { step } = useOnboarding();
  const steps = useStepConfig();
  
  // Scroll to top when step changes
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [step]);

  return (
    <div className="min-h-[60vh] flex items-center">
      <div className="w-full">
        {steps[step].content}
      </div>
    </div>
  );
};

export default OnboardingSteps;
