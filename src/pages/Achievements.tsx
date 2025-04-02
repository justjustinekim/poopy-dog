
import React, { useState } from "react";
import Layout from "@/components/Layout";
import { useAchievements } from "@/hooks/useAchievements";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Trophy, Award, Flame, Calendar, AlertCircle, Gift } from "lucide-react";
import { cn } from "@/lib/utils";
import { Achievement, Challenge } from "@/types";
import Challenges from "@/components/Challenges";
import RewardsShop from "@/components/RewardsShop";
import { useUserRewards } from "@/hooks/useUserRewards";

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
  const [showRewardsShop, setShowRewardsShop] = useState(false);
  
  // Filter achievements by type
  const standardAchievements = achievements.filter(
    a => a.achievementType === 'standard' && !a.isNegative
  );
  const dailyAchievements = achievements.filter(
    a => a.achievementType === 'daily' && !a.isNegative
  );
  const negativeAchievements = achievements.filter(a => a.isNegative);
  
  // Calculate achievements stats
  const totalAchievements = achievements.filter(a => !a.isNegative).length;
  const unlockedAchievements = achievements.filter(a => a.unlocked && !a.isNegative).length;
  const achievementCompletionRate = totalAchievements > 0 
    ? (unlockedAchievements / totalAchievements) * 100 
    : 0;
  
  const renderAchievement = (achievement: Achievement) => (
    <Card 
      key={achievement.id}
      className={cn(
        "transition-all hover:shadow-md",
        achievement.unlocked 
          ? "border-primary/30" 
          : "border-gray-200 opacity-70"
      )}
    >
      <CardHeader className="p-4 flex flex-row items-center space-y-0 gap-3">
        <div 
          className={cn(
            "h-12 w-12 flex items-center justify-center rounded-full text-xl",
            achievement.unlocked 
              ? "bg-primary/10 text-primary" 
              : "bg-gray-100 text-gray-400 dark:bg-gray-800"
          )}
        >
          {achievement.icon || "🏆"}
        </div>
        <div className="flex-1">
          <CardTitle className="text-base">
            {achievement.title}
          </CardTitle>
          <CardDescription>{achievement.description}</CardDescription>
          
          {achievement.maxProgress && achievement.maxProgress > 1 && (
            <div className="mt-2">
              <div className="flex justify-between text-xs mb-1">
                <span>Progress</span>
                <span>{achievement.progress || 0}/{achievement.maxProgress}</span>
              </div>
              <Progress 
                value={((achievement.progress || 0) / achievement.maxProgress) * 100} 
                className="h-2" 
              />
            </div>
          )}
          
          {achievement.unlocked && achievement.dateUnlocked && (
            <p className="text-xs text-gray-500 mt-2">
              Unlocked on {new Date(achievement.dateUnlocked).toLocaleDateString()}
            </p>
          )}
        </div>
      </CardHeader>
    </Card>
  );
  
  return (
    <Layout className="pb-20">
      <div className="max-w-2xl mx-auto p-4">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-3xl font-bold text-primary">Achievements</h1>
          <Dialog open={showRewardsShop} onOpenChange={setShowRewardsShop}>
            <DialogTrigger asChild>
              <Button variant="outline" className="gap-2">
                <Gift className="h-4 w-4" />
                <span>Rewards Shop</span>
                <span className="bg-primary/20 text-primary px-2 py-0.5 rounded-full text-xs">
                  {rewards.poopCoins} 💩
                </span>
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl p-6">
              <RewardsShop onClose={() => setShowRewardsShop(false)} />
            </DialogContent>
          </Dialog>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <Card>
            <CardHeader className="pb-2">
              <div className="flex items-center gap-2">
                <Trophy className="h-4 w-4 text-primary" />
                <CardTitle className="text-sm">Achievements</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {unlockedAchievements}/{totalAchievements}
              </div>
              <Progress value={achievementCompletionRate} className="h-2 mt-2" />
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <div className="flex items-center gap-2">
                <Flame className="h-4 w-4 text-orange-500" />
                <CardTitle className="text-sm">Current Streak</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {streak} {streak === 1 ? 'day' : 'days'}
              </div>
              <div className="text-xs text-gray-500 mt-1">Keep it up!</div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <div className="flex items-center gap-2">
                <Award className="h-4 w-4 text-amber-500" />
                <CardTitle className="text-sm">Level {level}</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-sm mt-1">
                {experience}/{nextLevelExp} XP
              </div>
              <Progress 
                value={(experience / nextLevelExp) * 100} 
                className="h-2 mt-2"
              />
            </CardContent>
          </Card>
        </div>
        
        <Tabs defaultValue="achievements">
          <TabsList className="grid w-full grid-cols-2 mb-8">
            <TabsTrigger value="achievements">Achievements</TabsTrigger>
            <TabsTrigger value="challenges">Challenges</TabsTrigger>
          </TabsList>
          
          <TabsContent value="achievements" className="space-y-6">
            <div className="space-y-4 mb-6">
              <h3 className="text-lg font-semibold flex items-center">
                <Trophy className="h-4 w-4 mr-2" />
                Standard Achievements
              </h3>
              
              {loading ? (
                <div className="text-center p-8">Loading achievements...</div>
              ) : standardAchievements.length > 0 ? (
                <div className="space-y-4">
                  {standardAchievements.map(renderAchievement)}
                </div>
              ) : (
                <div className="text-center p-8 text-gray-500">
                  No standard achievements available
                </div>
              )}
            </div>
            
            <div className="space-y-4 mb-6">
              <h3 className="text-lg font-semibold flex items-center">
                <Calendar className="h-4 w-4 mr-2" />
                Daily Achievements
              </h3>
              
              {loading ? (
                <div className="text-center p-4">Loading...</div>
              ) : dailyAchievements.length > 0 ? (
                <div className="space-y-4">
                  {dailyAchievements.map(renderAchievement)}
                </div>
              ) : (
                <div className="text-center p-4 text-gray-500">
                  No daily achievements available
                </div>
              )}
            </div>
            
            <div className="space-y-4">
              <h3 className="text-lg font-semibold flex items-center">
                <AlertCircle className="h-4 w-4 mr-2 text-red-500" />
                Setbacks
              </h3>
              
              {loading ? (
                <div className="text-center p-4">Loading...</div>
              ) : negativeAchievements.length > 0 ? (
                <div className="space-y-4">
                  {negativeAchievements.map(renderAchievement)}
                </div>
              ) : (
                <div className="text-center p-8 text-gray-500">
                  No setbacks yet! Keep it up!
                </div>
              )}
            </div>
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
