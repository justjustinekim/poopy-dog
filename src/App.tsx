
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { TooltipProvider } from "@/components/ui/tooltip";
import Index from "./pages/Index";
import Dashboard from "./pages/Dashboard";
import Profile from "./pages/Profile";
import NotFound from "./pages/NotFound";
import Social from "./pages/Social";
import AppNav from "./components/AppNav";
import Achievements from "./pages/Achievements";
import Chat from "./pages/Chat";
import Auth from "./pages/Auth";
import Onboarding from "./pages/Onboarding";
import Log from "./pages/Log";
import LogEntry from "./pages/LogEntry"; // Add import for new page
import { Achievement } from "./types";
import AuthProvider from "./contexts/AuthContext";
import ProfileProvider from "./contexts/ProfileContext";
import { supabase } from "@/integrations/supabase/client";
import AchievementPopup from "./components/AchievementPopup";
import { useAuth } from "./contexts/AuthContext";
import { useAchievements } from "./hooks/useAchievements";

const queryClient = new QueryClient();

const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { user, loading } = useAuth();
  
  if (loading) {
    return <div className="h-screen flex items-center justify-center">Loading...</div>;
  }
  
  if (!user && process.env.NODE_ENV !== 'development') {
    return <Navigate to="/auth" replace />;
  }
  
  return <>{children}</>;
};

const PublicRoute = ({ children }: { children: React.ReactNode }) => {
  const { user, loading } = useAuth();
  
  if (loading) {
    return <div className="h-screen flex items-center justify-center">Loading...</div>;
  }
  
  if (user && localStorage.getItem("onboardingCompleted") === "true") {
    return <Navigate to="/dashboard" replace />;
  }
  
  return <>{children}</>;
};

const AppRoutes = () => {
  const [showAchievement, setShowAchievement] = useState(false);
  const [currentAchievement, setCurrentAchievement] = useState<Achievement | null>(null);
  const { user } = useAuth();
  const { achievements, loading } = useAchievements();
  
  useEffect(() => {
    // Only show achievement demos if the user is logged in
    if (user) {
      const hasSeenDemo = localStorage.getItem('hasSeenAchievementDemo');
      const hasSeenNegativeDemo = localStorage.getItem('hasSeenNegativeAchievementDemo');
      
      // Only show demos if no real achievements are unlocked
      if (!hasSeenDemo && (!achievements.length || loading)) {
        setTimeout(() => {
          setCurrentAchievement({
            id: "welcome",
            title: "Welcome to PoopyDog",
            description: "You've taken the first step to better dog health!",
            icon: "🐶",
            unlocked: true,
            achievementType: "standard"
          });
          setShowAchievement(true);
          localStorage.setItem('hasSeenAchievementDemo', 'true');
        }, 2000);
      } 
      // Show negative achievement demo after welcome
      else if (!hasSeenNegativeDemo && (!achievements.length || loading)) {
        setTimeout(() => {
          setCurrentAchievement({
            id: "streak-breaker",
            title: "Streak Breaker",
            description: "You've missed tracking for 3 days in a row after having a streak.",
            icon: "💔",
            isNegative: true,
            unlocked: true,
            penaltyPoints: 50,
            achievementType: "standard"
          });
          setShowAchievement(true);
          localStorage.setItem('hasSeenNegativeAchievementDemo', 'true');
        }, 3000);
      }
    }
  }, [achievements, loading, user]);
  
  useEffect(() => {
    // Only check for new achievements if user is logged in
    if (user && !loading && achievements.length > 0) {
      const newlyUnlocked = achievements.find(
        a => a.unlocked && a.dateUnlocked && 
        new Date(a.dateUnlocked).getTime() > (Date.now() - 1000 * 10)
      );
      
      if (newlyUnlocked && !showAchievement) {
        setCurrentAchievement(newlyUnlocked);
        setShowAchievement(true);
      }
    }
  }, [achievements, loading, user]);
  
  return (
    <>
      <Routes>
        <Route path="/" element={
          user ? <Navigate to="/dashboard" replace /> : <PublicRoute><Index /></PublicRoute>
        } />
        <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
        <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
        <Route path="/social" element={<ProtectedRoute><Social /></ProtectedRoute>} />
        <Route path="/achievements" element={<ProtectedRoute><Achievements /></ProtectedRoute>} />
        <Route path="/chat" element={<ProtectedRoute><Chat /></ProtectedRoute>} />
        <Route path="/log" element={<ProtectedRoute><Log /></ProtectedRoute>} />
        <Route path="/log-entry" element={<ProtectedRoute><LogEntry /></ProtectedRoute>} />
        <Route path="/auth" element={<PublicRoute><Auth /></PublicRoute>} />
        <Route path="/onboarding" element={<ProtectedRoute><Onboarding /></ProtectedRoute>} />
        <Route path="*" element={<NotFound />} />
      </Routes>
      <AppNav />
      
      {/* Only show achievement popups if user is authenticated */}
      {user && showAchievement && currentAchievement && (
        <AchievementPopup 
          achievement={currentAchievement}
          onClose={() => setShowAchievement(false)}
        />
      )}
    </>
  );
};

const App = () => {
  return (
    <BrowserRouter>
      <QueryClientProvider client={queryClient}>
        <AuthProvider supabase={supabase as any}>
          <ProfileProvider>
            <TooltipProvider>
              <Toaster />
              <Sonner position="top-right" closeButton />
              <AppRoutes />
            </TooltipProvider>
          </ProfileProvider>
        </AuthProvider>
      </QueryClientProvider>
    </BrowserRouter>
  );
};

export default App;
