
import React from "react";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { Dog } from "@/types";

interface DogSelectorProps {
  dogs: Dog[];
  selectedDogId: string;
  onDogChange: (dogId: string) => void;
}

const DogSelector: React.FC<DogSelectorProps> = ({ 
  dogs, 
  selectedDogId, 
  onDogChange 
}) => {
  return (
    <div className="mb-6">
      <Label htmlFor="dogSelect">Select Your Dog</Label>
      <div className="flex gap-4 mt-2">
        <Select value={selectedDogId} onValueChange={onDogChange}>
          <SelectTrigger className="w-[200px]">
            <SelectValue placeholder="Select a dog" />
          </SelectTrigger>
          <SelectContent>
            {dogs.map(dog => (
              <SelectItem key={dog.id} value={dog.id}>
                {dog.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        
        <Button variant="outline" className="flex items-center">
          <Plus className="mr-2 h-4 w-4" />
          Add Dog
        </Button>
      </div>
    </div>
  );
};

export default DogSelector;
