import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { MessageSquare } from "lucide-react";
import { toast } from "sonner";
import PhotoUpload from "@/components/PhotoUpload";
import AIAnalysisResult from "@/components/AIAnalysisResult";
import { PoopEntry, PoopConsistency, PoopColor, HealthInsight } from "@/types";
import { supabase } from "@/integrations/supabase/client";
import { v4 as uuidv4 } from "uuid";
import { useAuth } from "@/contexts/AuthContext";
import PoopEntryForm from "./PoopEntryForm";
import FormActions from "./FormActions";
import { PoopEntryRow } from "@/types/supabase";

interface TrackEntryFormProps {
  selectedDogId: string;
  onSubmit: (entry: PoopEntry) => void;
  photoUrl: string | null;
  initialNewEntry?: Partial<PoopEntry>;
  onChatWithAI?: () => void;
}

const TrackEntryForm: React.FC<TrackEntryFormProps> = ({ 
  selectedDogId, 
  onSubmit,
  photoUrl,
  initialNewEntry = {},
  onChatWithAI
}) => {
  const { user } = useAuth();
  const [capturedPhoto, setCapturedPhoto] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState<boolean>(false);
  const [newEntry, setNewEntry] = useState<Partial<PoopEntry>>({
    consistency: "normal",
    color: "brown",
    date: new Date().toISOString(),
    notes: "",
    location: "",
    ...initialNewEntry
  });
  
  const [isAnalyzing, setIsAnalyzing] = useState<boolean>(false);
  const [aiAnalysisResult, setAiAnalysisResult] = useState<{
    isPoop?: boolean;
    confidence?: number;
    color?: PoopColor;
    consistency?: PoopConsistency;
    colorSpectrum?: string;
    insights: HealthInsight[];
  }>({ insights: [] });
  
  const handlePhotoCapture = async (file: File) => {
    setCapturedPhoto(file);
    
    setIsAnalyzing(true);
    setTimeout(() => {
      setIsAnalyzing(false);
      const mockResult = {
        isPoop: true,
        confidence: 0.92,
        color: "brown" as PoopColor,
        consistency: "normal" as PoopConsistency,
        colorSpectrum: "#654321",
        insights: [
          {
            title: "Healthy Consistency",
            description: "The stool appears to have normal consistency.",
            severity: "low" as "low" | "medium" | "high",
            recommendation: "Continue with current diet and exercise routine."
          }
        ]
      };
      
      setAiAnalysisResult(mockResult);
      
      setNewEntry(prev => ({ 
        ...prev, 
        color: mockResult.color,
        consistency: mockResult.consistency 
      }));
    }, 1500);
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
  
  const handleFormSubmit = async () => {
    if (!selectedDogId) {
      toast.error("Please select a dog first");
      return;
    }
    
    if (!user) {
      toast.error("You must be logged in to save entries");
      return;
    }
    
    setIsUploading(true);
    
    try {
      let imagePath = null;
      
      if (capturedPhoto) {
        const fileExt = capturedPhoto.name.split('.').pop();
        const fileName = `${uuidv4()}.${fileExt}`;
        const filePath = `${selectedDogId}/${fileName}`;
        
        const { error: uploadError, data } = await supabase.storage
          .from('poop_images')
          .upload(filePath, capturedPhoto, {
            cacheControl: '3600',
            upsert: false
          });
        
        if (uploadError) {
          throw new Error(`Error uploading image: ${uploadError.message}`);
        }
        
        imagePath = filePath;
      } else if (photoUrl) {
        imagePath = photoUrl.includes('poop_images') ? photoUrl.split('poop_images/')[1] : null;
      }
      
      const { error: insertError } = await supabase
        .from('poop_entries')
        .insert({
          user_id: user.id,
          dog_id: selectedDogId,
          image_path: imagePath,
          consistency: newEntry.consistency as any,
          color: newEntry.color as any,
          date: newEntry.date || new Date().toISOString(),
          notes: newEntry.notes || null,
          location: newEntry.location || null,
        } as any);
      
      if (insertError) {
        throw new Error(`Error saving entry: ${insertError.message}`);
      }
      
      const newPoopEntry: PoopEntry = {
        id: `poop-${Date.now()}`,
        dogId: selectedDogId,
        date: newEntry.date || new Date().toISOString(),
        consistency: newEntry.consistency as PoopConsistency,
        color: newEntry.color as PoopColor,
        notes: newEntry.notes,
        tags: newEntry.notes?.split(" ").filter(tag => tag.startsWith("#")) || [],
        location: newEntry.location
      };
      
      if (imagePath) {
        const { data } = supabase.storage
          .from('poop_images')
          .getPublicUrl(imagePath);
        
        newPoopEntry.imageUrl = data.publicUrl;
      }
      
      onSubmit(newPoopEntry);
      
      setNewEntry({
        consistency: "normal",
        color: "brown",
        date: new Date().toISOString(),
        notes: "",
        location: ""
      });
      setCapturedPhoto(null);
      setAiAnalysisResult({ insights: [] });
      
      toast.success("Entry saved successfully!");
    } catch (error) {
      console.error("Error saving entry:", error);
      toast.error(error instanceof Error ? error.message : "Failed to save entry");
    } finally {
      setIsUploading(false);
    }
  };
  
  return (
    <div className="glass-card p-6">
      <h2 className="text-xl font-semibold mb-4">Record New Entry</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-6">
          <PhotoUpload 
            onPhotoCapture={handlePhotoCapture} 
            initialPhotoUrl={photoUrl}
          />
          
          {(isAnalyzing || aiAnalysisResult.insights.length > 0) && (
            <AIAnalysisResult 
              isLoading={isAnalyzing}
              isPoop={aiAnalysisResult.isPoop}
              confidence={aiAnalysisResult.confidence}
              color={aiAnalysisResult.color}
              consistency={aiAnalysisResult.consistency}
              colorSpectrum={aiAnalysisResult.colorSpectrum}
              insights={aiAnalysisResult.insights}
            />
          )}
          
          <FormActions 
            isUploading={isUploading}
            hasPhoto={!!(photoUrl || capturedPhoto)}
            onSubmit={handleFormSubmit}
            onChatWithAI={onChatWithAI}
          />
        </div>
        
        <PoopEntryForm
          date={newEntry.date || new Date().toISOString()}
          consistency={newEntry.consistency as PoopConsistency}
          color={newEntry.color as PoopColor}
          location={newEntry.location}
          notes={newEntry.notes}
          isUploading={isUploading}
          onDateChange={(date) => setNewEntry(prev => ({ ...prev, date }))}
          onConsistencyChange={(value) => handleSelectChange("consistency", value)}
          onColorChange={(value) => handleSelectChange("color", value)}
          onInputChange={handleInputChange}
        />
      </div>
    </div>
  );
};

export default TrackEntryForm;
