
import React from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Camera, Calendar, LineChart, MessageSquare } from "lucide-react";
import { PoopEntry, HealthInsight, Dog } from "@/types";
import TrackEntryForm from "./TrackEntryForm";
import PoopCalendar from "@/components/PoopCalendar";
import AnalysisCard from "@/components/AnalysisCard";
import { Button } from "@/components/ui/button";

interface DashboardTabsProps {
  activeTab?: string;
  onTabChange?: (tab: string) => void;
  selectedDog: Dog;
  entries: PoopEntry[];
  healthInsights: HealthInsight[];
  onEntrySubmit: (entry: PoopEntry) => void;
  onDateSelect: (date: Date) => void;
  photoUrl: string | null;
  newEntry?: Partial<PoopEntry>;
  onChatWithAI?: () => void;
}

const DashboardTabs: React.FC<DashboardTabsProps> = ({
  activeTab = "track",
  onTabChange = () => {},
  selectedDog,
  entries,
  healthInsights,
  onEntrySubmit,
  onDateSelect,
  photoUrl,
  newEntry,
  onChatWithAI
}) => {
  return (
    <Tabs 
      defaultValue="track" 
      value={activeTab} 
      onValueChange={onTabChange} 
      className="w-full"
    >
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
        <TrackEntryForm 
          selectedDogId={selectedDog.id}
          onSubmit={onEntrySubmit}
          photoUrl={photoUrl}
          initialNewEntry={newEntry}
          onChatWithAI={onChatWithAI}
        />
      </TabsContent>
      
      <TabsContent value="calendar" className="animate-slide-up">
        <PoopCalendar 
          entries={entries} 
          onDateSelect={onDateSelect} 
        />
      </TabsContent>
      
      <TabsContent value="analysis" className="animate-slide-up">
        <AnalysisCard insights={healthInsights} />
      </TabsContent>
    </Tabs>
  );
};

export default DashboardTabs;
