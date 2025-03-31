
import React from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dog, HealthInsight, PoopEntry } from "@/types";
import { Calendar, AreaChart, PlusCircle } from "lucide-react";
import HealthInsightsOverview from "./HealthInsightsOverview";
import PoopCalendar from "@/components/PoopCalendar";
import TrackEntryForm from "./TrackEntryForm";

interface DashboardTabsProps {
  activeTab: string;
  onTabChange: (value: string) => void;
  selectedDog: Dog;
  entries: PoopEntry[];
  healthInsights: HealthInsight[];
  onEntrySubmit: (entry: PoopEntry) => void;
  onDateSelect?: (date: Date) => void;
  photoUrl?: string | null;
  newEntry?: Partial<PoopEntry>;
  onChatWithAI?: () => void;
  dogInfo?: Dog; // Add the dogInfo prop
}

const DashboardTabs: React.FC<DashboardTabsProps> = ({
  activeTab,
  onTabChange,
  selectedDog,
  entries,
  healthInsights,
  onEntrySubmit,
  onDateSelect,
  photoUrl,
  newEntry,
  onChatWithAI,
  dogInfo // Add the dogInfo prop parameter
}) => {
  return (
    <Tabs value={activeTab} onValueChange={onTabChange} className="mt-6">
      <TabsList className="grid grid-cols-3 w-full max-w-md">
        <TabsTrigger value="track" className="flex items-center gap-2">
          <PlusCircle className="h-4 w-4" />
          <span>Track</span>
        </TabsTrigger>
        <TabsTrigger value="calendar" className="flex items-center gap-2">
          <Calendar className="h-4 w-4" />
          <span>Calendar</span>
        </TabsTrigger>
        <TabsTrigger value="insights" className="flex items-center gap-2">
          <AreaChart className="h-4 w-4" />
          <span>Insights</span>
        </TabsTrigger>
      </TabsList>
      
      <TabsContent value="track" className="mt-6 animate-fade-in">
        <TrackEntryForm 
          selectedDogId={selectedDog.id}
          onSubmit={onEntrySubmit}
          photoUrl={photoUrl || null}
          initialNewEntry={newEntry}
          onChatWithAI={onChatWithAI}
          dogInfo={dogInfo} // Pass the dogInfo prop
        />
      </TabsContent>
      
      <TabsContent value="calendar" className="mt-6 animate-fade-in">
        <div className="glass-card p-6">
          <h2 className="text-xl font-semibold mb-4">Health History</h2>
          <PoopCalendar 
            entries={entries} 
            onDateSelect={onDateSelect}
          />
        </div>
      </TabsContent>
      
      <TabsContent value="insights" className="mt-6 animate-fade-in">
        <HealthInsightsOverview 
          dogName={selectedDog.name} 
          entries={entries} 
          insights={healthInsights}
        />
      </TabsContent>
    </Tabs>
  );
};

export default DashboardTabs;
