
import React from "react";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { Dog } from "@/types";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";

interface DogSelectorProps {
  dogs: Dog[];
  selectedDogId: string;
  onDogChange: (dogId: string) => void;
  onAddDog: () => void;
}

const DogSelector: React.FC<DogSelectorProps> = ({ 
  dogs, 
  selectedDogId, 
  onDogChange,
  onAddDog
}) => {
  const selectedDog = dogs.find(dog => dog.id === selectedDogId);
  
  return (
    <div className="mb-6">
      <Label htmlFor="dogSelect">Select Your Dog</Label>
      <div className="flex gap-4 items-center mt-2">
        {selectedDog && (
          <Avatar className="h-10 w-10 border border-primary/20">
            <AvatarImage src={selectedDog.imageUrl} alt={selectedDog.name} />
            <AvatarFallback>{selectedDog.name.charAt(0)}</AvatarFallback>
          </Avatar>
        )}
        
        <Select value={selectedDogId} onValueChange={onDogChange}>
          <SelectTrigger className="w-[200px]">
            <SelectValue placeholder="Select a dog" />
          </SelectTrigger>
          <SelectContent>
            {dogs.map(dog => (
              <SelectItem key={dog.id} value={dog.id} className="flex items-center">
                {dog.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        
        <Button 
          variant="outline" 
          className="flex items-center"
          onClick={onAddDog}
        >
          <Plus className="mr-2 h-4 w-4" />
          Add Dog
        </Button>
      </div>
    </div>
  );
};

export default DogSelector;
