
import { useState } from "react";
import { PoopEntry, PoopConsistency, PoopColor, HealthInsight } from "@/types";
import { analyzePoopImage } from "@/utils/poopAnalysis";
import { toast } from "sonner";

interface UsePoopEntryFormProps {
  initialValues?: Partial<PoopEntry>;
  onSubmit: (entry: PoopEntry) => void;
  selectedDogId: string;
  dogInfo?: any;
}

interface AIAnalysisResult {
  isPoop?: boolean;
  confidence?: number;
  color?: PoopColor;
  consistency?: PoopConsistency;
  colorSpectrum?: string;
  insights: HealthInsight[];
}

export const usePoopEntryForm = ({
  initialValues = {},
  onSubmit,
  selectedDogId,
  dogInfo
}: UsePoopEntryFormProps) => {
  const [capturedPhoto, setCapturedPhoto] = useState<File | null>(null);
  const [photoUrl, setPhotoUrl] = useState<string | null>(null);
  const [formData, setFormData] = useState<Partial<PoopEntry> & { customColor?: string, customConsistency?: string }>({
    consistency: "normal",
    color: "brown",
    date: new Date().toISOString(),
    notes: "",
    location: "",
    customColor: "",
    customConsistency: "",
    ...initialValues
  });
  
  const [isAnalyzing, setIsAnalyzing] = useState<boolean>(false);
  const [aiAnalysisResult, setAiAnalysisResult] = useState<AIAnalysisResult>({ insights: [] });
  
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };
  
  const handleCustomInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };
  
  const handleSelectChange = (name: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };
  
  const handleDateChange = (date: Date) => {
    setFormData(prev => ({
      ...prev,
      date: date.toISOString()
    }));
  };
  
  const handlePhotoCapture = async (file: File, url?: string) => {
    setCapturedPhoto(file);
    if (url) {
      setPhotoUrl(url);
    }
    
    // Automatically analyze the photo with AI
    try {
      setIsAnalyzing(true);
      console.log("Starting analysis of captured photo...");
      console.log("Dog info:", dogInfo);
      
      const result = await analyzePoopImage(file, dogInfo);
      console.log("Analysis result:", result);
      setAiAnalysisResult(result);
      
      // Update form data with AI analysis results
      if (result.isPoop && result.color && result.consistency) {
        setFormData(prev => ({
          ...prev,
          color: result.color,
          consistency: result.consistency
        }));
        
        toast.success("Photo analyzed successfully!");
      } else if (!result.isPoop) {
        toast.warning("The image doesn't appear to contain a stool sample.");
      }
    } catch (error) {
      console.error("Error analyzing photo:", error);
      toast.error("Failed to analyze the photo. Please try again.");
    } finally {
      setIsAnalyzing(false);
    }
  };
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!selectedDogId) {
      return;
    }
    
    const newPoopEntry: PoopEntry = {
      id: `poop-${Date.now()}`,
      dogId: selectedDogId,
      date: formData.date || new Date().toISOString(),
      consistency: formData.consistency as PoopConsistency,
      color: formData.color as PoopColor,
      notes: formData.notes,
      tags: formData.notes?.split(" ").filter(tag => tag.startsWith("#")) || [],
      location: formData.location
    };
    
    // If custom values are used, add them to notes
    if (formData.consistency === 'other' && formData.customConsistency) {
      newPoopEntry.notes = `${newPoopEntry.notes || ''} [Custom consistency: ${formData.customConsistency}]`.trim();
    }
    
    if (formData.color === 'other' && formData.customColor) {
      newPoopEntry.notes = `${newPoopEntry.notes || ''} [Custom color: ${formData.customColor}]`.trim();
    }
    
    if (capturedPhoto) {
      newPoopEntry.imageUrl = URL.createObjectURL(capturedPhoto);
    } else if (photoUrl) {
      newPoopEntry.imageUrl = photoUrl;
    }
    
    onSubmit(newPoopEntry);
    
    // Reset form
    setFormData({
      consistency: "normal",
      color: "brown",
      date: new Date().toISOString(),
      notes: "",
      location: "",
      customColor: "",
      customConsistency: ""
    });
    setCapturedPhoto(null);
    setPhotoUrl(null);
    setAiAnalysisResult({ insights: [] });
  };
  
  return {
    formData,
    capturedPhoto,
    photoUrl,
    isAnalyzing,
    aiAnalysisResult,
    setAiAnalysisResult,
    setIsAnalyzing,
    handleInputChange,
    handleCustomInputChange,
    handleSelectChange,
    handleDateChange,
    handlePhotoCapture,
    handleSubmit,
    setFormData
  };
};
