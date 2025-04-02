
import React from "react";
import { Card } from "@/components/ui/card";
import ProgressBar from "./ProgressBar";
import QuestionCard from "./QuestionCard";
import { Question } from "./types";

interface AssessmentContainerProps {
  dogNameDisplay: string;
  currentQuestion: Question;
  answers: Record<string, any>;
  selectedOptions: string[];
  progress: number;
  isFirstQuestion: boolean;
  isLastQuestion: boolean;
  onRadioChange: (value: string) => void;
  onSliderChange: (value: number[]) => void;
  onTextareaChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  onInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onCheckboxChange: (option: string) => void;
  onCustomValueChange: (questionId: string, value: string) => void;
  onNext: () => void;
  onPrevious: () => void;
  onSkip: () => void;
}

const AssessmentContainer: React.FC<AssessmentContainerProps> = ({
  dogNameDisplay,
  currentQuestion,
  answers,
  selectedOptions,
  progress,
  isFirstQuestion,
  isLastQuestion,
  onRadioChange,
  onSliderChange,
  onTextareaChange,
  onInputChange,
  onCheckboxChange,
  onCustomValueChange,
  onNext,
  onPrevious,
  onSkip
}) => {
  return (
    <div className="space-y-6 animate-fade-in">
      <h1 className="text-2xl font-bold text-center">
        {dogNameDisplay}'s Lifestyle Assessment
      </h1>
      
      <p className="text-center text-gray-600 dark:text-gray-300">
        Help us understand {dogNameDisplay}'s lifestyle to provide better gut health insights
      </p>
      
      <ProgressBar progress={progress} />
      
      <Card className="bg-card">
        <QuestionCard
          question={currentQuestion}
          answers={answers}
          selectedOptions={selectedOptions}
          onRadioChange={onRadioChange}
          onSliderChange={onSliderChange}
          onTextareaChange={onTextareaChange}
          onInputChange={onInputChange}
          onCheckboxChange={onCheckboxChange}
          onCustomValueChange={onCustomValueChange}
          onNext={onNext}
          onPrevious={onPrevious}
          onSkip={onSkip}
          isFirstQuestion={isFirstQuestion}
          isLastQuestion={isLastQuestion}
        />
      </Card>
    </div>
  );
};

export default AssessmentContainer;
