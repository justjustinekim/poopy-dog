
import React from "react";
import { ArrowRight, DogIcon } from "lucide-react";
import { Button } from "@/components/ui/button";

interface WelcomeStepProps {
  onNext: () => void;
}

const WelcomeStep: React.FC<WelcomeStepProps> = ({ onNext }) => {
  return (
    <div className="text-center space-y-6 animate-fade-in">
      <div className="flex justify-center">
        <div className="relative">
          <DogIcon className="h-24 w-24 text-primary animate-bounce" />
          <div className="absolute inset-0 bg-primary/20 rounded-full blur-md -z-10 scale-110"></div>
        </div>
      </div>
      
      <h1 className="text-3xl font-bold">Welcome to PoopyDog</h1>
      <p className="text-lg text-gray-600 dark:text-gray-300">
        Let's start tracking your dog's gut health for a happier, healthier pooch!
      </p>
      <div className="flex flex-col space-y-4 max-w-xs mx-auto">
        <Button onClick={onNext} className="w-full">
          Get Started <ArrowRight className="ml-2 h-4 w-4" />
        </Button>
        <div className="text-sm text-gray-500 dark:text-gray-400">
          <span className="inline-flex items-center">
            <Check className="h-4 w-4 mr-1 text-green-500" />
            Join thousands of pet parents
          </span>
        </div>
      </div>
      
      <div className="pt-6 flex justify-center space-x-2">
        <span className="inline-block w-2 h-2 rounded-full bg-primary"></span>
        <span className="inline-block w-2 h-2 rounded-full bg-gray-300 dark:bg-gray-700"></span>
        <span className="inline-block w-2 h-2 rounded-full bg-gray-300 dark:bg-gray-700"></span>
        <span className="inline-block w-2 h-2 rounded-full bg-gray-300 dark:bg-gray-700"></span>
      </div>
    </div>
  );
};

export default WelcomeStep;

import { Check } from "lucide-react";
