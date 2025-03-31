
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import PhotoUpload from "@/components/PhotoUpload";
import AIAnalysisResult from "@/components/AIAnalysisResult";
import { PoopEntry } from "@/types";
import { supabase } from "@/integrations/supabase/client";
import { v4 as uuidv4 } from "uuid";
import { useAuth } from "@/contexts/AuthContext";
import PoopEntryForm from "./PoopEntryForm";
import FormActions from "./FormActions";
import { usePoopEntryForm } from "@/hooks/usePoopEntryForm";

interface TrackEntryFormProps {
  selectedDogId: string;
  onSubmit: (entry: PoopEntry) => void;
  photoUrl: string | null;
  initialNewEntry?: Partial<PoopEntry>;
  onChatWithAI?: () => void;
  dogInfo?: any; // Dog information for better AI analysis
}

const TrackEntryForm: React.FC<TrackEntryFormProps> = ({ 
  selectedDogId, 
  onSubmit,
  photoUrl,
  initialNewEntry = {},
  onChatWithAI,
  dogInfo
}) => {
  const { user } = useAuth();
  const [isUploading, setIsUploading] = useState<boolean>(false);
  
  const {
    formData: newEntry,
    capturedPhoto,
    isAnalyzing,
    aiAnalysisResult,
    handleInputChange,
    handleSelectChange,
    handlePhotoCapture,
    handleDateChange
  } = usePoopEntryForm({
    initialValues: initialNewEntry,
    onSubmit: () => {}, // We'll handle submission separately
    selectedDogId,
    dogInfo
  });
  
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
        consistency: newEntry.consistency,
        color: newEntry.color,
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
          consistency={newEntry.consistency}
          color={newEntry.color}
          location={newEntry.location}
          notes={newEntry.notes}
          isUploading={isUploading}
          onDateChange={(date) => handleDateChange(new Date(date))}
          onConsistencyChange={(value) => handleSelectChange("consistency", value)}
          onColorChange={(value) => handleSelectChange("color", value)}
          onInputChange={handleInputChange}
        />
      </div>
    </div>
  );
};

export default TrackEntryForm;
