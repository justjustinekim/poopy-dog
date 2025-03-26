
import React, { useState } from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dog as DogIcon, Edit2, Save, X } from "lucide-react";
import { Dog } from "@/types";

interface DogProfileProps {
  dog: Dog;
  onUpdate?: (updatedDog: Dog) => void;
  minimal?: boolean;
}

const DogProfile: React.FC<DogProfileProps> = ({ dog, onUpdate, minimal = false }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState<Dog>(dog);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    
    setFormData(prev => ({
      ...prev,
      [name]: name === "age" || name === "weight" ? Number(value) : value
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (onUpdate) {
      onUpdate(formData);
    }
    setIsEditing(false);
  };

  const cancelEdit = () => {
    setFormData(dog);
    setIsEditing(false);
  };

  return (
    <Card className={minimal ? "" : "glass-card w-full max-w-md mx-auto"}>
      <CardHeader>
        <CardTitle className="flex items-center">
          <DogIcon className="mr-2 h-5 w-5 text-primary" />
          {minimal ? dog.name : "Dog Profile"}
        </CardTitle>
        {!minimal && <CardDescription>Manage your dog's information</CardDescription>}
      </CardHeader>
      
      <CardContent>
        {!isEditing ? (
          <div className="space-y-4">
            <div className="flex justify-center mb-6">
              {dog.imageUrl ? (
                <div className="relative w-32 h-32 rounded-full overflow-hidden border-4 border-primary/20">
                  <img src={dog.imageUrl} alt={dog.name} className="w-full h-full object-cover" />
                </div>
              ) : (
                <div className="w-32 h-32 rounded-full bg-primary/10 flex items-center justify-center border-4 border-primary/20">
                  <DogIcon className="h-16 w-16 text-primary/40" />
                </div>
              )}
            </div>
            
            {!minimal && (
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <p className="text-sm font-medium text-gray-500">Name</p>
                  <p className="font-medium">{dog.name}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-sm font-medium text-gray-500">Breed</p>
                  <p>{dog.breed}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-sm font-medium text-gray-500">Age</p>
                  <p>{dog.age} years</p>
                </div>
                <div className="space-y-1">
                  <p className="text-sm font-medium text-gray-500">Weight</p>
                  <p>{dog.weight} lbs</p>
                </div>
              </div>
            )}
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Name</Label>
              <Input
                id="name"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="breed">Breed</Label>
              <Input
                id="breed"
                name="breed"
                value={formData.breed}
                onChange={handleInputChange}
                required
              />
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="age">Age (years)</Label>
                <Input
                  id="age"
                  name="age"
                  type="number"
                  value={formData.age}
                  onChange={handleInputChange}
                  min="0"
                  step="0.5"
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="weight">Weight (lbs)</Label>
                <Input
                  id="weight"
                  name="weight"
                  type="number"
                  value={formData.weight}
                  onChange={handleInputChange}
                  min="0"
                  step="0.1"
                  required
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="imageUrl">Image URL</Label>
              <Input
                id="imageUrl"
                name="imageUrl"
                value={formData.imageUrl || ""}
                onChange={handleInputChange}
                placeholder="https://example.com/dog.jpg"
              />
            </div>
          </form>
        )}
      </CardContent>
      
      {!minimal && (
        <CardFooter className="flex justify-end gap-2">
          {!isEditing ? (
            <Button 
              variant="outline" 
              onClick={() => setIsEditing(true)}
              className="flex items-center"
            >
              <Edit2 className="mr-2 h-4 w-4" />
              Edit Profile
            </Button>
          ) : (
            <>
              <Button 
                variant="outline" 
                onClick={cancelEdit}
                className="flex items-center"
              >
                <X className="mr-2 h-4 w-4" />
                Cancel
              </Button>
              <Button 
                type="submit" 
                onClick={handleSubmit}
                className="flex items-center"
              >
                <Save className="mr-2 h-4 w-4" />
                Save
              </Button>
            </>
          )}
        </CardFooter>
      )}
    </Card>
  );
};

export default DogProfile;
