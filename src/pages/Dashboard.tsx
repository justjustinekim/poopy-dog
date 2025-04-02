
import React, { useState, useEffect } from "react";
import { Container } from "@/components/ui/Container";
import { useAuth } from "@/contexts/AuthContext";
import { Dog, PoopEntry, HealthInsight } from "@/types";
import { generateMockHealthInsights } from "@/utils/mockData";
import AuthCheck from "@/components/dashboard/AuthCheck";
import DogSelector from "@/components/dashboard/DogSelector";
import DashboardTabs from "@/components/dashboard/DashboardTabs";
import { usePoopEntries } from "@/hooks/usePoopEntries";
import { useNavigate } from "react-router-dom";

const Dashboard = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState("track");
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [dogs, setDogs] = useState<Dog[]>([]);
  
  const [selectedDog, setSelectedDog] = useState<Dog | null>(null);
  const [healthInsights, setHealthInsights] = useState<HealthInsight[]>([]);
  const [photoUrl, setPhotoUrl] = useState<string | null>(null);
  const [newEntry, setNewEntry] = useState<Partial<PoopEntry> | undefined>(undefined);
  
  // Get dogs from local storage
  useEffect(() => {
    const storedDogs = localStorage.getItem("dogs");
    if (storedDogs) {
      const parsedDogs = JSON.parse(storedDogs);
      setDogs(parsedDogs);
      
      // Select the first dog by default
      if (parsedDogs.length > 0 && !selectedDog) {
        setSelectedDog(parsedDogs[0]);
      }
    } else {
      // Fallback to mock data if no dogs in storage
      const mockDogs: Dog[] = [
        {
          id: "dog-1",
          name: "Buddy",
          breed: "Golden Retriever",
          age: 3,
          weight: 65,
          imageUrl: "/placeholder.svg"
        }
      ];
      setDogs(mockDogs);
      setSelectedDog(mockDogs[0]);
    }
  }, []);
  
  const { entries, loading, addEntry } = usePoopEntries(selectedDog || undefined);
  
  useEffect(() => {
    if (selectedDog) {
      setHealthInsights(generateMockHealthInsights(3));
    }
  }, [selectedDog]);
  
  const handleDogChange = (dogId: string) => {
    const dog = dogs.find(d => d.id === dogId);
    if (dog) {
      setSelectedDog(dog);
    }
  };
  
  const handleAddDog = () => {
    navigate("/onboarding");
  };
  
  const handleEntrySubmit = (entry: PoopEntry) => {
    addEntry(entry);
    setPhotoUrl(null);
    setNewEntry(undefined);
    setActiveTab("calendar");
  };
  
  const handleDateSelect = (date: Date) => {
    setSelectedDate(date);
    const formattedDate = date.toISOString();
    
    // Find entries for the selected date
    const entriesForDate = entries.filter(
      entry => new Date(entry.date).toDateString() === date.toDateString()
    );
    
    if (entriesForDate.length > 0) {
      const latestEntry = entriesForDate[0]; // Assuming entries are sorted by date desc
      
      setPhotoUrl(latestEntry.imageUrl || null);
      
      setNewEntry({
        dogId: latestEntry.dogId,
        date: latestEntry.date,
        consistency: latestEntry.consistency,
        color: latestEntry.color,
        notes: latestEntry.notes,
        location: latestEntry.location
      });
      
      setActiveTab("track");
    }
  };
  
  const handleChatWithAI = () => {
    // Navigate to the chat page with photo URL if available
    navigate("/chat", { 
      state: { 
        capturedPhoto: photoUrl,
        dogInfo: selectedDog
      }
    });
  };
  
  if (loading) {
    return <div className="flex justify-center items-center h-screen">Loading...</div>;
  }
  
  return (
    <Container>
      <AuthCheck />
      
      <div className="my-8">
        <h1 className="text-3xl font-bold mb-6">Dog Health Dashboard</h1>
        
        {selectedDog && (
          <DogSelector 
            dogs={dogs}
            selectedDogId={selectedDog.id}
            onDogChange={handleDogChange}
            onAddDog={handleAddDog}
          />
        )}
        
        {selectedDog && (
          <DashboardTabs 
            activeTab={activeTab}
            onTabChange={setActiveTab}
            selectedDog={selectedDog}
            entries={entries}
            healthInsights={healthInsights}
            onEntrySubmit={handleEntrySubmit}
            onDateSelect={handleDateSelect}
            photoUrl={photoUrl}
            newEntry={newEntry}
            onChatWithAI={handleChatWithAI}
            dogInfo={selectedDog}
          />
        )}
      </div>
    </Container>
  );
};

export default Dashboard;
