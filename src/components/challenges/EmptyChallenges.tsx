
import React from "react";
import { Calendar } from "lucide-react";

const EmptyChallenges: React.FC = () => {
  return (
    <div className="p-6 text-center">
      <div className="rounded-full bg-gray-100 dark:bg-gray-800 h-16 w-16 flex items-center justify-center mx-auto mb-4">
        <Calendar className="h-8 w-8 text-gray-400" />
      </div>
      <h3 className="font-medium text-lg mb-2">No Active Challenges</h3>
      <p className="text-gray-500 text-sm">
        There are no active challenges at the moment. Check back soon!
      </p>
    </div>
  );
};

export default EmptyChallenges;
