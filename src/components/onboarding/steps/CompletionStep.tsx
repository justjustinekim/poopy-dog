
import React from "react";
import { Button } from "@/components/ui/button";
import { Check, Plus } from "lucide-react";
import { useOnboarding } from "../OnboardingProvider";

interface CompletionStepProps {
  onNext: () => void;
}

const CompletionStep: React.FC<CompletionStepProps> = ({ onNext }) => {
  const { dogs, goToAddAnotherDog } = useOnboarding();
  
  return (
    <div className="space-y-6 text-center animate-fade-in">
      <div className="mx-auto w-24 h-24 rounded-full bg-green-100 dark:bg-green-900 flex items-center justify-center mb-4">
        <Check className="h-12 w-12 text-green-600 dark:text-green-300" />
      </div>
      
      <h1 className="text-2xl font-bold">You're All Set!</h1>
      
      <p className="text-muted-foreground">
        {dogs.length > 1 
          ? `You've successfully added ${dogs.length} dogs to your account.` 
          : "You've successfully set up your dog's profile."}
        <br />
        We're excited to help you track and improve your dog's gut health.
      </p>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-md mx-auto pt-4">
        <Button 
          variant="outline" 
          className="flex items-center justify-center"
          onClick={goToAddAnotherDog}
        >
          <Plus className="mr-2 h-4 w-4" />
          Add Another Dog
        </Button>
        
        <Button onClick={onNext} className="flex items-center justify-center">
          <Check className="mr-2 h-4 w-4" />
          Go to Dashboard
        </Button>
      </div>
    </div>
  );
};

export default CompletionStep;
