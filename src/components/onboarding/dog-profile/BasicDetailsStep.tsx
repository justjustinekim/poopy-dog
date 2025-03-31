
import React from "react";
import { Dog as DogIcon, Camera } from "lucide-react";
import { FormField, FormItem, FormLabel, FormControl, FormMessage, FormDescription } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Card, CardContent } from "@/components/ui/card";
import { UseFormReturn } from "react-hook-form";
import { DogFormValues } from "./types";

interface ProfilePhotoProps {
  profilePhoto: string | null;
  onPhotoUpload: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const ProfilePhoto: React.FC<ProfilePhotoProps> = ({ profilePhoto, onPhotoUpload }) => {
  return (
    <div className="flex justify-center mb-6">
      <div className="relative group">
        {profilePhoto ? (
          <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-primary/40">
            <img 
              src={profilePhoto} 
              alt="Dog profile" 
              className="w-full h-full object-cover" 
            />
          </div>
        ) : (
          <div className="w-32 h-32 rounded-full bg-primary/10 flex items-center justify-center border-4 border-primary/20">
            <DogIcon className="h-16 w-16 text-primary/40" />
          </div>
        )}
        
        <label className="absolute bottom-0 right-0 bg-primary text-white p-2 rounded-full cursor-pointer hover:bg-primary/80 transition-colors">
          <input 
            type="file" 
            accept="image/*" 
            className="hidden" 
            onChange={onPhotoUpload}
          />
          <Camera className="h-4 w-4" />
        </label>
        
        <div className="absolute inset-0 bg-black/30 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
          <span className="text-white text-sm font-medium">Change Photo</span>
        </div>
      </div>
    </div>
  );
};

interface BasicDetailsStepProps {
  form: UseFormReturn<DogFormValues>;
  profilePhoto: string | null;
  onPhotoUpload: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const BasicDetailsStep: React.FC<BasicDetailsStepProps> = ({ 
  form, 
  profilePhoto,
  onPhotoUpload
}) => {
  return (
    <Card className="animate-fade-in">
      <CardContent className="pt-6">
        <h2 className="text-xl font-semibold mb-4 flex items-center">
          <DogIcon className="h-5 w-5 mr-2 text-primary" />
          Basic Details
        </h2>
        
        <ProfilePhoto 
          profilePhoto={profilePhoto} 
          onPhotoUpload={onPhotoUpload} 
        />
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Dog's Name</FormLabel>
                <FormControl>
                  <Input placeholder="Buddy" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="breed"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Breed</FormLabel>
                <FormControl>
                  <Input placeholder="Labrador Retriever" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
          <FormField
            control={form.control}
            name="age"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Age (years)</FormLabel>
                <FormControl>
                  <Input type="number" min={0} step={0.5} {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="weight"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Weight (lbs)</FormLabel>
                <FormControl>
                  <Input type="number" min={0} step={0.5} {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
          <FormField
            control={form.control}
            name="birthdate"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Birthdate (optional)</FormLabel>
                <FormControl>
                  <Input type="date" {...field} />
                </FormControl>
                <FormDescription>
                  We'll celebrate your dog's birthday!
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="microchipped"
            render={({ field }) => (
              <FormItem className="flex flex-row items-start space-x-3 space-y-0 p-4 border rounded-md mt-6">
                <FormControl>
                  <Checkbox 
                    checked={field.value}
                    onCheckedChange={field.onChange}
                  />
                </FormControl>
                <div className="space-y-1 leading-none">
                  <FormLabel>Microchipped</FormLabel>
                  <FormDescription>
                    Is your dog microchipped?
                  </FormDescription>
                </div>
              </FormItem>
            )}
          />
        </div>
      </CardContent>
    </Card>
  );
};

export default BasicDetailsStep;
