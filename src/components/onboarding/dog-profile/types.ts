
import { z } from "zod";
import { Dog } from "@/types";

// Define the form schema
export const dogSchema = z.object({
  name: z.string().min(1, { message: "Dog name is required" }),
  breed: z.string().min(1, { message: "Breed is required" }),
  age: z.coerce.number().min(0, { message: "Age must be a positive number" }),
  weight: z.coerce.number().min(0, { message: "Weight must be a positive number" }),
  imageUrl: z.string().optional(),
  foodSensitivity: z.string().optional(),
  digestiveIssues: z.array(z.string()).optional(),
  poopFrequency: z.string().optional(),
  digestiveHealth: z.string().optional(),
  dietType: z.string().optional(),
  personalityTraits: z.array(z.string()).optional(),
  favoriteTreats: z.string().optional(),
  birthdate: z.string().optional(),
  microchipped: z.boolean().optional(),
  adoptionStory: z.string().optional(),
});

export type DogFormValues = z.infer<typeof dogSchema>;

export interface DogOnboardingFormProps {
  initialValues?: Partial<Dog>;
  onSubmit: (dog: Dog) => void;
  onCancel: () => void;
}
