
import React, { useState } from "react";
import { toast } from "sonner";
import { Trophy } from "lucide-react";
import { getQuestions } from "./questions";
import ProgressBar from "./ProgressBar";
import QuestionCard from "./QuestionCard";
import { LifestyleAssessmentProps } from "./types";

const LifestyleAssessment: React.FC<LifestyleAssessmentProps> = ({
  dogName,
  onComplete,
  onSkip,
}) => {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, any>>({});
  const [selectedOptions, setSelectedOptions] = useState<string[]>([]);
  const dogNameDisplay = dogName || "your dog";

  const emojis = ["🐕", "🦴", "🥩", "🥬", "🛏️", "🏞️", "🎾", "⛹️‍♂️", "🚶‍♀️", "🏃‍♀️"];
  const questions = getQuestions(dogNameDisplay, emojis);

  const handleNext = () => {
    const currentQuestion = questions[currentQuestionIndex];
    if (!answers[currentQuestion.id] && currentQuestion.type !== "multiCheckbox" && currentQuestion.type !== "textarea") {
      toast.error("Please answer the question before proceeding");
      return;
    }

    if (currentQuestion.type === "multiCheckbox" && selectedOptions.length === 0) {
      toast.error("Please select at least one option");
      return;
    }

    if (currentQuestionIndex === questions.length - 1) {
      const achievementUnlocked = Math.random() > 0.5;
      
      if (achievementUnlocked) {
        toast.success("Achievement Unlocked: Lifestyle Guru! 🏆", {
          description: "You've shared detailed information about your dog's lifestyle!"
        });
      }
      
      onComplete(answers);
    } else {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    }
  };

  const handlePrevious = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
    }
  };

  const handleRadioChange = (value: string) => {
    setAnswers({
      ...answers,
      [questions[currentQuestionIndex].id]: value,
    });
  };

  const handleSliderChange = (value: number[]) => {
    setAnswers({
      ...answers,
      [questions[currentQuestionIndex].id]: value[0],
    });
  };

  const handleTextareaChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setAnswers({
      ...answers,
      [questions[currentQuestionIndex].id]: e.target.value,
    });
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setAnswers({
      ...answers,
      [questions[currentQuestionIndex].id]: e.target.value,
    });
  };

  const handleCheckboxChange = (option: string) => {
    const updatedOptions = selectedOptions.includes(option)
      ? selectedOptions.filter(item => item !== option)
      : [...selectedOptions, option];
    
    setSelectedOptions(updatedOptions);
    
    setAnswers({
      ...answers,
      [questions[currentQuestionIndex].id]: updatedOptions,
    });
  };

  const handleCustomValueChange = (questionId: string, value: string) => {
    setAnswers({
      ...answers,
      [questionId]: value,
    });
  };

  const currentQuestion = questions[currentQuestionIndex];

  return (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <Trophy className="h-10 w-10 text-amber-500 mx-auto mb-2" />
        <h1 className="text-2xl font-bold">Lifestyle Quiz</h1>
        <p className="text-gray-600 dark:text-gray-300">
          Let's learn more about {dogNameDisplay}'s day-to-day life to provide better health insights
        </p>
      </div>

      <ProgressBar 
        currentIndex={currentQuestionIndex} 
        totalQuestions={questions.length} 
      />

      <QuestionCard
        question={currentQuestion}
        answers={answers}
        selectedOptions={selectedOptions}
        onRadioChange={handleRadioChange}
        onSliderChange={handleSliderChange}
        onTextareaChange={handleTextareaChange}
        onInputChange={handleInputChange}
        onCheckboxChange={handleCheckboxChange}
        onCustomValueChange={handleCustomValueChange}
        onNext={handleNext}
        onPrevious={handlePrevious}
        onSkip={onSkip}
        isFirstQuestion={currentQuestionIndex === 0}
        isLastQuestion={currentQuestionIndex === questions.length - 1}
      />
    </div>
  );
};

export default LifestyleAssessment;
