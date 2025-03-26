
import React, { useState, useEffect } from "react";
import Layout from "@/components/Layout";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import DogProfile from "@/components/DogProfile";
import PhotoUpload from "@/components/PhotoUpload";
import PoopCalendar from "@/components/PoopCalendar";
import AnalysisCard from "@/components/AnalysisCard";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "@/components/ui/sonner";
import { Dog, PoopEntry, PoopConsistency, PoopColor } from "@/types";
import { format } from "date-fns";
import { Camera, Calendar, LineChart, Plus, Save } from "lucide-react";
import { sampleDogs, getEntriesForDog, getInsightsForDog } from "@/utils/mockData";

const Dashboard: React.FC = () => {
  const [dogs, setDogs] = useState<Dog[]>(sampleDogs);
  const [selectedDogId, setSelectedDogId] = useState<string>(sampleDogs[0]?.id || "");
  const [entries, setEntries] = useState<PoopEntry[]>([]);
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [capturedPhoto, setCapturedPhoto] = useState<File | null>(null);
  const [newEntry, setNewEntry] = useState<Partial<PoopEntry>>({
    consistency: "normal",
    color: "brown",
    date: new Date().toISOString(),
    notes: ""
  });
  
  // Load entries for the selected dog
  useEffect(() => {
    if (selectedDogId) {
      const dogEntries = getEntriesForDog(selectedDogId);
      setEntries(dogEntries);
    }
  }, [selectedDogId]);
  
  const handleDogChange = (dogId: string) => {
    setSelectedDogId(dogId);
  };
  
  const handleDateSelect = (date: Date) => {
    setSelectedDate(date);
    setNewEntry(prev => ({
      ...prev,
      date: date.toISOString()
    }));
  };
  
  const handlePhotoCapture = (file: File) => {
    setCapturedPhoto(file);
    toast.success("Photo captured successfully");
  };
  
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setNewEntry(prev => ({
      ...prev,
      [name]: value
    }));
  };
  
  const handleSelectChange = (name: string, value: string) => {
    setNewEntry(prev => ({
      ...prev,
      [name]: value
    }));
  };
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!selectedDogId) {
      toast.error("Please select a dog");
      return;
    }
    
    const newPoopEntry: PoopEntry = {
      id: `poop-${Date.now()}`,
      dogId: selectedDogId,
      date: newEntry.date || new Date().toISOString(),
      consistency: newEntry.consistency as PoopConsistency,
      color: newEntry.color as PoopColor,
      notes: newEntry.notes,
      tags: newEntry.notes?.split(" ").filter(tag => tag.startsWith("#")) || [],
      location: "Home"
    };
    
    if (capturedPhoto) {
      newPoopEntry.imageUrl = URL.createObjectURL(capturedPhoto);
    }
    
    // Add new entry to the list
    const updatedEntries = [...entries, newPoopEntry];
    setEntries(updatedEntries);
    
    // Reset form
    setNewEntry({
      consistency: "normal",
      color: "brown",
      date: new Date().toISOString(),
      notes: ""
    });
    setCapturedPhoto(null);
    
    toast.success("Entry added successfully");
  };
  
  const selectedDog = dogs.find(dog => dog.id === selectedDogId);
  const healthInsights = selectedDogId ? getInsightsForDog(selectedDogId) : [];
  
  return (
    <Layout>
      <div className="animate-fade-in">
        <header className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Pup Health Dashboard</h1>
          <p className="text-gray-600">
            Track and monitor your dog's digestive health
          </p>
        </header>
        
        <div className="mb-6">
          <Label htmlFor="dogSelect">Select Your Dog</Label>
          <div className="flex gap-4 mt-2">
            <Select value={selectedDogId} onValueChange={handleDogChange}>
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
        
        {selectedDog && (
          <div className="grid grid-cols-1 lg:grid-cols-[300px,1fr] gap-8">
            <div>
              <DogProfile dog={selectedDog} />
            </div>
            
            <div className="space-y-6">
              <Tabs defaultValue="track" className="w-full">
                <TabsList className="grid grid-cols-3 mb-6">
                  <TabsTrigger value="track" className="py-3">
                    <Camera className="mr-2 h-4 w-4" />
                    <span>Track</span>
                  </TabsTrigger>
                  <TabsTrigger value="calendar" className="py-3">
                    <Calendar className="mr-2 h-4 w-4" />
                    <span>Calendar</span>
                  </TabsTrigger>
                  <TabsTrigger value="analysis" className="py-3">
                    <LineChart className="mr-2 h-4 w-4" />
                    <span>Analysis</span>
                  </TabsTrigger>
                </TabsList>
                
                <TabsContent value="track" className="animate-slide-up">
                  <div className="glass-card p-6">
                    <h2 className="text-xl font-semibold mb-4">Record New Entry</h2>
                    <form onSubmit={handleSubmit} className="space-y-6">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                          <PhotoUpload onPhotoCapture={handlePhotoCapture} />
                        </div>
                        
                        <div className="space-y-4">
                          <div>
                            <Label htmlFor="date">Date and Time</Label>
                            <Input
                              id="date"
                              type="datetime-local"
                              value={format(new Date(newEntry.date || new Date()), "yyyy-MM-dd'T'HH:mm")}
                              onChange={(e) => {
                                setNewEntry(prev => ({
                                  ...prev,
                                  date: new Date(e.target.value).toISOString()
                                }));
                              }}
                              className="mt-1"
                            />
                          </div>
                          
                          <div>
                            <Label htmlFor="consistency">Consistency</Label>
                            <Select 
                              value={newEntry.consistency} 
                              onValueChange={(value) => handleSelectChange("consistency", value)}
                            >
                              <SelectTrigger className="mt-1">
                                <SelectValue placeholder="Select consistency" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="normal">Normal</SelectItem>
                                <SelectItem value="soft">Soft</SelectItem>
                                <SelectItem value="liquid">Liquid</SelectItem>
                                <SelectItem value="solid">Solid</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                          
                          <div>
                            <Label htmlFor="color">Color</Label>
                            <Select 
                              value={newEntry.color} 
                              onValueChange={(value) => handleSelectChange("color", value)}
                            >
                              <SelectTrigger className="mt-1">
                                <SelectValue placeholder="Select color" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="brown">Brown</SelectItem>
                                <SelectItem value="green">Green</SelectItem>
                                <SelectItem value="yellow">Yellow</SelectItem>
                                <SelectItem value="red">Red</SelectItem>
                                <SelectItem value="black">Black</SelectItem>
                                <SelectItem value="white">White</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                          
                          <div>
                            <Label htmlFor="notes">Notes</Label>
                            <Input
                              id="notes"
                              name="notes"
                              value={newEntry.notes || ""}
                              onChange={handleInputChange}
                              placeholder="Add notes or use #tags"
                              className="mt-1"
                            />
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex justify-end">
                        <Button type="submit" className="flex items-center">
                          <Save className="mr-2 h-4 w-4" />
                          Save Entry
                        </Button>
                      </div>
                    </form>
                  </div>
                </TabsContent>
                
                <TabsContent value="calendar" className="animate-slide-up">
                  <PoopCalendar 
                    entries={entries} 
                    onDateSelect={handleDateSelect} 
                  />
                </TabsContent>
                
                <TabsContent value="analysis" className="animate-slide-up">
                  <AnalysisCard insights={healthInsights} />
                </TabsContent>
              </Tabs>
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default Dashboard;
