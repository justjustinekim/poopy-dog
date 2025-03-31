
import React from "react";
import { Trophy } from "lucide-react";
import { FormField, FormItem, FormLabel, FormControl, FormMessage, FormDescription } from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Card, CardContent } from "@/components/ui/card";
import { UseFormReturn } from "react-hook-form";
import { DogFormValues } from "./types";

// Personality traits options
const personalityTraits = [
  { value: "playful", label: "Playful", emoji: "🎾" },
  { value: "calm", label: "Calm", emoji: "😌" },
  { value: "energetic", label: "Energetic", emoji: "⚡" },
  { value: "friendly", label: "Friendly", emoji: "😊" },
  { value: "protective", label: "Protective", emoji: "🛡️" },
  { value: "shy", label: "Shy", emoji: "🙈" },
  { value: "stubborn", label: "Stubborn", emoji: "😤" },
  { value: "smart", label: "Smart", emoji: "🧠" },
  { value: "lazy", label: "Lazy", emoji: "💤" },
  { value: "affectionate", label: "Affectionate", emoji: "❤️" },
];

interface PersonalityStoryStepProps {
  form: UseFormReturn<DogFormValues>;
}

const PersonalityStoryStep: React.FC<PersonalityStoryStepProps> = ({ form }) => {
  return (
    <Card className="animate-fade-in">
      <CardContent className="pt-6">
        <h2 className="text-xl font-semibold mb-4 flex items-center">
          <Trophy className="h-5 w-5 mr-2 text-primary" />
          Personality & Story
        </h2>
        
        <FormField
          control={form.control}
          name="personalityTraits"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Personality Traits (Select all that apply)</FormLabel>
              <div className="grid grid-cols-2 md:grid-cols-5 gap-2 mt-2">
                {personalityTraits.map((trait) => (
                  <div 
                    key={trait.value}
                    className={`flex flex-col items-center justify-center p-2 border rounded-md cursor-pointer transition-all hover:bg-primary/10 ${
                      field.value?.includes(trait.value) ? 'bg-primary/20 border-primary' : ''
                    }`}
                    onClick={() => {
                      const currentValues = field.value || [];
                      return currentValues.includes(trait.value)
                        ? field.onChange(currentValues.filter((value) => value !== trait.value))
                        : field.onChange([...currentValues, trait.value]);
                    }}
                  >
                    <span className="text-2xl mb-1">{trait.emoji}</span>
                    <span className="text-xs font-medium">{trait.label}</span>
                  </div>
                ))}
              </div>
              <FormDescription className="mt-2">
                Choose traits that best describe your dog's personality
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          name="adoptionStory"
          render={({ field }) => (
            <FormItem className="mt-6">
              <FormLabel>Adoption Story (optional)</FormLabel>
              <FormControl>
                <Textarea 
                  placeholder="Share how your dog came into your life..." 
                  className="min-h-[120px]"
                  {...field} 
                />
              </FormControl>
              <FormDescription>
                Tell us a bit about your journey with your furry friend
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          name="digestiveHealth"
          render={({ field }) => (
            <FormItem className="space-y-3 mt-6">
              <FormLabel>Current Digestive Health</FormLabel>
              <FormControl>
                <RadioGroup
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                  className="flex flex-col space-y-1"
                >
                  <div className="flex items-center space-x-2 rounded-md border p-3">
                    <RadioGroupItem value="excellent" id="excellent" />
                    <label htmlFor="excellent" className="flex flex-col">
                      <span className="font-medium">Excellent</span>
                      <span className="text-sm text-gray-500">No digestive issues at all</span>
                    </label>
                  </div>
                  <div className="flex items-center space-x-2 rounded-md border p-3">
                    <RadioGroupItem value="normal" id="normal" />
                    <label htmlFor="normal" className="flex flex-col">
                      <span className="font-medium">Normal</span>
                      <span className="text-sm text-gray-500">Occasional minor issues</span>
                    </label>
                  </div>
                  <div className="flex items-center space-x-2 rounded-md border p-3">
                    <RadioGroupItem value="concerns" id="concerns" />
                    <label htmlFor="concerns" className="flex flex-col">
                      <span className="font-medium">Some Concerns</span>
                      <span className="text-sm text-gray-500">Regular but manageable issues</span>
                    </label>
                  </div>
                  <div className="flex items-center space-x-2 rounded-md border p-3">
                    <RadioGroupItem value="issues" id="issues" />
                    <label htmlFor="issues" className="flex flex-col">
                      <span className="font-medium">Serious Issues</span>
                      <span className="text-sm text-gray-500">Frequent digestive problems</span>
                    </label>
                  </div>
                </RadioGroup>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </CardContent>
    </Card>
  );
};

export default PersonalityStoryStep;
