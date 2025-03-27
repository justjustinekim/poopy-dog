
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { useState, useEffect } from "react";
import Index from "./pages/Index";
import Dashboard from "./pages/Dashboard";
import Profile from "./pages/Profile";
import NotFound from "./pages/NotFound";
import Social from "./pages/Social";
import AppNav from "./components/AppNav";
import Achievements from "./pages/Achievements";
import AchievementPopup from "./components/AchievementPopup";
import { Achievement } from "./types";

// Create query client outside the component
const queryClient = new QueryClient();

const App = () => {
  const [showAchievement, setShowAchievement] = useState(false);
  const [currentAchievement, setCurrentAchievement] = useState<Achievement | null>(null);
  
  // Demo achievement popup on first load
  useEffect(() => {
    const hasSeenDemo = localStorage.getItem('hasSeenAchievementDemo');
    
    if (!hasSeenDemo) {
      setTimeout(() => {
        setCurrentAchievement({
          id: "welcome",
          title: "Welcome to PupPoopVision",
          description: "You've taken the first step to better dog health!",
          icon: "🐶",
          unlocked: true
        });
        setShowAchievement(true);
        localStorage.setItem('hasSeenAchievementDemo', 'true');
      }, 2000);
    }
  }, []);
  
  return (
    <BrowserRouter>
      <QueryClientProvider client={queryClient}>
        <TooltipProvider>
          <Toaster />
          <Sonner position="top-right" closeButton />
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/social" element={<Social />} />
            <Route path="/achievements" element={<Achievements />} />
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
          <AppNav />
          
          {showAchievement && currentAchievement && (
            <AchievementPopup 
              achievement={currentAchievement}
              onClose={() => setShowAchievement(false)}
            />
          )}
        </TooltipProvider>
      </QueryClientProvider>
    </BrowserRouter>
  );
};

export default App;
