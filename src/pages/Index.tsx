import React from "react";
import { useRouter } from 'next/router';
import Layout from "@/components/Layout";
import Hero from "@/components/Hero";
import { Button } from "@/components/ui/button";
import { Dog, ArrowRight, Camera, Check, BarChart } from "lucide-react";


const Index = () => {
  const router = useRouter();

  const handleGetStarted = () => {
    router.push('/auth');
  };
};
  return (
    <Layout>
      <Hero />
      
      <section className="py-12 md:py-20">
        <div className="container px-4 mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Monitor Your Dog's Digestive Health</h2>
            <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
              PoopyDog helps you track, analyze, and improve your dog's gut health with powerful, easy-to-use tools.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm border">
              <div className="bg-primary/10 w-12 h-12 rounded-lg flex items-center justify-center mb-4">
                <Camera className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Easy Photo Tracking</h3>
              <p className="text-gray-600 dark:text-gray-300">
                Take a quick snap of your dog's stool to log and track changes over time.
              </p>
            </div>
            
            <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm border">
              <div className="bg-primary/10 w-12 h-12 rounded-lg flex items-center justify-center mb-4">
                <BarChart className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-2">AI-Powered Analysis</h3>
              <p className="text-gray-600 dark:text-gray-300">
                Our algorithms analyze stool consistency, color, and patterns to identify potential issues.
              </p>
            </div>
            
            <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm border">
              <div className="bg-primary/10 w-12 h-12 rounded-lg flex items-center justify-center mb-4">
                <Check className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Health Insights</h3>
              <p className="text-gray-600 dark:text-gray-300">
                Get actionable advice and insights to improve your dog's digestive health and diet.
              </p>
            </div>
          </div>
          
          <div className="mt-12 text-center">
            <Button size="lg" onClick={handleGetStarted}>
              Get Started <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </div>
        </div>
      </section>
      
      <section className="py-12 bg-gray-50 dark:bg-gray-900">
        <div className="container px-4 mx-auto">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-3xl font-bold mb-6">Your Dog's Gut Health Matters</h2>
            <p className="text-lg text-gray-600 dark:text-gray-300 mb-8">
              Digestive issues in dogs can lead to discomfort, nutrient deficiencies, and other health problems. 
              Regular monitoring helps catch issues early and improve your pet's quality of life.
            </p>
            
            <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm border">
              <div className="flex items-start space-x-4">
                <div className="bg-primary/10 p-3 rounded-full">
                  <Dog className="h-6 w-6 text-primary" />
                </div>
                <div className="text-left">
                  <h3 className="font-medium text-lg">Did you know?</h3>
                  <p className="text-gray-600 dark:text-gray-300">
                    Over 20% of vet visits are related to digestive issues, and many can be prevented 
                    with proper monitoring and early intervention.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      
      <section className="py-16 md:py-24">
        <div className="container px-4 mx-auto">
          <div className="flex flex-col md:flex-row items-center justify-between">
            <div className="md:w-1/2 mb-8 md:mb-0">
              <h2 className="text-3xl font-bold mb-4">Ready to monitor your dog's health?</h2>
              <p className="text-lg text-gray-600 dark:text-gray-300 mb-8">
                Join thousands of pet parents who are taking a proactive approach to their dog's digestive well-being.
              </p>
              <Button size="lg" onClick={handleGetStarted}>
                Start Now <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </div>
            
            <div className="md:w-1/2 flex justify-center">
              <div className="relative">
                <Dog className="h-52 w-52 text-primary animate-float" />
                <div className="absolute inset-0 bg-primary/20 rounded-full blur-3xl -z-10"></div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default Index;
