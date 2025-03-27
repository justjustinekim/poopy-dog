
import React from "react";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface OnboardingStepProps {
  currentStep: number;
  totalSteps: number;
  completedSteps: number[];
  onBack: () => void;
}

const OnboardingStep: React.FC<OnboardingStepProps> = ({
  currentStep,
  totalSteps,
  completedSteps,
  onBack
}) => {
  // Calculate progress percentage
  const progressPercentage = Math.floor((currentStep / totalSteps) * 100);
  
  return (
    <div className="w-full">
      <div className="flex items-center justify-between mb-4">
        <Button 
          variant="ghost" 
          size="sm" 
          onClick={onBack}
          className="pl-0 hover:bg-transparent"
        >
          <ArrowLeft className="h-4 w-4 mr-1" />
          Back
        </Button>
        <span className="text-sm text-gray-500">
          Step {currentStep} of {totalSteps}
        </span>
      </div>
      
      <div className="relative h-2 w-full bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
        <div 
          className="absolute top-0 left-0 h-full bg-primary transition-all duration-300 ease-in-out"
          style={{ width: `${progressPercentage}%` }}
        ></div>
      </div>
      
      <div className="flex justify-between mt-2">
        {Array.from({ length: totalSteps }).map((_, index) => {
          const stepNumber = index + 1;
          const isCompleted = completedSteps.includes(stepNumber) || stepNumber < currentStep;
          const isCurrent = stepNumber === currentStep;
          
          return (
            <div 
              key={`step-${index}`}
              className={cn(
                "flex flex-col items-center transition-all",
                (isCompleted || isCurrent) ? "opacity-100" : "opacity-40"
              )}
            >
              <div 
                className={cn(
                  "w-6 h-6 rounded-full flex items-center justify-center text-xs font-medium",
                  isCompleted ? "bg-primary text-white" : 
                  isCurrent ? "border-2 border-primary text-primary" : 
                  "bg-gray-200 dark:bg-gray-700 text-gray-500"
                )}
              >
                {stepNumber}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default OnboardingStep;
