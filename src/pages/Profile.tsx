
import React, { useState } from "react";
import Layout from "@/components/Layout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { toast } from "sonner";
import { Dog } from "@/types";
import { sampleDogs } from "@/utils/mockData";
import { Dog as DogIcon, User, UserPlus, Settings, Trash2, Upload, Save, PlusCircle } from "lucide-react";
import { cn } from "@/lib/utils";

const Profile: React.FC = () => {
  const [dogs, setDogs] = useState<Dog[]>(sampleDogs);
  const [isAddingDog, setIsAddingDog] = useState(false);
  const [newDog, setNewDog] = useState<Partial<Dog>>({
    name: "",
    breed: "",
    age: 0,
    weight: 0
  });
  
  const handleAddDog = () => {
    if (!newDog.name || !newDog.breed) {
      toast.error("Please fill in all required fields");
      return;
    }
    
    const dog: Dog = {
      id: `dog-${Date.now()}`,
      name: newDog.name,
      breed: newDog.breed,
      age: Number(newDog.age) || 0,
      weight: Number(newDog.weight) || 0,
      imageUrl: newDog.imageUrl
    };
    
    setDogs([...dogs, dog]);
    setNewDog({
      name: "",
      breed: "",
      age: 0,
      weight: 0
    });
    setIsAddingDog(false);
    
    toast.success(`${dog.name} added successfully!`);
  };
  
  const handleDeleteDog = (dogId: string) => {
    setDogs(dogs.filter(dog => dog.id !== dogId));
    toast.success("Dog removed successfully");
  };
  
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setNewDog(prev => ({
      ...prev,
      [name]: name === "age" || name === "weight" ? Number(value) : value
    }));
  };
  
  return (
    <Layout>
      <div className="animate-fade-in">
        <header className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Your Profile</h1>
          <p className="text-gray-600">
            Manage your account and dogs
          </p>
        </header>
        
        <Tabs defaultValue="dogs" className="w-full">
          <TabsList className="grid grid-cols-3 w-full max-w-md mb-8">
            <TabsTrigger value="dogs" className="py-3">
              <DogIcon className="mr-2 h-4 w-4" />
              <span>Dogs</span>
            </TabsTrigger>
            <TabsTrigger value="account" className="py-3">
              <User className="mr-2 h-4 w-4" />
              <span>Account</span>
            </TabsTrigger>
            <TabsTrigger value="settings" className="py-3">
              <Settings className="mr-2 h-4 w-4" />
              <span>Settings</span>
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="dogs" className="animate-slide-up">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {dogs.map(dog => (
                <Card key={dog.id} className="glass-card overflow-hidden">
                  <div className="relative h-40 bg-blue-50">
                    {dog.imageUrl ? (
                      <img 
                        src={dog.imageUrl} 
                        alt={dog.name} 
                        className="w-full h-full object-cover" 
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <DogIcon className="h-20 w-20 text-blue-200" />
                      </div>
                    )}
                    <button
                      onClick={() => handleDeleteDog(dog.id)}
                      className="absolute top-2 right-2 p-1.5 rounded-full bg-white/80 hover:bg-white shadow-sm transition-colors"
                    >
                      <Trash2 className="h-4 w-4 text-red-500" />
                    </button>
                  </div>
                  
                  <CardContent className="p-4">
                    <h3 className="text-xl font-semibold mb-1">{dog.name}</h3>
                    <div className="flex items-center gap-1 mb-3">
                      <Badge variant="outline" className="font-normal">
                        {dog.breed}
                      </Badge>
                    </div>
                    <div className="grid grid-cols-2 gap-2 text-sm">
                      <div>
                        <span className="text-gray-500">Age:</span> {dog.age} years
                      </div>
                      <div>
                        <span className="text-gray-500">Weight:</span> {dog.weight} lbs
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
              
              {/* Add new dog card */}
              <Card 
                className={cn(
                  "glass-card overflow-hidden",
                  !isAddingDog && "flex flex-col items-center justify-center p-8 min-h-[280px] cursor-pointer hover:shadow-lg transition-all border-dashed",
                  isAddingDog && "border-solid"
                )}
                onClick={() => !isAddingDog && setIsAddingDog(true)}
              >
                {!isAddingDog ? (
                  <>
                    <PlusCircle className="h-12 w-12 text-blue-200 mb-4" />
                    <h3 className="text-lg font-medium text-gray-600">Add New Dog</h3>
                  </>
                ) : (
                  <>
                    <CardHeader>
                      <CardTitle>Add New Dog</CardTitle>
                      <CardDescription>Enter your dog's information</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <div className="space-y-2">
                          <Label htmlFor="name">Name</Label>
                          <Input
                            id="name"
                            name="name"
                            value={newDog.name}
                            onChange={handleInputChange}
                            placeholder="Dog's name"
                            required
                          />
                        </div>
                        
                        <div className="space-y-2">
                          <Label htmlFor="breed">Breed</Label>
                          <Input
                            id="breed"
                            name="breed"
                            value={newDog.breed}
                            onChange={handleInputChange}
                            placeholder="Dog's breed"
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
                              value={newDog.age || ""}
                              onChange={handleInputChange}
                              min="0"
                              step="0.5"
                            />
                          </div>
                          
                          <div className="space-y-2">
                            <Label htmlFor="weight">Weight (lbs)</Label>
                            <Input
                              id="weight"
                              name="weight"
                              type="number"
                              value={newDog.weight || ""}
                              onChange={handleInputChange}
                              min="0"
                              step="0.1"
                            />
                          </div>
                        </div>
                        
                        <div className="space-y-2">
                          <Label htmlFor="imageUrl">Image URL</Label>
                          <Input
                            id="imageUrl"
                            name="imageUrl"
                            value={newDog.imageUrl || ""}
                            onChange={handleInputChange}
                            placeholder="https://example.com/dog.jpg"
                          />
                        </div>
                        
                        <div className="flex justify-end gap-2 pt-2">
                          <Button 
                            variant="outline" 
                            onClick={(e) => {
                              e.stopPropagation();
                              setIsAddingDog(false);
                            }}
                          >
                            Cancel
                          </Button>
                          <Button 
                            onClick={(e) => {
                              e.stopPropagation();
                              handleAddDog();
                            }}
                          >
                            <Save className="mr-2 h-4 w-4" />
                            Save Dog
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </>
                )}
              </Card>
            </div>
          </TabsContent>
          
          <TabsContent value="account" className="animate-slide-up">
            <Card className="glass-card max-w-2xl">
              <CardHeader>
                <CardTitle>Account Information</CardTitle>
                <CardDescription>Manage your personal details and preferences</CardDescription>
              </CardHeader>
              
              <CardContent>
                <div className="flex flex-col md:flex-row gap-8 items-start">
                  <div className="flex flex-col items-center">
                    <Avatar className="h-24 w-24 mb-4">
                      <AvatarImage src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=256&h=256" />
                      <AvatarFallback>US</AvatarFallback>
                    </Avatar>
                    <Button variant="outline" size="sm">
                      <Upload className="mr-2 h-4 w-4" />
                      Change Photo
                    </Button>
                  </div>
                  
                  <div className="flex-1 space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="firstName">First Name</Label>
                        <Input id="firstName" placeholder="Your first name" defaultValue="John" />
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="lastName">Last Name</Label>
                        <Input id="lastName" placeholder="Your last name" defaultValue="Doe" />
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="email">Email</Label>
                      <Input id="email" type="email" placeholder="Your email address" defaultValue="john.doe@example.com" />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="password">Password</Label>
                      <Input id="password" type="password" value="********" readOnly />
                      <Button variant="link" className="text-xs h-auto p-0">Change password</Button>
                    </div>
                    
                    <div className="pt-4">
                      <Button>
                        <Save className="mr-2 h-4 w-4" />
                        Save Changes
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="settings" className="animate-slide-up">
            <Card className="glass-card max-w-2xl">
              <CardHeader>
                <CardTitle>Application Settings</CardTitle>
                <CardDescription>Customize your app experience</CardDescription>
              </CardHeader>
              
              <CardContent>
                <div className="space-y-6">
                  <div className="space-y-2">
                    <h3 className="font-medium">Notifications</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {[
                        "Daily reminders",
                        "Weekly health reports",
                        "Irregular patterns detected",
                        "Tips and recommendations"
                      ].map((item, i) => (
                        <div key={i} className="flex items-center justify-between">
                          <Label htmlFor={`notify-${i}`} className="cursor-pointer">{item}</Label>
                          <input
                            type="checkbox"
                            id={`notify-${i}`}
                            className="rounded text-primary border-gray-300 focus:ring focus:ring-primary/20"
                            defaultChecked={i < 2}
                          />
                        </div>
                      ))}
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <h3 className="font-medium">Privacy</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {[
                        "Share anonymous health data for research",
                        "Allow data to improve app recommendations",
                        "Store photos on the cloud"
                      ].map((item, i) => (
                        <div key={i} className="flex items-center justify-between">
                          <Label htmlFor={`privacy-${i}`} className="cursor-pointer">{item}</Label>
                          <input
                            type="checkbox"
                            id={`privacy-${i}`}
                            className="rounded text-primary border-gray-300 focus:ring focus:ring-primary/20"
                            defaultChecked={i < 2}
                          />
                        </div>
                      ))}
                    </div>
                  </div>
                  
                  <div className="pt-4">
                    <Button>
                      <Save className="mr-2 h-4 w-4" />
                      Save Preferences
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </Layout>
  );
};

export default Profile;
