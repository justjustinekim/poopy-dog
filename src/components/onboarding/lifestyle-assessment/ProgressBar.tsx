
import React from "react";

interface ProgressBarProps {
  currentIndex: number;
  totalQuestions: number;
}

const ProgressBar: React.FC<ProgressBarProps> = ({ currentIndex, totalQuestions }) => {
  const progress = ((currentIndex + 1) / totalQuestions) * 100;

  return (
    <div className="w-full bg-gray-200 dark:bg-gray-700 h-2 rounded-full mb-6">
      <div
        className="bg-primary h-2 rounded-full transition-all duration-300"
        style={{ width: `${progress}%` }}
      ></div>
      <div className="flex justify-between mt-2">
        <span className="text-xs text-gray-500">Question {currentIndex + 1}/{totalQuestions}</span>
        <span className="text-xs text-gray-500">{Math.round(progress)}% complete</span>
      </div>
    </div>
  );
};

export default ProgressBar;
