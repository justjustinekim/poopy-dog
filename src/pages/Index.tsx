import React, { useState } from "react";
import Header from "@/components/Header";
import Hero from "@/components/Hero";
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
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="container mx-auto px-4 py-8">
        <Hero
          title="Better Dog Health Starts with Poop"
          subtitle="Track, analyze, and understand your dog's digestive health to keep them happy and healthy."
          ctaText="Get Started"
          onCtaClick={handleGetStarted}
        />
        
        <div className="mt-8 text-center">
          {user ? (
            <Button variant="outline" onClick={() => navigate('/dashboard')}>
              Go to Dashboard
            </Button>
          ) : (
            <Button variant="outline" onClick={() => navigate('/auth')}>
              Sign In / Sign Up
            </Button>
          )}
        </div>
        
        <section className="py-12 md:py-24">
          <div className="container px-4 md:px-6">
            <div className="grid gap-6 lg:grid-cols-3 lg:gap-12">
              <div className="flex flex-col items-center space-y-4 text-center">
                <div className="rounded-full bg-primary/10 p-4">
                  <svg
                    className="h-6 w-6 text-primary"
                    fill="none"
                    height="24"
                    stroke="currentColor"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    viewBox="0 0 24 24"
                    width="24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path d="M12 2v1" />
                    <path d="M12 21v1" />
                    <path d="m4.93 4.93-.7.7" />
                    <path d="m19.07 19.07-.7.7" />
                    <path d="M2 12h1" />
                    <path d="M21 12h1" />
                    <path d="m4.93 19.07-.7-.7" />
                    <path d="m19.07 4.93-.7-.7" />
                    <path d="M12 17a5 5 0 1 0 0-10 5 5 0 0 0 0 10Z" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold">Track Daily</h3>
                <p className="text-gray-500 dark:text-gray-400">
                  Log your dog's poop with our easy-to-use tracking system. Take photos, note consistency, and track changes over time.
                </p>
              </div>
              <div className="flex flex-col items-center space-y-4 text-center">
                <div className="rounded-full bg-primary/10 p-4">
                  <svg
                    className="h-6 w-6 text-primary"
                    fill="none"
                    height="24"
                    stroke="currentColor"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    viewBox="0 0 24 24"
                    width="24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path d="M3 12a9 9 0 1 0 18 0 9 9 0 0 0-18 0" />
                    <path d="M12 8v4l2 2" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold">Analyze Health</h3>
                <p className="text-gray-500 dark:text-gray-400">
                  Our AI analyzes your dog's poop patterns to identify potential health issues before they become serious problems.
                </p>
              </div>
              <div className="flex flex-col items-center space-y-4 text-center">
                <div className="rounded-full bg-primary/10 p-4">
                  <svg
                    className="h-6 w-6 text-primary"
                    fill="none"
                    height="24"
                    stroke="currentColor"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    viewBox="0 0 24 24"
                    width="24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold">Improve Diet</h3>
                <p className="text-gray-500 dark:text-gray-400">
                  Get personalized recommendations for your dog's diet based on their digestive health patterns and needs.
                </p>
              </div>
            </div>
          </div>
        </section>
        
        <section className="py-12 md:py-24 bg-gray-50 dark:bg-gray-900 rounded-lg my-12">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <div className="space-y-2">
                <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
                  Join thousands of happy dog owners
                </h2>
                <p className="mx-auto max-w-[700px] text-gray-500 md:text-xl dark:text-gray-400">
                  Our community is growing every day. Start tracking your dog's health today and see the difference.
                </p>
              </div>
              <div className="flex flex-col gap-2 min-[400px]:flex-row">
                <Button onClick={handleGetStarted}>Get Started for Free</Button>
                <Button variant="outline">Learn More</Button>
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
};

export default Index;
