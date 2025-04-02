
import React, { useState } from "react";
import { Challenge } from "@/types";
import ChallengeList from "./ChallengeList";
import EmptyChallenges from "./EmptyChallenges";

interface ChallengesProps {
  challenges: Challenge[];
  loading: boolean;
}

const Challenges: React.FC<ChallengesProps> = ({ challenges, loading }) => {
  const [selectedChallenge, setSelectedChallenge] = useState<Challenge | null>(null);
  
  // Group challenges by type
  const dailyChallenges = challenges.filter(c => c.challengeType === 'daily');
  const weeklyChallenges = challenges.filter(c => c.challengeType === 'weekly');
  const monthlyChallenges = challenges.filter(c => c.challengeType === 'monthly');
  
  const handleShareMeme = (challenge: Challenge) => {
    setSelectedChallenge(challenge);
  };
  
  if (loading) {
    return <div className="p-4 text-center">Loading challenges...</div>;
  }
  
  if (challenges.length === 0) {
    return <EmptyChallenges />;
  }
  
  return (
    <div className="space-y-4">
      <ChallengeList 
        title="Daily Challenges" 
        challenges={dailyChallenges} 
        typeLabel="daily"
        onShareMeme={handleShareMeme}
      />
      <ChallengeList 
        title="Weekly Challenges" 
        challenges={weeklyChallenges} 
        typeLabel="weekly"
        onShareMeme={handleShareMeme}
      />
      <ChallengeList 
        title="Monthly Challenges" 
        challenges={monthlyChallenges} 
        typeLabel="monthly"
        onShareMeme={handleShareMeme}
      />
    </div>
  );
};

export default Challenges;
