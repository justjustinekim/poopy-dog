
import React from "react";

interface ProgressBarProps {
  currentIndex?: number;
  totalQuestions?: number;
  progress?: number;
}

const ProgressBar: React.FC<ProgressBarProps> = ({ currentIndex, totalQuestions, progress: directProgress }) => {
  // Calculate progress either from direct value or from currentIndex/totalQuestions
  const progress = directProgress !== undefined 
    ? directProgress 
    : (currentIndex !== undefined && totalQuestions !== undefined)
      ? ((currentIndex + 1) / totalQuestions) * 100
      : 0;

  return (
    <div className="w-full bg-gray-200 dark:bg-gray-700 h-2 rounded-full mb-6">
      <div
        className="bg-primary h-2 rounded-full transition-all duration-300"
        style={{ width: `${progress}%` }}
      ></div>
      <div className="flex justify-between mt-2">
        {currentIndex !== undefined && totalQuestions !== undefined ? (
          <span className="text-xs text-gray-500">Question {currentIndex + 1}/{totalQuestions}</span>
        ) : (
          <span className="text-xs text-gray-500">Progress</span>
        )}
        <span className="text-xs text-gray-500">{Math.round(progress)}% complete</span>
      </div>
    </div>
  );
};

export default ProgressBar;
