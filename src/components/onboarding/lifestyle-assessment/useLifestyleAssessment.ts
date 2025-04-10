
import { useState, useEffect } from "react";
import { shuffle } from "lodash";
import { toast } from "sonner";
import { Question } from "./types";
import { getQuestions } from "./questions";

export const useLifestyleAssessment = (
  dogName: string,
  onComplete: (data: any) => void,
  onSkip: () => void
) => {
  // Get dog data from local storage if available
  const getDogData = () => {
    try {
      const dogs = JSON.parse(localStorage.getItem("dogs") || "[]");
      return dogs.find((dog: any) => dog.name === dogName) || null;
    } catch (e) {
      console.error("Error getting dog data:", e);
      return null;
    }
  };
  
  const dogData = getDogData();
  const dogNameDisplay = dogName === "your dog" ? "your dog" : dogName;
  
  // Create emoji array for questions
  const emojis = shuffle(["🐕", "🦮", "🐩", "🦴", "🐾", "🏠", "🏞️", "🧠", "🧩", "🥎", "🦮", "🛏️", "🍖", "🥩", "💉"]);
  
  // Filter questions to avoid redundancy
  const filterQuestions = (questions: Question[]): Question[] => {
    if (!dogData) return questions;
    
    return questions.filter(question => {
      // Skip food type question if we already have diet info from onboarding
      if (question.id === "foodType" && dogData.dietType) {
        return false;
      }
      
      // Skip supplements question if we already collected it in onboarding
      if (question.id === "supplements" && dogData.supplements) {
        return false;
      }
      
      return true;
    });
  };
  
  const allQuestions = getQuestions(dogNameDisplay, emojis);
  const [questions, setQuestions] = useState<Question[]>(filterQuestions(allQuestions));
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, any>>({});
  const [selectedOptions, setSelectedOptions] = useState<Record<string, string[]>>({});
  
  // Pre-fill answers from dog data if available
  useEffect(() => {
    if (dogData) {
      const prefilled: Record<string, any> = {};
      const prefilledOptions: Record<string, string[]> = {};
      
      // If we have diet information, pre-fill related questions
      if (dogData.dietType) {
        prefilled["foodType"] = dogData.dietType;
        
        // If this is a custom diet that wasn't in our list
        if (dogData.favoriteTreats?.includes("[Custom diet:")) {
          const customDietMatch = dogData.favoriteTreats.match(/\[Custom diet: (.*?)\]/);
          if (customDietMatch) {
            prefilled["foodType-custom"] = customDietMatch[1];
          }
        }
      }
      
      // If we have digestive issues data, pre-fill that too
      if (dogData.digestiveIssues?.length) {
        prefilled["digestiveIssues"] = dogData.digestiveIssues;
        prefilledOptions["digestiveIssues"] = dogData.digestiveIssues;
      }
      
      setAnswers(prefilled);
      setSelectedOptions(prefilledOptions);
    }
  }, [dogData]);
  
  const currentQuestion = questions[currentQuestionIndex];
  const progress = ((currentQuestionIndex) / questions.length) * 100;
  
  const handleNext = () => {
    // Check if required question is answered, except for last question
    if (!answers[currentQuestion.id] && 
        currentQuestion.type !== "multiCheckbox" && 
        currentQuestionIndex !== questions.length - 1) {
      toast.warning("Please answer the question before proceeding");
      return;
    }
    
    // Handle multi-select without any selection, except for last question
    if (currentQuestion.type === "multiCheckbox" && 
        (!selectedOptions[currentQuestion.id] || selectedOptions[currentQuestion.id].length === 0) &&
        currentQuestionIndex !== questions.length - 1) {
      toast.warning("Please select at least one option");
      return;
    }
    
    // Move to next question or complete the assessment
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    } else {
      // Complete assessment
      handleComplete();
    }
  };
  
  const handlePrevious = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
    }
  };
  
  const handleComplete = () => {
    // Combine dog data with lifestyle assessment
    const lifestyleData = {
      ...answers,
      completedAt: new Date().toISOString()
    };
    
    toast.success("Lifestyle assessment completed!", {
      description: "Thanks for providing this valuable information!"
    });
    
    // Pass the data back to the parent component
    onComplete(lifestyleData);
  };
  
  const handleRadioChange = (value: string) => {
    setAnswers({
      ...answers,
      [currentQuestion.id]: value
    });
  };
  
  const handleSliderChange = (value: number[]) => {
    setAnswers({
      ...answers,
      [currentQuestion.id]: value[0]
    });
  };
  
  const handleTextareaChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setAnswers({
      ...answers,
      [currentQuestion.id]: e.target.value
    });
  };
  
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setAnswers({
      ...answers,
      [currentQuestion.id]: e.target.value
    });
  };
  
  const handleCheckboxChange = (option: string) => {
    const currentOptions = selectedOptions[currentQuestion.id] || [];
    let newOptions;
    
    if (currentOptions.includes(option)) {
      // Remove the option
      newOptions = currentOptions.filter(item => item !== option);
    } else {
      // Add the option
      newOptions = [...currentOptions, option];
    }
    
    // Update selected options
    setSelectedOptions({
      ...selectedOptions,
      [currentQuestion.id]: newOptions
    });
    
    // Update answers with the selected options
    setAnswers({
      ...answers,
      [currentQuestion.id]: newOptions
    });
  };
  
  const handleCustomValueChange = (questionId: string, value: string) => {
    setAnswers({
      ...answers,
      [questionId]: value
    });
  };

  // Skip if no questions or all questions were filtered out
  if (questions.length === 0) {
    onSkip();
    return { shouldSkip: true };
  }

  return {
    dogNameDisplay,
    questions,
    currentQuestionIndex,
    currentQuestion,
    answers,
    selectedOptions,
    progress,
    handleNext,
    handlePrevious,
    handleRadioChange,
    handleSliderChange,
    handleTextareaChange,
    handleInputChange,
    handleCheckboxChange,
    handleCustomValueChange,
    onSkip,
    isFirstQuestion: currentQuestionIndex === 0,
    isLastQuestion: currentQuestionIndex === questions.length - 1,
    shouldSkip: false
  };
};
