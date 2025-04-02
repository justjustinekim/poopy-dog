
import React from "react";
import { Check, Trophy } from "lucide-react";
import { Button } from "@/components/ui/button";

interface CompletionStepProps {
  onNext: () => void;
}

const CompletionStep: React.FC<CompletionStepProps> = ({ onNext }) => {
  return (
    <div className="text-center space-y-6 animate-fade-in">
      <div className="flex justify-center mb-8">
        <div className="relative">
          <Check className="h-20 w-20 text-green-500 animate-bounce" />
          <div className="absolute inset-0 bg-green-500/20 rounded-full blur-md -z-10 scale-150"></div>
        </div>
      </div>
      
      <h1 className="text-3xl font-bold">You're All Set!</h1>
      <p className="text-gray-600 dark:text-gray-300">
        You've successfully set up PoopyDog to track your dog's gut health.
      </p>
      
      <div className="mt-8 mb-4 bg-green-50 dark:bg-green-900/20 p-6 rounded-lg">
        <h3 className="font-bold text-xl mb-2 flex items-center justify-center">
          <Trophy className="h-5 w-5 mr-2 text-yellow-500" /> 
          Achievement Unlocked!
        </h3>
        <p className="font-medium">First Time Pooper</p>
        <p className="text-sm text-gray-600 dark:text-gray-400">You've completed the onboarding process</p>
      </div>
      
      <div className="mt-8">
        <Button onClick={onNext} size="lg" className="mx-auto">
          Start Tracking
        </Button>
      </div>
    </div>
  );
};

export default CompletionStep;
