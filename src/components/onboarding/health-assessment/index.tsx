
import React from "react";
import { HealthAssessmentData } from "@/types";
import HealthAssessmentForm from "./HealthAssessmentForm";
import { AlertCircle } from "lucide-react";

interface HealthAssessmentProps {
  onComplete: (data: HealthAssessmentData) => void;
  onSkip: () => void;
}

const HealthAssessment: React.FC<HealthAssessmentProps> = ({
  onComplete,
  onSkip
}) => {
  return (
    <div className="space-y-6">
      <div className="text-center">
        <div className="flex justify-center mb-4">
          <div className="bg-primary/10 p-3 rounded-full">
            <AlertCircle className="h-8 w-8 text-primary" />
          </div>
        </div>
        <h2 className="text-2xl font-bold">Dog's Digestive Health Check</h2>
        <p className="text-gray-600 dark:text-gray-300 mt-2">
          Let's understand your dog's current digestive health
        </p>
      </div>

      <HealthAssessmentForm onComplete={onComplete} onSkip={onSkip} />
    </div>
  );
};

export default HealthAssessment;
