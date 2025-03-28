
import React, { useState, useEffect } from "react";
import Layout from "@/components/Layout";
import { useLocation, useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { Dog, PoopEntry, PoopConsistency, PoopColor } from "@/types";
import { PoopEntryRow } from "@/types/supabase";
import { sampleDogs, getInsightsForDog } from "@/utils/mockData";
import { analyzePoopImage } from "@/utils/imageAnalysis";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import DogProfile from "@/components/DogProfile";
import DogSelector from "@/components/dashboard/DogSelector";
import DashboardTabs from "@/components/dashboard/DashboardTabs";
import AuthCheck from "@/components/dashboard/AuthCheck";

const Dashboard: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [dogs, setDogs] = useState<Dog[]>(sampleDogs);
  const [selectedDogId, setSelectedDogId] = useState<string>(sampleDogs[0]?.id || "");
  const [entries, setEntries] = useState<PoopEntry[]>([]);
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [photoUrl, setPhotoUrl] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<string>("track");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [newEntry, setNewEntry] = useState<Partial<PoopEntry>>({
    consistency: "normal",
    color: "brown",
    date: new Date().toISOString(),
    notes: "",
    location: ""
  });
  
  // Check if we have a photo from camera
  useEffect(() => {
    if (location.state?.capturedPhoto) {
      setPhotoUrl(location.state.capturedPhoto);
      
      // Set active tab to track
      setActiveTab("track");
      
      // Clear state so it doesn't persist on navigation
      navigate(location.pathname, { replace: true, state: {} });
      
      // Fetch the file from URL and analyze
      fetch(location.state.capturedPhoto)
        .then(res => res.blob())
        .then(blob => {
          const file = new File([blob], "camera-photo.jpg", { type: "image/jpeg" });
          handlePhotoAnalysis(file);
        })
        .catch(err => {
          console.error("Error fetching photo:", err);
        });
    }

    // Auto-open the entry form if specified
    if (location.state?.autoOpenEntryForm) {
      setActiveTab("track");
    }
  }, [location.state]);
  
  // Load entries for the selected dog from Supabase
  useEffect(() => {
    const fetchEntries = async () => {
      if (!selectedDogId || !user) return;
      
      setIsLoading(true);
      
      try {
        const { data, error } = await supabase
          .from('poop_entries')
          .select('*')
          .eq('dog_id', selectedDogId)
          .order('date', { ascending: false });
          
        if (error) {
          throw error;
        }
        
        if (data) {
          // Transform the data to match our PoopEntry type
          const formattedEntries: PoopEntry[] = (data as PoopEntryRow[]).map(entry => {
            let imageUrl = null;
            
            if (entry.image_path) {
              const { data: urlData } = supabase.storage
                .from('poop_images')
                .getPublicUrl(entry.image_path);
                
              imageUrl = urlData.publicUrl;
            }
            
            return {
              id: entry.id,
              dogId: entry.dog_id,
              date: entry.date,
              imageUrl: imageUrl,
              consistency: entry.consistency as PoopConsistency,
              color: entry.color as PoopColor,
              notes: entry.notes || "",
              tags: entry.notes?.split(" ").filter((tag: string) => tag.startsWith("#")) || [],
              location: entry.location || ""
            };
          });
          
          setEntries(formattedEntries);
        }
      } catch (error) {
        console.error("Error fetching entries:", error);
        toast.error("Failed to load entries. Please try again.");
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchEntries();
  }, [selectedDogId, user]);
  
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
  
  const handlePhotoAnalysis = async (file: File) => {
    try {
      const result = await analyzePoopImage(file);
      
      // Auto-fill form based on AI detection if confident enough
      if (result.isPoop && result.confidence && result.confidence > 0.7) {
        if (result.color) {
          setNewEntry(prev => ({ ...prev, color: result.color }));
        }
        if (result.consistency) {
          setNewEntry(prev => ({ ...prev, consistency: result.consistency }));
        }
        toast.success("AI analysis complete! Form updated with detected properties.");
      } else if (!result.isPoop) {
        toast.info("This doesn't appear to be a poop image. Please try again with a clearer photo.");
      } else {
        toast.info("Analysis complete, but we're not entirely sure about some properties.");
      }
    } catch (error) {
      console.error("AI analysis error:", error);
      toast.error("Failed to analyze the image. Please try again.");
    }
  };
  
  const handleEntrySubmit = (poopEntry: PoopEntry) => {
    // Add new entry to the list
    const updatedEntries = [poopEntry, ...entries];
    setEntries(updatedEntries);
    
    // Reset state
    setNewEntry({
      consistency: "normal",
      color: "brown",
      date: new Date().toISOString(),
      notes: "",
      location: ""
    });
    setPhotoUrl(null);
    
    // Switch to calendar tab to see the new entry
    setActiveTab("calendar");
  };
  
  const handleChatWithAI = () => {
    if (photoUrl) {
      navigate('/chat', { state: { capturedPhoto: photoUrl } });
    } else {
      navigate('/chat');
    }
  };
  
  const selectedDog = dogs.find(dog => dog.id === selectedDogId);
  const healthInsights = selectedDogId ? getInsightsForDog(selectedDogId) : [];
  
  return (
    <Layout>
      <div className="animate-fade-in">
        <header className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Pup Health Dashboard</h1>
          <p className="text-gray-600 dark:text-gray-300">
            Track and monitor your dog's digestive health
          </p>
        </header>
        
        <AuthCheck isAuthenticated={!!user} />
        
        {(!!user || process.env.NODE_ENV === 'development') && (
          <>
            <DogSelector 
              dogs={dogs}
              selectedDogId={selectedDogId}
              onDogChange={handleDogChange}
            />
            
            {selectedDog && (
              <div className="grid grid-cols-1 lg:grid-cols-[300px,1fr] gap-8">
                <div>
                  <DogProfile dog={selectedDog} />
                </div>
                
                <div className="space-y-6">
                  {isLoading ? (
                    <div className="flex items-center justify-center p-12">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                    </div>
                  ) : (
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
                  )}
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </Layout>
  );
};

export default Dashboard;
