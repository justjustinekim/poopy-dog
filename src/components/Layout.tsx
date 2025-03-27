
import React from "react";
import Header from "./Header";
import { cn } from "@/lib/utils";

interface LayoutProps {
  children: React.ReactNode;
  className?: string;
  fullWidth?: boolean;
}

const Layout: React.FC<LayoutProps> = ({ 
  children, 
  className,
  fullWidth = false
}) => {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className={cn(
        "flex-1 flex flex-col",
        !fullWidth && "page-container",
        className
      )}>
        <div className={cn(
          "relative z-10",
          fullWidth ? "w-full" : "w-full max-w-7xl mx-auto"
        )}>
          {children}
        </div>
      </main>
      <footer className="py-8 px-4 mt-16 border-t border-gray-100">
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
