
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { useState, useEffect } from "react";
import { createClient } from '@supabase/supabase-js';
import { TooltipProvider } from "@/components/ui/tooltip";
import Index from "./pages/Index";
import Dashboard from "./pages/Dashboard";
import Profile from "./pages/Profile";
import NotFound from "./pages/NotFound";
import Social from "./pages/Social";
import AppNav from "./components/AppNav";
import Achievements from "./pages/Achievements";
import AchievementPopup from "./components/AchievementPopup";
import Chat from "./pages/Chat";
import { Achievement } from "./types";
import AuthProvider from "./contexts/AuthContext";

// Create query client outside the component
const queryClient = new QueryClient();

// Initialize Supabase client
const supabaseUrl = 'https://supabase-project-url.supabase.co'; // Replace with your Supabase URL
const supabaseAnonKey = 'your-anon-key'; // Replace with your Supabase anon key
const supabase = createClient(supabaseUrl, supabaseAnonKey);

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
        <AuthProvider supabase={supabase}>
          <TooltipProvider>
            <Toaster />
            <Sonner position="top-right" closeButton />
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/profile" element={<Profile />} />
              <Route path="/social" element={<Social />} />
              <Route path="/achievements" element={<Achievements />} />
              <Route path="/chat" element={<Chat />} />
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
        </AuthProvider>
      </QueryClientProvider>
    </BrowserRouter>
  );
};

export default App;
