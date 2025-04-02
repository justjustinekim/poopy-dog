
import React, { useState } from "react";
import { DogIcon, HeartIcon, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link, useNavigate } from "react-router-dom";
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
    <div className="relative min-h-screen bg-blue-50 dark:bg-gray-900 overflow-hidden">
      {/* Status Bar Mockup (for visual appeal only) */}
      <div className="fixed top-0 left-0 right-0 bg-white dark:bg-gray-800 p-2 flex justify-end items-center gap-2 z-50">
        <div className="text-xs font-bold">9:41</div>
        <div className="flex items-center gap-1">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M6 14L12 8L18 14" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M2 22L22 2" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M8 2H22V16" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
          <svg width="20" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <rect x="3" y="6" width="18" height="12" rx="2" stroke="currentColor" strokeWidth="2"/>
            <path d="M7 15V9L12 12L17 9V15" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </div>
      </div>
      
      <main className="container mx-auto px-6 pt-14 pb-32 relative">
        {/* Poop Entry Illustrations */}
        <div className="absolute top-24 left-4 w-28 h-28 rounded-full bg-white dark:bg-gray-800 shadow-lg flex items-center justify-center transform -rotate-6 z-10">
          <div className="relative">
            <svg width="60" height="60" viewBox="0 0 24 24" fill="currentColor" className="text-amber-800">
              <path d="M12 2C8.41 2 4 3.5 4 8.5c0 3.5 1.11 4.72 1.5 5.5c0 0 1.5 0 1.5-2C7 13 7 12.5 7.5 13C8 13.5 9 15 10 15s2.5-1.5 3-1.5s1 1 2 1s2-1 2-1.5S16 10 16 10c3.61-1.13 5-3.69 5-5.5C21 3.5 17.59 2 12 2z"/>
            </svg>
            <div className="absolute -bottom-2 -right-2 bg-white dark:bg-gray-700 rounded-full px-2 py-1 text-xs font-bold border border-gray-200 dark:border-gray-600">
              Good!
            </div>
          </div>
        </div>
        
        <div className="absolute top-40 right-4 w-32 h-32 rounded-full bg-white dark:bg-gray-800 shadow-lg flex items-center justify-center transform rotate-3 z-10">
          <div className="relative">
            <svg width="70" height="70" viewBox="0 0 24 24" fill="currentColor" className="text-yellow-700">
              <path d="M12 2C8.41 2 4 3.5 4 8.5c0 3.5 1.11 4.72 1.5 5.5c0 0 1.5 0 1.5-2C7 13 7 12.5 7.5 13C8 13.5 9 15 10 15s2.5-1.5 3-1.5s1 1 2 1s2-1 2-1.5S16 10 16 10c3.61-1.13 5-3.69 5-5.5C21 3.5 17.59 2 12 2z"/>
            </svg>
            <div className="absolute -bottom-2 -right-2 bg-white dark:bg-gray-700 rounded-full px-2 py-1 text-xs font-bold border border-gray-200 dark:border-gray-600">
              Healthy!
            </div>
          </div>
        </div>
        
        <div className="absolute bottom-40 left-8 w-36 h-36 rounded-full bg-white dark:bg-gray-800 shadow-lg flex items-center justify-center transform -rotate-6 z-10">
          <div className="relative">
            <svg width="80" height="80" viewBox="0 0 24 24" fill="currentColor" className="text-green-900">
              <path d="M12 2C8.41 2 4 3.5 4 8.5c0 3.5 1.11 4.72 1.5 5.5c0 0 1.5 0 1.5-2C7 13 7 12.5 7.5 13C8 13.5 9 15 10 15s2.5-1.5 3-1.5s1 1 2 1s2-1 2-1.5S16 10 16 10c3.61-1.13 5-3.69 5-5.5C21 3.5 17.59 2 12 2z"/>
            </svg>
            <div className="absolute -bottom-2 -right-2 bg-white dark:bg-gray-700 rounded-full px-2 py-1 text-xs font-bold border border-gray-200 dark:border-gray-600">
              Perfect!
            </div>
          </div>
        </div>
        
        {/* AI Badge */}
        <div className="flex justify-center mt-10 mb-4">
          <div className="bg-primary/10 text-primary px-4 py-1 rounded-full flex items-center gap-1">
            <span>Powered by AI</span>
            <Sparkles size={16} className="animate-pulse" />
          </div>
        </div>
        
        {/* Cute Dog Character */}
        <div className="absolute right-0 top-32 z-20">
          <div className="relative">
            <div className="w-32 h-32 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
              <DogIcon 
                size={100} 
                className="absolute top-4 left-4 text-primary transform scale-125"
              />
              <div className="absolute top-8 left-6 w-8 h-8 bg-red-500 rounded-full transform rotate-12 z-10"></div>
              <div className="absolute top-8 left-16 w-8 h-8 bg-red-500 rounded-full transform -rotate-12 z-10"></div>
              {/* Smile */}
              <div className="absolute bottom-8 left-10 w-12 h-6 border-b-4 border-gray-800 rounded-full"></div>
            </div>
          </div>
        </div>
        
        {/* Main Text Content */}
        <div className="mt-28 relative z-30">
          <h1 className="text-5xl font-black leading-tight text-gray-900 dark:text-white">
            Track<br/>
            poops.<br/>
            Raise<br/>
            healthy<br/>
            dogs!
          </h1>
          
          <div className="mt-10">
            <Button 
              size="lg" 
              onClick={handleGetStarted} 
              className="w-full py-6 rounded-full text-lg font-semibold"
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
          </div>
          
          <div className="mt-10 text-center text-xs text-gray-500 dark:text-gray-400">
            By continuing you're accepting our 
            <Link to="#" className="mx-1 underline">Terms of Use</Link> 
            and 
            <Link to="#" className="mx-1 underline">Privacy Notice</Link>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Index;
