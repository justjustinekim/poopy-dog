
import React from "react";
import { Challenge } from "@/types";
import { Clock, Calendar, Award } from "lucide-react";
import ChallengeCard from "./ChallengeCard";

interface ChallengeListProps {
  title: string;
  challenges: Challenge[];
  typeLabel: string;
  onShareMeme: (challenge: Challenge) => void;
}

const ChallengeList: React.FC<ChallengeListProps> = ({ 
  title, 
  challenges, 
  typeLabel,
  onShareMeme 
}) => {
  if (challenges.length === 0) {
    return null;
  }

  const getChallengeTypeIcon = (type: string) => {
    switch (type) {
      case 'daily':
        return <Clock className="h-4 w-4 mr-1" />;
      case 'weekly':
        return <Calendar className="h-4 w-4 mr-1" />;
      case 'monthly':
        return <Award className="h-4 w-4 mr-1" />;
      default:
        return <Award className="h-4 w-4 mr-1" />;
    }
  };
  
  return (
    <div className="space-y-4 mb-6">
      <h3 className="text-lg font-semibold flex items-center">
        {getChallengeTypeIcon(typeLabel.toLowerCase())}
        {title}
      </h3>
      
      {challenges.map(challenge => (
        <ChallengeCard 
          key={challenge.id}
          challenge={challenge} 
          onShareMeme={onShareMeme}
        />
      ))}
    </div>
  );
};

export default ChallengeList;
