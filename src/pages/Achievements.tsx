
import React from "react";
import Layout from "@/components/Layout";
import { useAchievements } from "@/hooks/useAchievements";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useUserRewards } from "@/hooks/useUserRewards";
import AchievementStats from "@/components/achievements/AchievementStats";
import AchievementList from "@/components/achievements/AchievementList";
import RewardsShopDialog from "@/components/achievements/RewardsShopDialog";
import Challenges from "@/components/challenges/Challenges";

const Achievements: React.FC = () => {
  const {
    achievements,
    challenges,
    loading,
    streak,
    level,
    experience,
    nextLevelExp
  } = useAchievements();
  
  const { rewards } = useUserRewards();
  
  // Calculate achievements stats
  const totalAchievements = achievements.filter(a => !a.isNegative).length;
  const unlockedAchievements = achievements.filter(a => a.unlocked && !a.isNegative).length;
  const achievementCompletionRate = totalAchievements > 0 
    ? (unlockedAchievements / totalAchievements) * 100 
    : 0;
  
  return (
    <Layout className="pb-20">
      <div className="max-w-2xl mx-auto p-4">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-3xl font-bold text-primary">Achievements</h1>
          <RewardsShopDialog rewards={rewards} />
        </div>
        
        <AchievementStats 
          unlockedAchievements={unlockedAchievements}
          totalAchievements={totalAchievements}
          achievementCompletionRate={achievementCompletionRate}
          streak={streak}
          level={level}
          experience={experience}
          nextLevelExp={nextLevelExp}
        />
        
        <Tabs defaultValue="achievements">
          <TabsList className="grid w-full grid-cols-2 mb-8">
            <TabsTrigger value="achievements">Achievements</TabsTrigger>
            <TabsTrigger value="challenges">Challenges</TabsTrigger>
          </TabsList>
          
          <TabsContent value="achievements">
            <AchievementList 
              achievements={achievements}
              loading={loading}
            />
          </TabsContent>
          
          <TabsContent value="challenges">
            <Challenges 
              challenges={challenges} 
              loading={loading} 
            />
          </TabsContent>
        </Tabs>
      </div>
    </Layout>
  );
};

export default Achievements;
