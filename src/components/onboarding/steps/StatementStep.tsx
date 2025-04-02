
import React from "react";
import { Check } from "lucide-react";
import { Button } from "@/components/ui/button";

interface StatementStepProps {
  onNext: () => void;
}

const StatementStep: React.FC<StatementStepProps> = ({ onNext }) => {
  return (
    <div className="text-center space-y-6 animate-fade-in">
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
      <Button onClick={onNext} className="w-full max-w-xs mx-auto">
        Got it!
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

export default StatementStep;
