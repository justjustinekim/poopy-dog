
// Updated landing page with cute dog graphic as main element
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
        
        {/* Middle section with cute dog illustration */}
        <div className="flex-1 flex items-center justify-center relative mb-6">
          <div className="w-64 h-64 sm:w-80 sm:h-80 relative">
            {/* Cute dog illustration - updated to look more like a Golden Retriever */}
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-full h-full flex items-center justify-center">
                <svg viewBox="0 0 200 200" className="w-full h-full">
                  {/* Dog body - golden retriever style */}
                  <ellipse cx="100" cy="110" rx="70" ry="65" className="fill-[#F9D7A2]" />
                  
                  {/* Dog ears - floppy golden retriever style */}
                  <ellipse cx="55" cy="65" rx="28" ry="32" className="fill-[#F0C171] transform -rotate-15" />
                  <ellipse cx="145" cy="65" rx="28" ry="32" className="fill-[#F0C171] transform rotate-15" />
                  
                  {/* Dog head */}
                  <circle cx="100" cy="80" r="48" className="fill-[#F9D7A2]" />
                  
                  {/* Dog snout */}
                  <ellipse cx="100" cy="98" rx="28" ry="22" className="fill-[#F5E2B8]" />
                  <ellipse cx="100" cy="105" rx="16" ry="10" className="fill-[#8B5A2B]" />
                  
                  {/* Dog tongue */}
                  <ellipse cx="100" cy="110" rx="8" ry="4" className="fill-[#FF9999]" />
                  
                  {/* Dog eyes */}
                  <circle cx="82" cy="75" r="5" className="fill-[#4A4A4A]" />
                  <circle cx="118" cy="75" r="5" className="fill-[#4A4A4A]" />
                  
                  {/* Dog eyes shine */}
                  <circle cx="84" cy="73" r="2" className="fill-white" />
                  <circle cx="120" cy="73" r="2" className="fill-white" />
                  
                  {/* Dog eyebrows */}
                  <path d="M76,68 Q82,66 88,68" stroke="#A87D42" strokeWidth="1.5" fill="none" />
                  <path d="M112,68 Q118,66 124,68" stroke="#A87D42" strokeWidth="1.5" fill="none" />
                  
                  {/* Dog smile */}
                  <path d="M88,95 Q100,102 112,95" stroke="#4A4A4A" strokeWidth="2" fill="none" />
                  
                  {/* Dog blush */}
                  <circle cx="75" cy="90" r="8" className="fill-[#FFA6A6] opacity-40" />
                  <circle cx="125" cy="90" r="8" className="fill-[#FFA6A6] opacity-40" />
                  
                  {/* Darker fur patches */}
                  <ellipse cx="130" cy="125" rx="25" ry="20" className="fill-[#E8B05F]" />
                  <ellipse cx="70" cy="125" rx="20" ry="15" className="fill-[#E8B05F]" />
                  
                  {/* Tail */}
                  <path d="M35,100 Q25,80 35,60" stroke="#F0C171" strokeWidth="12" fill="none" strokeLinecap="round" />
                </svg>
              </div>
            </div>
            
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
