
import React from "react";
import Header from "./Header";
import { cn } from "@/lib/utils";
import { useIsMobile } from "@/hooks/use-mobile";

interface LayoutProps {
  children: React.ReactNode;
  className?: string;
  fullWidth?: boolean;
  hideHeader?: boolean;
}

const Layout: React.FC<LayoutProps> = ({ 
  children, 
  className,
  fullWidth = false,
  hideHeader = false
}) => {
  const isMobile = useIsMobile();
  
  return (
    <div className="min-h-screen flex flex-col">
      {!hideHeader && <Header />}
      <main className={cn(
        "flex-1 flex flex-col",
        !fullWidth && "page-container",
        isMobile && "pb-20", // Add padding at the bottom for mobile to accommodate the tab bar
        className
      )}>
        <div className={cn(
          "relative z-10",
          fullWidth ? "w-full" : "w-full max-w-7xl mx-auto"
        )}>
          {children}
        </div>
      </main>
      <footer className={cn(
        "py-8 px-4 mt-16 border-t border-gray-100",
        isMobile && "mb-16" // Add margin at the bottom for mobile to accommodate the tab bar
      )}>
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="mb-4 md:mb-0">
              <p className="text-sm text-gray-500">
                © {new Date().getFullYear()} PoopyDog. All rights reserved.
              </p>
            </div>
            <div className="flex space-x-6">
              <a href="#" className="text-gray-500 hover:text-primary transition-colors">
                Privacy
              </a>
              <a href="#" className="text-gray-500 hover:text-primary transition-colors">
                Terms
              </a>
              <a href="#" className="text-gray-500 hover:text-primary transition-colors">
                Contact
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Layout;
