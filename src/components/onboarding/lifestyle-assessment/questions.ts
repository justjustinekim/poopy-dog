
import { Question } from './types';

export const getQuestions = (dogNameDisplay: string, emojis: string[]): Question[] => [
  {
    id: "walkFrequency",
    question: `${emojis[0]} How often do you walk ${dogNameDisplay}?`,
    type: "radio",
    options: [
      { value: "multipleDaily", label: "Multiple times a day", emoji: "🏃‍♀️" },
      { value: "daily", label: "Once a day", emoji: "🚶‍♀️" },
      { value: "fewTimesWeek", label: "A few times a week", emoji: "🌅" },
      { value: "weekly", label: "Once a week", emoji: "📅" },
      { value: "rarely", label: "Rarely", emoji: "🙈" },
    ],
    hint: "Regular exercise helps maintain healthy digestion",
  },
  {
    id: "exerciseTime",
    question: `${emojis[1]} On average, how much exercise does ${dogNameDisplay} get each day?`,
    type: "slider",
    min: 0,
    max: 180,
    step: 15,
    defaultValue: 30,
    valueLabel: (val: number) => `${val} minutes`,
    hint: "Exercise helps with digestion and overall health",
  },
  {
    id: "foodType",
    question: `${emojis[2]} What type of food does ${dogNameDisplay} eat? (Select all that apply)`,
    type: "multiCheckbox",
    options: [
      { value: "dryKibble", label: "Dry kibble", emoji: "🥫" },
      { value: "wetFood", label: "Wet food", emoji: "🍲" },
      { value: "rawDiet", label: "Raw diet", emoji: "🥩" },
      { value: "homemade", label: "Homemade food", emoji: "👨‍🍳" },
      { value: "treats", label: "Lots of treats", emoji: "🦴" },
      { value: "tableScraps", label: "Table scraps", emoji: "🍗" },
    ],
    hint: "Diet directly impacts stool quality and digestive health",
  },
  {
    id: "supplements",
    question: `${emojis[3]} Do you give ${dogNameDisplay} any supplements?`,
    type: "multiCheckbox",
    options: [
      { value: "probiotics", label: "Probiotics", emoji: "🦠" },
      { value: "omega", label: "Omega fatty acids", emoji: "🐟" },
      { value: "jointSupport", label: "Joint supplements", emoji: "🦵" },
      { value: "vitaminsMinerals", label: "Vitamins/minerals", emoji: "💊" },
      { value: "fiber", label: "Fiber supplements", emoji: "🌾" },
      { value: "none", label: "No supplements", emoji: "❌" },
    ],
    hint: "Some supplements can help improve gut health",
  },
  {
    id: "sleepLocation",
    question: `${emojis[4]} Where does ${dogNameDisplay} usually sleep?`,
    type: "radio",
    options: [
      { value: "ownBed", label: "Dog bed", emoji: "🛏️" },
      { value: "yourBed", label: "Your bed", emoji: "👤" },
      { value: "crate", label: "Crate", emoji: "📦" },
      { value: "couch", label: "Couch", emoji: "🛋️" },
      { value: "floor", label: "Floor", emoji: "⬇️" },
      { value: "outside", label: "Outside", emoji: "🏡" },
    ],
    hint: "Sleep quality can affect overall health including digestion",
  },
  {
    id: "environment",
    question: `${emojis[5]} What type of environment does ${dogNameDisplay} spend most time in?`,
    type: "radio",
    options: [
      { value: "apartment", label: "Apartment", emoji: "🏢" },
      { value: "houseSmallYard", label: "House with small yard", emoji: "🏡" },
      { value: "houseLargeYard", label: "House with large yard", emoji: "🏞️" },
      { value: "farm", label: "Farm/large property", emoji: "🌾" },
      { value: "urban", label: "Urban environment", emoji: "🏙️" },
    ],
    hint: "Environment can impact activity levels and exposure to various bacteria",
  },
  {
    id: "stress",
    question: `${emojis[6]} How would you rate ${dogNameDisplay}'s stress/anxiety levels?`,
    type: "slider",
    min: 1,
    max: 10,
    step: 1,
    defaultValue: 3,
    valueLabel: (val: number) => {
      if (val <= 3) return "Very calm";
      if (val <= 6) return "Somewhat anxious";
      return "Very anxious";
    },
    hint: "Stress can significantly impact digestive health",
  },
  {
    id: "waterConsumption",
    question: `${emojis[7]} How would you describe ${dogNameDisplay}'s water drinking habits?`,
    type: "radio",
    options: [
      { value: "veryLittle", label: "Drinks very little", emoji: "💧" },
      { value: "adequate", label: "Drinks adequate amount", emoji: "🚰" },
      { value: "excessive", label: "Drinks excessively", emoji: "🌊" },
      { value: "inconsistent", label: "Inconsistent", emoji: "🔄" },
    ],
    hint: "Hydration is crucial for gut health and stool consistency",
  },
  {
    id: "grooming",
    question: `${emojis[8]} How often do you groom ${dogNameDisplay}?`,
    type: "radio",
    options: [
      { value: "daily", label: "Daily", emoji: "📆" },
      { value: "weekly", label: "Weekly", emoji: "🗓️" },
      { value: "monthly", label: "Monthly", emoji: "📅" },
      { value: "rarely", label: "Rarely", emoji: "❌" },
      { value: "professional", label: "Professional groomer only", emoji: "💇‍♀️" },
    ],
    hint: "Regular grooming helps prevent ingestion of fur which can cause digestive issues",
  },
  {
    id: "additionalInfo",
    question: `${emojis[9]} Anything else you'd like to share about ${dogNameDisplay}'s lifestyle?`,
    type: "textarea",
    hint: "Any additional details that might be relevant to digestive health",
  },
];
