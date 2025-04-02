
import React from "react";
import { Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Container } from "@/components/ui/Container";

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
      {/* Header with AI badge */}
      <header className="pt-6 px-6">
        <div className="flex justify-end">
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
        
        {/* Middle section with illustration */}
        <div className="flex-1 flex items-center justify-center relative mb-6">
          <div className="relative w-64 h-64 sm:w-80 sm:h-80">
            <img 
              src="/lovable-uploads/d51274d1-b282-4318-af16-70114321f351.png" 
              alt="Happy dog with poop chart" 
              className="w-full h-full object-contain"
            />
            {/* Floating poop emoji decorations */}
            <div className="absolute -top-6 -right-4 animate-float delay-300">
              <div className="w-10 h-10 bg-brown-300 rounded-full flex items-center justify-center">
                <span role="img" aria-label="poop" className="text-xl">💩</span>
              </div>
            </div>
            <div className="absolute top-12 -left-6 animate-float delay-700">
              <div className="w-8 h-8 bg-brown-200 rounded-full flex items-center justify-center">
                <span role="img" aria-label="poop" className="text-lg">💩</span>
              </div>
            </div>
            <div className="absolute bottom-8 -right-8 animate-float">
              <div className="w-12 h-12 bg-brown-400 rounded-full flex items-center justify-center">
                <span role="img" aria-label="poop" className="text-2xl">💩</span>
              </div>
            </div>
          </div>
        </div>
        
        {/* Bottom section with buttons */}
        <div className="px-4 sm:px-8 space-y-4 mt-auto">
          <Button 
            size="lg" 
            onClick={handleGetStarted} 
            className="w-full py-6 rounded-full text-lg font-semibold shadow-lg"
          >
            Get started
          </Button>
          
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
