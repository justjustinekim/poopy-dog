// Updated landing page with cute dog graphic as main element and playful UI elements
import React from "react";
import { Sparkles, PawPrint } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Container } from "@/components/ui/Container";
import ThemeToggle from "@/components/ThemeToggle";

const Index: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  
  const handleGetStarted = () => {
    if (user) {
      navigate('/dashboard');
    } else {
      navigate('/auth');
    }
  };
  
  return (
    <div className="relative min-h-screen bg-[#d6f7eb] dark:bg-gray-900 flex flex-col">
      {/* Header with AI badge and theme toggle */}
      <header className="pt-6 px-6">
        <div className="flex justify-between items-center">
          <ThemeToggle />
          <div className="bg-primary/10 text-primary px-4 py-1 rounded-full flex items-center gap-1">
            <span className="text-sm font-medium">AI Powered</span>
            <Sparkles size={16} className="animate-pulse" />
          </div>
        </div>
      </header>
      
      {/* Main Content */}
      <Container className="flex-1 flex flex-col justify-between py-8">
        {/* Top section with text */}
        <div className="text-center mb-6">
          <h1 className="text-4xl sm:text-5xl font-black text-gray-900 dark:text-white leading-tight">
            Track poop.
            <br />
            Decode health.
            <br />
            Love them longer!
          </h1>
          <p className="mt-4 text-gray-700 dark:text-gray-300 max-w-md mx-auto">
            Monitor your dog's digestive health to ensure they live a happy, healthy life.
          </p>
        </div>
        
        {/* Middle section with puppy image */}
        <div className="flex-1 flex items-center justify-center relative mb-6">
          <div className="w-72 h-72 sm:w-96 sm:h-96 relative">
            {/* Puppy image with poop */}
            <div className="absolute inset-0 flex items-center justify-center">
              <img 
                src="/public/lovable-uploads/6efeee09-4adc-467d-8637-8973c5cef9fa.png" 
                alt="Cute cartoon puppy with poop" 
                className="w-full h-full object-contain"
              />
            </div>
            
            {/* Floating poop emoji decorations - now 30% bigger */}
            <div className="absolute -top-6 -right-4 animate-float delay-300">
              <div className="w-13 h-13 bg-brown-300 rounded-full flex items-center justify-center scale-130">
                <span role="img" aria-label="poop" className="text-2xl">💩</span>
                {/* Score bubble */}
                <div className="absolute -top-2 -right-2 bg-yellow-400 text-primary text-xs font-bold rounded-full w-6 h-6 flex items-center justify-center border-2 border-white dark:border-gray-800 animate-pulse">
                  +1
                </div>
              </div>
            </div>
            <div className="absolute top-12 -left-6 animate-float delay-700">
              <div className="w-10 h-10 bg-brown-200 rounded-full flex items-center justify-center scale-130">
                <span role="img" aria-label="poop" className="text-xl">💩</span>
              </div>
            </div>
            
            {/* Chart illustration */}
            <div className="absolute -bottom-4 -left-4 bg-white dark:bg-gray-800 p-2 rounded-lg shadow-md transform rotate-3">
              <div className="flex items-end h-16 gap-1">
                <div className="w-3 bg-primary h-5 rounded-t"></div>
                <div className="w-3 bg-primary h-8 rounded-t"></div>
                <div className="w-3 bg-primary h-12 rounded-t"></div>
                <div className="w-3 bg-primary h-7 rounded-t"></div>
                <div className="w-3 bg-primary h-10 rounded-t"></div>
              </div>
            </div>
            
            {/* Thought bubble with heart */}
            <div className="absolute -top-4 -left-4">
              <div className="relative">
                <div className="bg-white dark:bg-gray-800 p-2 rounded-full shadow-sm">
                  <span role="img" aria-label="heart" className="text-red-500 text-xl">❤️</span>
                </div>
                <div className="absolute bottom-0 right-1 w-3 h-3 bg-white dark:bg-gray-800 rounded-full transform translate-x-1/2 translate-y-1/2"></div>
                <div className="absolute bottom-2 right-3 w-2 h-2 bg-white dark:bg-gray-800 rounded-full transform translate-x-1/2 translate-y-1/2"></div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Bottom section with buttons */}
        <div className="px-4 sm:px-8 space-y-4 mt-auto">
          <div className="relative">
            <Button 
              size="lg" 
              onClick={handleGetStarted} 
              className="w-full py-6 rounded-full text-lg font-semibold shadow-lg"
            >
              Get started
            </Button>
            
            {/* Paw print stamp */}
            <div className="absolute -top-3 -right-2 z-10">
              <div className="bg-white dark:bg-white rounded-full w-9 h-9 flex items-center justify-center shadow-md transform rotate-12 animate-float">
                <PawPrint size={28} className="text-black fill-black transform rotate-225" />
              </div>
            </div>
          </div>
          
          <div className="text-center">
            <button 
              onClick={() => navigate('/auth')} 
              className="text-gray-700 dark:text-gray-300 font-medium"
            >
              I already have an account
            </button>
          </div>
          
          <div className="text-center text-xs text-gray-500 dark:text-gray-400 pt-2">
            By continuing you're accepting our 
            <a href="#" className="mx-1 underline">Terms of Use</a> 
            and 
            <a href="#" className="mx-1 underline">Privacy Notice</a>
          </div>
        </div>
      </Container>
    </div>
  );
};

export default Index;
