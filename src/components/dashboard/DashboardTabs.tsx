import React from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dog, HealthInsight, PoopEntry } from "@/types";
import { Calendar, AreaChart, PlusCircle, Trophy } from "lucide-react";
import HealthInsightsOverview from "./HealthInsightsOverview";
import PoopCalendar from "@/components/PoopCalendar";
import TrackEntryForm from "./TrackEntryForm";
import LeaderboardCard from "@/components/social/LeaderboardCard";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, Badge, Button } from "@/components/ui/card";

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
  dogInfo?: Dog;
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
  dogInfo
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
        <TabsTrigger value="social" className="flex items-center gap-2">
          <Trophy className="h-4 w-4" />
          <span>Leaderboard</span>
        </TabsTrigger>
      </TabsList>
      
      <TabsContent value="track" className="mt-6 animate-fade-in">
        <TrackEntryForm 
          selectedDogId={selectedDog.id}
          onSubmit={onEntrySubmit}
          photoUrl={photoUrl || null}
          initialNewEntry={newEntry}
          onChatWithAI={onChatWithAI}
          dogInfo={dogInfo}
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
      
      <TabsContent value="social">
        <div className="grid gap-6 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>Perfect Poop Leaders</CardTitle>
              <CardDescription>
                See who has the most perfect 10/10 poops in the community
              </CardDescription>
            </CardHeader>
            <CardContent>
              <LeaderboardCard 
                users={[
                  {
                    id: 'user1',
                    username: 'BarkingMad',
                    avatarUrl: 'https://images.unsplash.com/photo-1583511655857-d19b40a7a54e?auto=format&fit=crop&w=120&q=80',
                    perfectPoops: 27,
                    rank: 1
                  },
                  {
                    id: 'user3',
                    username: 'DoggyStyle',
                    avatarUrl: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&w=120&q=80',
                    perfectPoops: 21,
                    rank: 2
                  },
                  {
                    id: 'user2',
                    username: 'PuppyLover',
                    avatarUrl: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=120&q=80',
                    perfectPoops: 19,
                    rank: 3
                  }
                ]}
                className="md:max-w-md mx-auto"
              />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Your Poop Stats</CardTitle>
              <CardDescription>
                Track your progress toward perfect poops
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span>Perfect Poops</span>
                  <Badge variant="outline" className="text-amber-600">5</Badge>
                </div>
                <div className="flex justify-between items-center">
                  <span>Current Rank</span>
                  <Badge variant="outline" className="text-primary">#12</Badge>
                </div>
                <div className="flex justify-between items-center">
                  <span>Next Rank Target</span>
                  <Badge variant="outline" className="text-green-600">3 more perfect poops</Badge>
                </div>
                
                <Button className="w-full mt-4" onClick={onChatWithAI}>
                  Analyze New Poop
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </TabsContent>
    </Tabs>
  );
};

export default DashboardTabs;
