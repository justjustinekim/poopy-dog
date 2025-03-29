
import React, { useState, useEffect } from "react";
import { Container } from "@/components/ui/Container";
import { useAuth } from "@/contexts/AuthContext";
import { Dog, PoopEntry, HealthInsight } from "@/types";
import { generateMockHealthInsights } from "@/utils/mockData";
import AuthCheck from "@/components/dashboard/AuthCheck";
import DogSelector from "@/components/dashboard/DogSelector";
import DashboardTabs from "@/components/dashboard/DashboardTabs";
import { usePoopEntries } from "@/hooks/usePoopEntries";

const Dashboard = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState("track");
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [mockDogs] = useState<Dog[]>([
    {
      id: "dog-1",
      name: "Buddy",
      breed: "Golden Retriever",
      age: 3,
      weight: 65,
      imageUrl: "/placeholder.svg"
    },
    {
      id: "dog-2",
      name: "Luna",
      breed: "French Bulldog",
      age: 2,
      weight: 22,
      imageUrl: "/placeholder.svg"
    }
  ]);
  
  const [selectedDog, setSelectedDog] = useState<Dog>(mockDogs[0]);
  const [healthInsights, setHealthInsights] = useState<HealthInsight[]>([]);
  const [photoUrl, setPhotoUrl] = useState<string | null>(null);
  const [newEntry, setNewEntry] = useState<Partial<PoopEntry> | undefined>(undefined);
  
  const { entries, loading, addEntry } = usePoopEntries(selectedDog);
  
  useEffect(() => {
    if (selectedDog) {
      setHealthInsights(generateMockHealthInsights(3));
    }
  }, [selectedDog]);
  
  const handleDogChange = (dogId: string) => {
    const dog = mockDogs.find(d => d.id === dogId);
    if (dog) {
      setSelectedDog(dog);
    }
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
    // For now, just navigate to the chat page
    window.location.href = "/chat";
  };
  
  if (loading) {
    return <div className="flex justify-center items-center h-screen">Loading...</div>;
  }
  
  return (
    <Container>
      <AuthCheck />
      
      <div className="my-8">
        <h1 className="text-3xl font-bold mb-6">Dog Health Dashboard</h1>
        
        <DogSelector 
          dogs={mockDogs}
          selectedDogId={selectedDog.id}
          onDogChange={handleDogChange}
        />
        
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
        />
      </div>
    </Container>
  );
};

export default Dashboard;
