import React, { useState } from "react";
import Layout from "@/components/Layout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { Trophy, Star, Gift, Check, AlertCircle, Skull } from "lucide-react";
import { cn } from "@/lib/utils";
import { Achievement, BadgeType } from "@/types";
import { useToast } from "@/hooks/use-toast";
import { Badge } from "@/components/ui/badge";

const mockAchievements: Achievement[] = [
  {
    id: "1",
    title: "Poop Tracker",
    description: "Track your first poop!",
    icon: "💩",
    unlocked: true,
    dateUnlocked: "2023-05-10"
  },
  {
    id: "2",
    title: "Consistency King",
    description: "Track poop for 7 days in a row",
    icon: "👑",
    unlocked: true,
    dateUnlocked: "2023-05-17"
  },
  {
    id: "3",
    title: "Poop Analyzer",
    description: "Use the AI analysis feature 5 times",
    icon: "🔍",
    unlocked: false,
    progress: 3,
    maxProgress: 5
  },
  {
    id: "neg-1",
    title: "Streak Breaker",
    description: "Missed tracking for 3 days in a row after having a streak",
    icon: "💔",
    isNegative: true,
    unlocked: true,
    dateUnlocked: "2023-05-20",
    penaltyPoints: 50
  },
  {
    id: "neg-2",
    title: "Neglectful Owner",
    description: "Didn't respond to a health warning for over 48 hours",
    icon: "😓",
    isNegative: true,
    unlocked: false,
    penaltyPoints: 75
  },
  {
    id: "neg-3",
    title: "Tardy Tracker",
    description: "Consistently logged poop data more than 5 hours after the event",
    icon: "⏰",
    isNegative: true,
    unlocked: true,
    dateUnlocked: "2023-06-01",
    penaltyPoints: 25
  },
  {
    id: "4",
    title: "Social Butterfly",
    description: "Share 3 posts on PupSocial",
    icon: "🦋",
    unlocked: false,
    progress: 1,
    maxProgress: 3
  },
  {
    id: "5",
    title: "Doggone Detective",
    description: "Identify an abnormal poop and take action",
    icon: "🕵️",
    unlocked: false
  }
];

const mockBadges: BadgeType[] = [
  {
    id: "1",
    name: "Poop Pioneer",
    icon: "🏆",
    rarity: "common",
    description: "Early adopter of PupPoopVision"
  },
  {
    id: "2",
    name: "Super Scooper",
    icon: "🦸",
    rarity: "uncommon",
    description: "Tracked 30 poops in one month"
  },
  {
    id: "3",
    name: "Health Guardian",
    icon: "🛡️",
    rarity: "rare",
    description: "Detected and treated 3 health issues early"
  },
  {
    id: "4",
    name: "Community Legend",
    icon: "👑",
    rarity: "epic",
    description: "Helped 10 other dog parents with advice"
  },
  {
    id: "5",
    name: "Perfect Pooper",
    icon: "✨",
    rarity: "legendary",
    description: "Maintained optimal poop health for 90 days"
  }
];

const Achievements: React.FC = () => {
  const [achievements, setAchievements] = useState<Achievement[]>(mockAchievements);
  const [badges, setBadges] = useState<BadgeType[]>(mockBadges);
  const [showConfetti, setShowConfetti] = useState(false);
  const [showNegative, setShowNegative] = useState(true);
  const { toast } = useToast();
  
  const handleUnlockAchievement = (id: string) => {
    setAchievements(prev => 
      prev.map(a => 
        a.id === id 
          ? { ...a, unlocked: true, dateUnlocked: new Date().toISOString() } 
          : a
      )
    );
    
    setShowConfetti(true);
    setTimeout(() => setShowConfetti(false), 3000);
    
    toast({
      title: "Achievement Unlocked! 🎉",
      description: "You've earned a new achievement!",
      className: "bg-yellow-500 text-white font-bold",
    });
  };
  
  const userLevel = 5;
  const userExp = 340;
  const nextLevelExp = 500;
  const expPercentage = (userExp / nextLevelExp) * 100;
  
  const getRarityColor = (rarity: string) => {
    switch(rarity) {
      case 'common': return 'bg-gray-200 text-gray-800';
      case 'uncommon': return 'bg-green-200 text-green-800';
      case 'rare': return 'bg-blue-200 text-blue-800';
      case 'epic': return 'bg-purple-200 text-purple-800';
      case 'legendary': return 'bg-yellow-200 text-yellow-800';
      default: return 'bg-gray-200 text-gray-800';
    }
  };
  
  const totalPenaltyPoints = achievements
    .filter(a => a.isNegative && a.unlocked)
    .reduce((total, achievement) => total + (achievement.penaltyPoints || 0), 0);
  
  const renderConfetti = () => {
    if (!showConfetti) return null;
    
    return (
      <div className="fixed inset-0 pointer-events-none z-50">
        {Array.from({ length: 50 }).map((_, i) => {
          const size = Math.random() * 10 + 5;
          const left = Math.random() * 100;
          const animationDuration = Math.random() * 3 + 2;
          const animationDelay = Math.random() * 0.5;
          const confettiColor = ['#FCD34D', '#F87171', '#60A5FA', '#34D399', '#A78BFA'][Math.floor(Math.random() * 5)];
          
          return (
            <div
              key={i}
              className="absolute top-0"
              style={{
                left: `${left}%`,
                width: `${size}px`,
                height: `${size}px`,
                backgroundColor: confettiColor,
                borderRadius: size > 10 ? '50%' : '2px',
                animation: `confetti-${['slow', 'medium', 'fast'][Math.floor(Math.random() * 3)]} ${animationDuration}s forwards linear`,
                animationDelay: `${animationDelay}s`,
              }}
            />
          );
        })}
      </div>
    );
  };
  
  const filteredAchievements = achievements.filter(achievement => 
    showNegative ? true : !achievement.isNegative
  );
  
  return (
    <Layout className="pb-20">
      {renderConfetti()}
      
      <div className="max-w-2xl mx-auto">
        <Card className="mb-6 overflow-hidden">
          <div className="bg-gradient-to-r from-primary to-secondary h-24 relative">
            <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 translate-y-1/2">
              <div className="achievement-badge h-20 w-20 bg-white rounded-full flex items-center justify-center border-4 border-white shadow-lg">
                <Trophy className="h-10 w-10 text-yellow-500 z-10" />
              </div>
            </div>
          </div>
          
          <CardContent className="pt-14 pb-6 text-center">
            <h2 className="text-2xl font-bold mb-1">Level {userLevel} Doggo Expert</h2>
            <p className="text-gray-500 mb-4">Keep tracking to earn rewards!</p>
            
            <div className="max-w-xs mx-auto">
              <div className="flex justify-between text-sm mb-1">
                <span>EXP: {userExp}/{nextLevelExp}</span>
                <span>{Math.round(expPercentage)}%</span>
              </div>
              <Progress value={expPercentage} className="h-3 mb-4" />
            </div>
            
            {totalPenaltyPoints > 0 && (
              <div className="mt-3 mb-4">
                <Badge variant="destructive" className="text-xs px-2 py-1">
                  <Skull className="h-3 w-3 mr-1" /> 
                  -{totalPenaltyPoints} penalty points
                </Badge>
                <p className="text-xs text-gray-500 mt-1">
                  You've lost points from negative achievements!
                </p>
              </div>
            )}
            
            <div className="flex justify-center gap-3 mt-4">
              <div className="text-center">
                <div className="text-2xl font-bold">{achievements.filter(a => a.unlocked && !a.isNegative).length}</div>
                <div className="text-xs text-gray-500">Achievements</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold">12</div>
                <div className="text-xs text-gray-500">Day Streak</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold">{badges.length}</div>
                <div className="text-xs text-gray-500">Badges</div>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Tabs defaultValue="achievements" className="mb-10">
          <TabsList className="grid w-full grid-cols-3 mb-6">
            <TabsTrigger value="achievements" className="gap-2">
              <Trophy className="h-4 w-4" />
              <span>Achievements</span>
            </TabsTrigger>
            <TabsTrigger value="negatives" className="gap-2">
              <AlertCircle className="h-4 w-4" />
              <span>Setbacks</span>
            </TabsTrigger>
            <TabsTrigger value="badges" className="gap-2">
              <Star className="h-4 w-4" />
              <span>Badges</span>
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="achievements" className="space-y-4">
            {filteredAchievements
              .filter(achievement => !achievement.isNegative)
              .map((achievement) => (
                <Card 
                  key={achievement.id} 
                  className={cn(
                    "transition-all hover:shadow-md",
                    achievement.unlocked ? "border-green-200" : "border-gray-200",
                    !achievement.unlocked && "opacity-75"
                  )}
                >
                  <CardHeader className="p-4 flex flex-row items-center space-y-0 gap-4">
                    <div 
                      className={cn(
                        "h-12 w-12 flex items-center justify-center rounded-full text-xl",
                        achievement.unlocked 
                          ? "bg-green-100 text-green-600" 
                          : "bg-gray-100 text-gray-500"
                      )}
                    >
                      {achievement.icon}
                    </div>
                    <div className="flex-1">
                      <CardTitle className="text-base flex items-center">
                        {achievement.title}
                        {achievement.unlocked && (
                          <Check className="h-4 w-4 ml-2 text-green-500" />
                        )}
                      </CardTitle>
                      <CardDescription>{achievement.description}</CardDescription>
                      
                      {achievement.progress !== undefined && achievement.maxProgress && !achievement.unlocked && (
                        <div className="mt-2">
                          <div className="flex justify-between text-xs mb-1">
                            <span>Progress</span>
                            <span>{achievement.progress}/{achievement.maxProgress}</span>
                          </div>
                          <Progress 
                            value={(achievement.progress / achievement.maxProgress) * 100} 
                            className="h-2" 
                          />
                        </div>
                      )}
                      
                      {achievement.unlocked && achievement.dateUnlocked && (
                        <div className="text-xs text-green-600 mt-1">
                          Unlocked on {new Date(achievement.dateUnlocked).toLocaleDateString()}
                        </div>
                      )}
                    </div>
                    
                    {!achievement.unlocked && achievement.id === "3" && (
                      <button 
                        className="text-xs bg-primary text-white px-2 py-1 rounded hover:bg-primary/90"
                        onClick={() => handleUnlockAchievement(achievement.id)}
                      >
                        Unlock
                      </button>
                    )}
                  </CardHeader>
                </Card>
            ))}
          </TabsContent>
          
          <TabsContent value="negatives" className="space-y-4">
            {achievements
              .filter(achievement => achievement.isNegative)
              .map((achievement) => (
                <Card 
                  key={achievement.id} 
                  className={cn(
                    "transition-all hover:shadow-md",
                    achievement.unlocked ? "border-red-200" : "border-gray-200",
                    !achievement.unlocked && "opacity-75"
                  )}
                >
                  <CardHeader className="p-4 flex flex-row items-center space-y-0 gap-4">
                    <div 
                      className={cn(
                        "h-12 w-12 flex items-center justify-center rounded-full text-xl",
                        achievement.unlocked 
                          ? "bg-red-100 text-red-600" 
                          : "bg-gray-100 text-gray-500"
                      )}
                    >
                      {achievement.icon}
                    </div>
                    <div className="flex-1">
                      <CardTitle className="text-base flex items-center">
                        {achievement.title}
                        {achievement.unlocked && (
                          <AlertCircle className="h-4 w-4 ml-2 text-red-500" />
                        )}
                      </CardTitle>
                      <CardDescription>{achievement.description}</CardDescription>
                      
                      {achievement.unlocked && achievement.dateUnlocked && (
                        <div className="text-xs text-red-600 mt-1">
                          Occurred on {new Date(achievement.dateUnlocked).toLocaleDateString()}
                        </div>
                      )}
                      
                      {achievement.unlocked && achievement.penaltyPoints && (
                        <div className="text-xs text-red-600 mt-1 font-medium">
                          Penalty: -{achievement.penaltyPoints} points
                        </div>
                      )}
                    </div>
                    
                    {!achievement.unlocked && achievement.id === "neg-2" && (
                      <button 
                        className="text-xs bg-destructive text-white px-2 py-1 rounded hover:bg-destructive/90"
                        onClick={() => handleUnlockAchievement(achievement.id)}
                      >
                        Simulate
                      </button>
                    )}
                  </CardHeader>
                </Card>
            ))}
            
            <div className="mt-4 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
              <p className="text-sm text-center text-gray-600 dark:text-gray-300">
                Setbacks are negative achievements that occur when you miss tracking or don't respond to issues.
                They can penalize your score but can be remedied by consistent tracking habits!
              </p>
            </div>
          </TabsContent>
          
          <TabsContent value="badges" className="grid grid-cols-2 gap-4">
            {badges.map((badge) => (
              <Card 
                key={badge.id} 
                className={cn(
                  "transition-all hover:shadow-md overflow-hidden"
                )}
              >
                <div className={cn(
                  "h-3",
                  getRarityColor(badge.rarity)
                )} />
                <CardContent className="p-4 text-center">
                  <div className="text-3xl mb-2">{badge.icon}</div>
                  <CardTitle className="text-base mb-1">{badge.name}</CardTitle>
                  <div className={cn(
                    "text-xs inline-block px-2 py-0.5 rounded-full mb-2",
                    getRarityColor(badge.rarity)
                  )}>
                    {badge.rarity.charAt(0).toUpperCase() + badge.rarity.slice(1)}
                  </div>
                  <CardDescription className="text-xs">
                    {badge.description}
                  </CardDescription>
                </CardContent>
              </Card>
            ))}
            
            <Card className="border-dashed border-2 flex flex-col items-center justify-center p-4 h-[156px]">
              <Gift className="h-8 w-8 text-gray-400 mb-2" />
              <p className="text-sm text-gray-500 text-center">
                Track more poops to earn new badges!
              </p>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </Layout>
  );
};

export default Achievements;
