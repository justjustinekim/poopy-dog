
import React from "react";
import DogOnboardingForm from "@/components/onboarding/DogOnboardingForm";
import { Dog } from "@/types";

interface AddDogStepProps {
  dogData: Partial<Dog>;
  onSubmit: (dog: Dog) => void;
  onBack: () => void;
}

const AddDogStep: React.FC<AddDogStepProps> = ({ dogData, onSubmit, onBack }) => {
  return (
    <div className="space-y-6 animate-fade-in">
      <h1 className="text-2xl font-bold text-center">Add Your Dog</h1>
      <p className="text-center text-gray-600 dark:text-gray-300">
        Let's get to know your furry friend so we can track their gut health
      </p>
      
      <DogOnboardingForm 
        initialValues={dogData}
        onSubmit={onSubmit}
        onCancel={onBack}
      />
    </div>
  );
};

export default AddDogStep;
