
import React from "react";
import { ArrowRight, AlertCircle, Camera, Trophy, Check } from "lucide-react";
import { Button } from "@/components/ui/button";

interface InfoStepProps {
  onNext: () => void;
}

const InfoStep: React.FC<InfoStepProps> = ({ onNext }) => {
  return (
    <div className="text-center space-y-6 animate-fade-in">
      <div className="flex justify-center">
        <div className="relative">
          <AlertCircle className="h-20 w-20 text-primary animate-pulse" />
          <div className="absolute inset-0 bg-primary/20 rounded-full blur-md -z-10 scale-110"></div>
        </div>
      </div>
      
      <h1 className="text-2xl font-bold">Poop Tracking Made Easy</h1>
      <p className="text-gray-600 dark:text-gray-300">
        Monitoring your dog's digestive health is crucial for their overall wellbeing. We'll help you track consistency, color, and frequency to identify potential issues early.
      </p>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-left">
        <div className="bg-background p-4 rounded-lg border hover-scale">
          <Camera className="h-6 w-6 text-primary mb-2" />
          <h3 className="font-medium">Snap a Photo</h3>
          <p className="text-sm text-gray-500 dark:text-gray-400">Easily document your dog's stool with photos</p>
        </div>
        <div className="bg-background p-4 rounded-lg border hover-scale">
          <AlertCircle className="h-6 w-6 text-primary mb-2" />
          <h3 className="font-medium">Analyze Health</h3>
          <p className="text-sm text-gray-500 dark:text-gray-400">Get insights on stool health and potential issues</p>
        </div>
        <div className="bg-background p-4 rounded-lg border hover-scale">
          <Trophy className="h-6 w-6 text-primary mb-2" />
          <h3 className="font-medium">Track Progress</h3>
          <p className="text-sm text-gray-500 dark:text-gray-400">Monitor improvements over time and earn achievements</p>
        </div>
      </div>
      
      <Button onClick={onNext} className="mt-4">
        Sounds Great! <ArrowRight className="ml-2 h-4 w-4" />
      </Button>
      
      <div className="pt-6 flex justify-center space-x-2">
        <span className="inline-block w-2 h-2 rounded-full bg-gray-300 dark:bg-gray-700"></span>
        <span className="inline-block w-2 h-2 rounded-full bg-primary"></span>
        <span className="inline-block w-2 h-2 rounded-full bg-gray-300 dark:bg-gray-700"></span>
        <span className="inline-block w-2 h-2 rounded-full bg-gray-300 dark:bg-gray-700"></span>
      </div>
    </div>
  );
};

export default InfoStep;
