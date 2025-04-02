
import React from "react";
import { cn } from "@/lib/utils";
import ThemeToggle from "../ThemeToggle";

interface ContainerProps {
  className?: string;
  children: React.ReactNode;
  showThemeToggle?: boolean;
}

export const Container: React.FC<ContainerProps> = ({ 
  className = "", 
  children,
  showThemeToggle = false
}) => {
  return (
    <div className={cn("container mx-auto px-4 md:px-6 relative", className)}>
      {showThemeToggle && (
        <div className="absolute right-4 top-0 z-50">
          <ThemeToggle />
        </div>
      )}
      {children}
    </div>
  );
};
