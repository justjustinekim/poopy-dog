
import React from "react";
import { Save, X, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";

interface FormNavigationProps {
  currentStep: number;
  onPrevious: () => void;
  onNext: () => void;
  onCancel: () => void;
  onSubmit: () => void;
  isLastStep: boolean;
}

const FormNavigation: React.FC<FormNavigationProps> = ({
  currentStep,
  onPrevious,
  onNext,
  onCancel,
  onSubmit,
  isLastStep,
}) => {
  return (
    <div className="pt-6 flex justify-between">
      {currentStep > 1 ? (
        <Button type="button" variant="outline" onClick={onPrevious}>
          <X className="h-4 w-4 mr-2" />
          Back
        </Button>
      ) : (
        <Button type="button" variant="outline" onClick={onCancel}>
          <X className="h-4 w-4 mr-2" />
          Cancel
        </Button>
      )}
      
      {!isLastStep ? (
        <Button type="button" onClick={onNext}>
          <Plus className="h-4 w-4 mr-2" />
          Continue
        </Button>
      ) : (
        <Button type="button" onClick={onSubmit}>
          <Save className="h-4 w-4 mr-2" />
          Save Dog Profile
        </Button>
      )}
    </div>
  );
};

export default FormNavigation;
