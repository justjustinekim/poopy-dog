
import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowRight, Check } from "lucide-react";
import { Question } from "./types";
import QuestionRenderer from "./QuestionRenderer";

interface QuestionCardProps {
  question: Question;
  answers: Record<string, any>;
  selectedOptions: string[];
  onRadioChange: (value: string) => void;
  onSliderChange: (value: number[]) => void;
  onTextareaChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  onInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onCheckboxChange: (option: string) => void;
  onCustomValueChange: (questionId: string, value: string) => void;
  onNext: () => void;
  onPrevious: () => void;
  onSkip: () => void;
  isFirstQuestion: boolean;
  isLastQuestion: boolean;
}

const QuestionCard: React.FC<QuestionCardProps> = ({
  question,
  answers,
  selectedOptions,
  onRadioChange,
  onSliderChange,
  onTextareaChange,
  onInputChange,
  onCheckboxChange,
  onCustomValueChange,
  onNext,
  onPrevious,
  onSkip,
  isFirstQuestion,
  isLastQuestion
}) => {
  return (
    <Card className="animate-fade-in">
      <CardContent className="pt-6">
        <h2 className="text-xl font-semibold mb-2">{question.question}</h2>
        {question.hint && (
          <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">{question.hint}</p>
        )}

        <QuestionRenderer
          question={question}
          answers={answers}
          selectedOptions={selectedOptions}
          onRadioChange={onRadioChange}
          onSliderChange={onSliderChange}
          onTextareaChange={onTextareaChange}
          onInputChange={onInputChange}
          onCheckboxChange={onCheckboxChange}
          onCustomValueChange={onCustomValueChange}
        />

        <div className="flex justify-between mt-8">
          <Button
            variant="outline"
            onClick={onPrevious}
            disabled={isFirstQuestion}
          >
            Back
          </Button>
          
          <div className="space-x-2">
            <Button 
              variant="ghost" 
              onClick={onSkip}
              size="sm"
            >
              Skip Assessment
            </Button>
            <Button onClick={onNext}>
              {isLastQuestion ? (
                <>
                  Complete <Check className="ml-2 h-4 w-4" />
                </>
              ) : (
                <>
                  Next <ArrowRight className="ml-2 h-4 w-4" />
                </>
              )}
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default QuestionCard;
