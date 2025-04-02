
import React from "react";
import { Progress } from "@/components/ui/progress";
import OnboardingStep from "@/components/onboarding/OnboardingStep";
import { useOnboarding } from "./OnboardingProvider";
import { useStepConfig } from "./steps/OnboardingSteps";

const ProgressIndicator: React.FC = () => {
  const { 
    step, 
    onboardingProgress, 
    completedSteps, 
    handleBackStep, 
    totalSteps 
  } = useOnboarding();
  
  const steps = useStepConfig();

  return (
    <>
      {/* Overall progress bar */}
      <div className="mb-6">
        <Progress value={onboardingProgress} className="h-2" />
        <div className="flex justify-between mt-2 text-xs text-gray-500">
          <span>Start</span>
          <span>Finish</span>
        </div>
      </div>
      
      {step > 0 && step < totalSteps - 1 && (
        <div className="mb-6">
          <OnboardingStep 
            currentStep={step} 
            totalSteps={totalSteps - 2} 
            completedSteps={completedSteps}
            onBack={handleBackStep}
            steps={steps.slice(1, -1)}
          />
        </div>
      )}
    </>
  );
};

export default ProgressIndicator;
