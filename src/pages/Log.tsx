
// This file handles photo uploading, analysis, and storage in Supabase
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Layout from "@/components/Layout";
import { toast } from "sonner";
import PhotoUpload from "@/components/PhotoUpload";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { useDogs } from "@/hooks/useDogs";
import { Dog } from "@/types";
import { v4 as uuidv4 } from "uuid";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { analyzePoopImage } from "@/utils/poopAnalysis";

const Log = () => {
  const [isUploading, setIsUploading] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [selectedDogId, setSelectedDogId] = useState<string | null>(null);
  const navigate = useNavigate();
  const { user } = useAuth();
  const { dogs, loading: dogsLoading } = useDogs();

  // Check authentication status when component mounts
  useEffect(() => {
    if (!user) {
      toast.error("You must be logged in to upload photos");
      navigate("/auth");
    }
  }, [user, navigate]);

  // Set default selected dog when dogs are loaded
  useEffect(() => {
    if (dogs && dogs.length > 0 && !selectedDogId) {
      setSelectedDogId(dogs[0].id);
    }
  }, [dogs, selectedDogId]);

  const handlePhotoCapture = async (file: File) => {
    if (!user) {
      toast.error("You must be logged in to upload photos");
      return;
    }

    if (!selectedDogId) {
      toast.error("Please select a dog first");
      return;
    }

    setIsUploading(true);
    setIsAnalyzing(true);
    
    try {
      // First, analyze the image with AI
      const selectedDog = dogs.find(dog => dog.id === selectedDogId);
      const analysisResult = await analyzePoopImage(file, selectedDog);
      
      // Generate a unique filename with user ID and timestamp
      const fileExt = file.name.split('.').pop();
      const fileName = `${user.id}-${Date.now()}.${fileExt}`;
      const filePath = `public/${fileName}`;
      
      console.log("Uploading file:", filePath);
      
      // Upload to Supabase storage
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('poop_images')
        .upload(filePath, file, {
          cacheControl: '3600',
          upsert: false
        });
      
      if (uploadError) {
        console.error("Upload error:", uploadError);
        throw new Error(`Error uploading image: ${uploadError.message}`);
      }
      
      console.log("Upload successful, getting public URL");
      
      // Get the public URL for the uploaded image
      const { data: urlData } = supabase.storage
        .from('poop_images')
        .getPublicUrl(filePath);
      
      const imageUrl = urlData.publicUrl;
      console.log("Public URL:", imageUrl);
      
      // Store entry in the database
      const { data: entryData, error: entryError } = await supabase
        .from('poop_entries')
        .insert({
          user_id: user.id,
          dog_id: selectedDogId,
          image_path: filePath,
          consistency: analysisResult.consistency || "unknown",
          color: analysisResult.color || "unknown",
          date: new Date().toISOString(),
          notes: analysisResult.insights?.[0]?.description || null,
        })
        .select('id')
        .single();
      
      if (entryError) {
        console.error("Entry error:", entryError);
        throw new Error(`Error logging entry: ${entryError.message}`);
      }
      
      console.log("Entry created with ID:", entryData.id);
      toast.success("Photo uploaded and analyzed successfully!");
      
      // Redirect to the log entry page for review and additional details
      navigate(`/log-entry?entryId=${entryData.id}&imageUrl=${encodeURIComponent(imageUrl)}`);
    } catch (error) {
      console.error("Upload error:", error);
      toast.error(error instanceof Error ? error.message : "Failed to upload photo");
    } finally {
      setIsUploading(false);
      setIsAnalyzing(false);
    }
  };

  if (!user) {
    return (
      <Layout>
        <div className="w-full h-full flex flex-col items-center justify-center bg-white dark:bg-gray-50">
          <p>You must be logged in to upload photos.</p>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="w-full h-full flex flex-col items-center bg-white dark:bg-gray-50">
        <div className="w-full max-w-md mx-auto">
          {dogs && dogs.length > 0 && (
            <div className="mb-4 bg-white dark:bg-gray-200 p-4 rounded-lg">
              <Label htmlFor="dogSelect" className="block text-sm font-medium mb-2">
                Select which dog this poop belongs to:
              </Label>
              <Select
                value={selectedDogId || ''}
                onValueChange={(value) => setSelectedDogId(value)}
              >
                <SelectTrigger id="dogSelect">
                  <SelectValue placeholder="Select a dog" />
                </SelectTrigger>
                <SelectContent>
                  {dogs.map((dog: Dog) => (
                    <SelectItem key={dog.id} value={dog.id}>
                      {dog.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}

          {dogsLoading ? (
            <div className="flex items-center justify-center h-48">
              <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-green-500"></div>
            </div>
          ) : dogs && dogs.length === 0 ? (
            <div className="text-center p-6 bg-white dark:bg-gray-200 rounded-lg">
              <p className="mb-4">You need to add a dog first before logging a poop entry.</p>
              <Button 
                onClick={() => navigate('/profile')}
                className="bg-green-500 hover:bg-green-600"
              >
                Add Your First Dog
              </Button>
            </div>
          ) : (
            <div className="h-[calc(100vh-10rem)]">
              <PhotoUpload 
                onPhotoCapture={handlePhotoCapture} 
                className="w-full h-full"
                snapchatStyle={true}
              />
            </div>
          )}
          
          {(isUploading || isAnalyzing) && (
            <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
              <div className="bg-white dark:bg-gray-100 p-6 rounded-lg shadow-lg">
                <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-green-500 mx-auto"></div>
                <p className="mt-4 text-center">
                  {isAnalyzing ? "Analyzing poop sample..." : "Uploading your photo..."}
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
};

export default Log;
