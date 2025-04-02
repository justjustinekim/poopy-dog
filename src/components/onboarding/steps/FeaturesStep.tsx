
import React from "react";
import { ArrowRight, Camera, AlertCircle, Check } from "lucide-react";
import { Button } from "@/components/ui/button";

interface FeaturesStepProps {
  onNext: () => void;
}

const FeaturesStep: React.FC<FeaturesStepProps> = ({ onNext }) => {
  return (
    <div className="text-center space-y-6 animate-fade-in">
      <h1 className="text-2xl font-bold">PoopyDog's Unique Approach Works</h1>
      
      <div className="grid grid-cols-1 gap-6 mt-6">
        <div className="bg-background p-6 rounded-lg border flex items-center hover-scale">
          <div className="bg-purple-100 dark:bg-purple-900/30 p-3 rounded-full mr-4">
            <Camera className="h-6 w-6 text-primary" />
          </div>
          <div className="text-left">
            <h3 className="font-medium">Take a Photo</h3>
            <p className="text-sm text-gray-500 dark:text-gray-400">Just snap a photo of your dog's stool</p>
          </div>
        </div>
        
        <div className="bg-background p-6 rounded-lg border flex items-center hover-scale">
          <div className="bg-blue-100 dark:bg-blue-900/30 p-3 rounded-full mr-4">
            <AlertCircle className="h-6 w-6 text-blue-500" />
          </div>
          <div className="text-left">
            <h3 className="font-medium">AI Analysis</h3>
            <p className="text-sm text-gray-500 dark:text-gray-400">Our AI analyzes the stool sample</p>
          </div>
        </div>
        
        <div className="bg-background p-6 rounded-lg border flex items-center hover-scale">
          <div className="bg-green-100 dark:bg-green-900/30 p-3 rounded-full mr-4">
            <Check className="h-6 w-6 text-green-500" />
          </div>
          <div className="text-left">
            <h3 className="font-medium">Get Health Insights</h3>
            <p className="text-sm text-gray-500 dark:text-gray-400">Receive detailed gut health information</p>
          </div>
        </div>
      </div>
      
      <Button onClick={onNext} className="mt-6">
        Let's Go <ArrowRight className="ml-2 h-4 w-4" />
      </Button>
      
      <div className="pt-6 flex justify-center space-x-2">
        <span className="inline-block w-2 h-2 rounded-full bg-gray-300 dark:bg-gray-700"></span>
        <span className="inline-block w-2 h-2 rounded-full bg-gray-300 dark:bg-gray-700"></span>
        <span className="inline-block w-2 h-2 rounded-full bg-primary"></span>
        <span className="inline-block w-2 h-2 rounded-full bg-gray-300 dark:bg-gray-700"></span>
      </div>
    </div>
  );
};

export default FeaturesStep;
