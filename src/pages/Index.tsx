
import React from "react";
import { Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";

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
    <div className="relative min-h-screen bg-[#d6f7eb] dark:bg-gray-900 flex flex-col items-center justify-between px-6 py-12">
      {/* Main Content */}
      <div className="w-full max-w-md mx-auto flex flex-col items-center">
        {/* Heading */}
        <h1 className="text-5xl font-black text-center leading-tight text-gray-900 dark:text-white mt-10 mb-4">
          Track poop.
          <br />
          Decode health.
          <br />
          Love them longer!
        </h1>
        
        {/* Illustration area */}
        <div className="relative w-full my-6">
          {/* Dog illustration */}
          <div className="absolute bottom-0 left-12 z-20">
            <img src="/lovable-uploads/d51274d1-b282-4318-af16-70114321f351.png" alt="Cute dog with poop illustrations" className="w-[500px] max-w-full h-auto" />
          </div>
          
          {/* AI Badge */}
          <div className="absolute top-0 right-0 z-10">
            <div className="bg-primary/10 text-primary px-4 py-1 rounded-full flex items-center gap-1">
              <span>AI Powered</span>
              <Sparkles size={16} className="animate-pulse" />
            </div>
          </div>
        </div>
      </div>
      
      {/* Bottom section with buttons */}
      <div className="w-full max-w-md mt-auto">
        <Button 
          size="lg" 
          onClick={handleGetStarted} 
          className="w-full py-6 rounded-full text-xl font-semibold"
        >
          Get started
        </Button>
        
        <div className="mt-4 text-center">
          <button 
            onClick={() => navigate('/auth')} 
            className="text-gray-700 dark:text-gray-300 font-medium"
          >
            I already have an account
          </button>
        </div>
        
        <div className="mt-6 text-center text-xs text-gray-500 dark:text-gray-400">
          By continuing you're accepting our 
          <a href="#" className="mx-1 underline">Terms of Use</a> 
          and 
          <a href="#" className="mx-1 underline">Privacy Notice</a>
        </div>
      </div>
    </div>
  );
};

export default Index;
