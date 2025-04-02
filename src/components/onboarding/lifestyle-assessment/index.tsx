
import React from "react";
import { useLifestyleAssessment } from "./useLifestyleAssessment";
import AssessmentContainer from "./AssessmentContainer";
import { LifestyleAssessmentProps } from "./types";

const LifestyleAssessment: React.FC<LifestyleAssessmentProps> = ({ 
  dogName, 
  onComplete, 
  onSkip 
}) => {
  // Use the custom hook to handle assessment logic
  const assessment = useLifestyleAssessment(dogName, onComplete, onSkip);
  
  // If there are no questions to ask (already have the data), skip
  if (assessment.shouldSkip) {
    return null;
  }
  
  return (
    <AssessmentContainer
      dogNameDisplay={assessment.dogNameDisplay}
      currentQuestion={assessment.currentQuestion}
      answers={assessment.answers}
      selectedOptions={assessment.selectedOptions[assessment.currentQuestion.id] || []}
      progress={assessment.progress}
      isFirstQuestion={assessment.isFirstQuestion}
      isLastQuestion={assessment.isLastQuestion}
      onRadioChange={assessment.handleRadioChange}
      onSliderChange={assessment.handleSliderChange}
      onTextareaChange={assessment.handleTextareaChange}
      onInputChange={assessment.handleInputChange}
      onCheckboxChange={assessment.handleCheckboxChange}
      onCustomValueChange={assessment.handleCustomValueChange}
      onNext={assessment.handleNext}
      onPrevious={assessment.handlePrevious}
      onSkip={assessment.onSkip}
    />
  );
};

export default LifestyleAssessment;
