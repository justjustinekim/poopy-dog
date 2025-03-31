import React from "react";
import { Heart } from "lucide-react";
import { FormField, FormItem, FormLabel, FormControl, FormMessage, FormDescription } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Card, CardContent } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { UseFormReturn } from "react-hook-form";
import { DogFormValues } from "./types";

// Digestive issue options
const digestiveIssueOptions = [
  { value: "vomiting", label: "Occasional vomiting", description: "Throws up food sometimes" },
  { value: "diarrhea", label: "Diarrhea", description: "Loose stool" },
  { value: "constipation", label: "Constipation", description: "Difficulty passing stool" },
  { value: "gas", label: "Excessive gas", description: "Flatulence or bloating" },
  { value: "poorAppetite", label: "Poor appetite", description: "Doesn't seem interested in food" },
  { value: "eatingNonFood", label: "Eats non-food items", description: "Grass, paper, etc." },
  { value: "none", label: "No digestive issues", description: "Healthy digestion" },
];

// Common dog food brands
const dogFoodBrands = [
  { value: "kibble", label: "Dry Kibble (Generic)" },
  { value: "wet", label: "Wet Food (Generic)" },
  { value: "raw", label: "Raw Diet" },
  { value: "homemade", label: "Homemade" },
  { value: "mixed", label: "Mixed Diet" },
  
  { value: "farmersDog", label: "The Farmer's Dog (Fresh)" },
  { value: "nomNom", label: "Nom Nom (Fresh)" },
  { value: "ollie", label: "Ollie (Fresh)" },
  { value: "justFoodForDogs", label: "Just Food For Dogs (Fresh)" },
  { value: "petPlate", label: "Pet Plate (Fresh)" },
  { value: "spot&tango", label: "Spot & Tango (Fresh)" },
  
  { value: "royalCanin", label: "Royal Canin" },
  { value: "hillsScience", label: "Hill's Science Diet" },
  { value: "purina", label: "Purina Pro Plan" },
  { value: "blueBuff", label: "Blue Buffalo" },
  { value: "iams", label: "IAMS" },
  { value: "nutro", label: "Nutro" },
  { value: "merrick", label: "Merrick" },
  { value: "acana", label: "Acana" },
  { value: "orijen", label: "Orijen" },
  { value: "tasteOfTheWild", label: "Taste of the Wild" },
  { value: "canidae", label: "Canidae" },
  { value: "wellness", label: "Wellness" },
  { value: "farmina", label: "Farmina" },
  { value: "zignature", label: "Zignature" },
  
  { value: "solidGold", label: "Solid Gold (Holistic)" },
  { value: "halo", label: "Halo (Holistic)" },
  { value: "naturalBalance", label: "Natural Balance" },
  { value: "earthborn", label: "Earthborn Holistic" },
  { value: "natures", label: "Nature's Variety" },
  
  { value: "other", label: "Other Brand" },
];

interface DietDigestionStepProps {
  form: UseFormReturn<DogFormValues>;
}

const DietDigestionStep: React.FC<DietDigestionStepProps> = ({ form }) => {
  return (
    <Card className="animate-fade-in">
      <CardContent className="pt-6">
        <h2 className="text-xl font-semibold mb-4 flex items-center">
          <Heart className="h-5 w-5 mr-2 text-primary" />
          Diet & Digestion
        </h2>
        
        <FormField
          control={form.control}
          name="dietType"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Primary Diet</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a diet type" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent className="max-h-[300px]">
                  <div className="max-h-[300px] overflow-y-auto">
                    {dogFoodBrands.map((brand) => (
                      <SelectItem key={brand.value} value={brand.value}>
                        {brand.label}
                      </SelectItem>
                    ))}
                  </div>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="favoriteTreats"
          render={({ field }) => (
            <FormItem className="mt-6">
              <FormLabel>Favorite Treats</FormLabel>
              <FormControl>
                <Input placeholder="Cheese, chicken, peanut butter..." {...field} />
              </FormControl>
              <FormDescription>
                What treats does your dog love the most?
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="poopFrequency"
          render={({ field }) => (
            <FormItem className="mt-6">
              <FormLabel>How many times does your dog poop per day?</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select frequency" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="1">Once daily</SelectItem>
                  <SelectItem value="2-3">2-3 times daily</SelectItem>
                  <SelectItem value="4+">4+ times daily</SelectItem>
                  <SelectItem value="irregular">Irregular</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="digestiveIssues"
          render={({ field }) => (
            <FormItem className="mt-6">
              <FormLabel>Digestive Issues (Select all that apply)</FormLabel>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-2">
                {digestiveIssueOptions.map((option) => (
                  <div key={option.value} className="flex items-start space-x-2 rounded-md border p-3">
                    <Checkbox
                      checked={field.value?.includes(option.value)}
                      onCheckedChange={(checked) => {
                        const currentValues = field.value || [];
                        return checked
                          ? field.onChange([...currentValues, option.value])
                          : field.onChange(currentValues.filter((value) => value !== option.value));
                      }}
                    />
                    <div>
                      <label className="text-sm font-medium leading-none cursor-pointer">
                        {option.label}
                      </label>
                      <p className="text-xs text-gray-500">{option.description}</p>
                    </div>
                  </div>
                ))}
              </div>
              <FormMessage />
            </FormItem>
          )}
        />
      </CardContent>
    </Card>
  );
};

export default DietDigestionStep;
