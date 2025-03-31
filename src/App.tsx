
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
import { Achievement } from "./types";
import AuthProvider from "./contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import AchievementPopup from "./components/AchievementPopup";
import { useAuth } from "./contexts/AuthContext";
import type { Database } from "./integrations/supabase/types";
import { SupabaseClient } from "@supabase/supabase-js";

const queryClient = new QueryClient();

// Protected route component that redirects to auth page if not logged in
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

// Public route component that redirects to dashboard if logged in
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
  
  useEffect(() => {
    const hasSeenDemo = localStorage.getItem('hasSeenAchievementDemo');
    
    if (!hasSeenDemo) {
      setTimeout(() => {
        setCurrentAchievement({
          id: "welcome",
          title: "Welcome to PoopyDog",
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
        <Route path="/auth" element={<PublicRoute><Auth /></PublicRoute>} />
        <Route path="/onboarding" element={<ProtectedRoute><Onboarding /></ProtectedRoute>} />
        <Route path="*" element={<NotFound />} />
      </Routes>
      <AppNav />
      
      {showAchievement && currentAchievement && (
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
        <AuthProvider supabase={supabase}>
          <TooltipProvider>
            <Toaster />
            <Sonner position="top-right" closeButton />
            <AppRoutes />
          </TooltipProvider>
        </AuthProvider>
      </QueryClientProvider>
    </BrowserRouter>
  );
};

export default App;
