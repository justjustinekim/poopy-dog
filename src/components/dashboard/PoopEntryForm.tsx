
import React, { useState } from "react";
import { format } from "date-fns";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { MapPin } from "lucide-react";
import { PoopConsistency, PoopColor } from "@/types";

interface PoopEntryFormProps {
  date: string;
  consistency: PoopConsistency;
  color: PoopColor;
  location: string | null;
  notes: string | null;
  isUploading: boolean;
  customConsistency?: string;
  customColor?: string;
  onDateChange: (date: string) => void;
  onConsistencyChange: (value: string) => void;
  onColorChange: (value: string) => void;
  onInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onCustomInputChange?: (field: string, value: string) => void;
}

const PoopEntryForm: React.FC<PoopEntryFormProps> = ({
  date,
  consistency,
  color,
  location,
  notes,
  onDateChange,
  onConsistencyChange,
  onColorChange,
  onInputChange,
  customConsistency,
  customColor,
  onCustomInputChange,
}) => {
  const [showCustomConsistency, setShowCustomConsistency] = useState(consistency === "other");
  const [showCustomColor, setShowCustomColor] = useState(color === "other");

  const handleConsistencyChange = (value: string) => {
    if (value === "other") {
      setShowCustomConsistency(true);
    } else {
      setShowCustomConsistency(false);
    }
    onConsistencyChange(value);
  };

  const handleColorChange = (value: string) => {
    if (value === "other") {
      setShowCustomColor(true);
    } else {
      setShowCustomColor(false);
    }
    onColorChange(value);
  };

  return (
    <div className="space-y-4">
      <div>
        <Label htmlFor="date">Date and Time</Label>
        <Input
          id="date"
          type="datetime-local"
          value={format(new Date(date || new Date()), "yyyy-MM-dd'T'HH:mm")}
          onChange={(e) => {
            onDateChange(new Date(e.target.value).toISOString());
          }}
          className="mt-1"
        />
      </div>
      
      <div>
        <Label htmlFor="consistency">Consistency</Label>
        <Select 
          value={consistency} 
          onValueChange={handleConsistencyChange}
        >
          <SelectTrigger className="mt-1">
            <SelectValue placeholder="Select consistency" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="normal">Normal</SelectItem>
            <SelectItem value="soft">Soft</SelectItem>
            <SelectItem value="liquid">Liquid</SelectItem>
            <SelectItem value="solid">Solid</SelectItem>
            <SelectItem value="other">Other</SelectItem>
          </SelectContent>
        </Select>
        {showCustomConsistency && (
          <Input
            className="mt-2"
            placeholder="Specify consistency"
            value={customConsistency || ""}
            onChange={(e) => onCustomInputChange && onCustomInputChange("customConsistency", e.target.value)}
          />
        )}
      </div>
      
      <div>
        <Label htmlFor="color">Color</Label>
        <Select 
          value={color} 
          onValueChange={handleColorChange}
        >
          <SelectTrigger className="mt-1">
            <SelectValue placeholder="Select color" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="brown">Brown</SelectItem>
            <SelectItem value="green">Green</SelectItem>
            <SelectItem value="yellow">Yellow</SelectItem>
            <SelectItem value="red">Red</SelectItem>
            <SelectItem value="black">Black</SelectItem>
            <SelectItem value="white">White</SelectItem>
            <SelectItem value="other">Other</SelectItem>
          </SelectContent>
        </Select>
        {showCustomColor && (
          <Input
            className="mt-2"
            placeholder="Specify color"
            value={customColor || ""}
            onChange={(e) => onCustomInputChange && onCustomInputChange("customColor", e.target.value)}
          />
        )}
      </div>
      
      <div>
        <Label htmlFor="location" className="flex items-center gap-1">
          <MapPin className="h-3.5 w-3.5" />
          Location (optional)
        </Label>
        <Input
          id="location"
          name="location"
          value={location || ""}
          onChange={onInputChange}
          placeholder="Where was the sample found?"
          className="mt-1"
        />
      </div>
      
      <div>
        <Label htmlFor="notes">Notes</Label>
        <Input
          id="notes"
          name="notes"
          value={notes || ""}
          onChange={onInputChange}
          placeholder="Add notes or use #tags"
          className="mt-1"
        />
      </div>
    </div>
  );
};

export default PoopEntryForm;
