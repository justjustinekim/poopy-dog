
import React, { useState } from "react";
import { format } from "date-fns";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { MapPin, Save, MessageSquare } from "lucide-react";
import PhotoUpload from "@/components/PhotoUpload";
import AIAnalysisResult from "@/components/AIAnalysisResult";
import { PoopEntry, PoopConsistency, PoopColor, HealthInsight } from "@/types";

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
  const [capturedPhoto, setCapturedPhoto] = useState<File | null>(null);
  const [newEntry, setNewEntry] = useState<Partial<PoopEntry>>({
    consistency: "normal",
    color: "brown",
    date: new Date().toISOString(),
    notes: "",
    location: "",
    ...initialNewEntry
  });
  
  // AI analysis states
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
    
    // Start AI analysis - in a real app, we'd call the API here
    setIsAnalyzing(true);
    // Mocking AI analysis for demo
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
      
      // Auto-fill form based on AI detection
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
  
  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!selectedDogId) {
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
      location: newEntry.location
    };
    
    if (capturedPhoto) {
      newPoopEntry.imageUrl = URL.createObjectURL(capturedPhoto);
    } else if (photoUrl) {
      newPoopEntry.imageUrl = photoUrl;
    }
    
    onSubmit(newPoopEntry);
    
    // Reset form
    setNewEntry({
      consistency: "normal",
      color: "brown",
      date: new Date().toISOString(),
      notes: "",
      location: ""
    });
    setCapturedPhoto(null);
    setAiAnalysisResult({ insights: [] });
  };
  
  return (
    <div className="glass-card p-6">
      <h2 className="text-xl font-semibold mb-4">Record New Entry</h2>
      <form onSubmit={handleFormSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-6">
            <PhotoUpload 
              onPhotoCapture={handlePhotoCapture} 
              initialPhotoUrl={photoUrl}
            />
            
            {/* AI Analysis Result */}
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
            
            {/* Chat with AI button */}
            {(photoUrl || capturedPhoto) && onChatWithAI && (
              <Button 
                type="button"
                variant="secondary"
                className="w-full mt-4"
                onClick={onChatWithAI}
              >
                <MessageSquare className="mr-2 h-4 w-4" />
                Get AI Advice on This Sample
              </Button>
            )}
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
              <Label htmlFor="location" className="flex items-center gap-1">
                <MapPin className="h-3.5 w-3.5" />
                Location (optional)
              </Label>
              <Input
                id="location"
                name="location"
                value={newEntry.location || ""}
                onChange={handleInputChange}
                placeholder="Where was the sample found?"
                className="mt-1"
              />
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
            
            <div className="flex justify-end pt-4">
              <Button type="submit" className="flex items-center">
                <Save className="mr-2 h-4 w-4" />
                Save Entry
              </Button>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
};

export default TrackEntryForm;
