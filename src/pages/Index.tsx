
import React from "react";
import Layout from "@/components/Layout";
import Hero from "@/components/Hero";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useInView, getAnimationClass } from "@/utils/animations";
import { Camera, ChevronRight, Calendar, BarChart2, CheckCircle, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

const Index = () => {
  const { ref: appDemoRef, isInView: appDemoInView } = useInView();
  const { ref: howItWorksRef, isInView: howItWorksInView } = useInView();
  const { ref: testimonialRef, isInView: testimonialInView } = useInView();
  
  return (
    <Layout fullWidth>
      <Hero />
      
      {/* App Demo Section */}
      <section 
        ref={appDemoRef}
        className={cn(
          "py-20 bg-blue-50/50",
          getAnimationClass(appDemoInView, 'fade-in')
        )}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">See How It Works</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Our intuitive app makes it easy to track, analyze, and understand your dog's digestive health.
            </p>
          </div>
          
          <Tabs defaultValue="track" className="max-w-4xl mx-auto">
            <TabsList className="grid grid-cols-3 mb-8">
              <TabsTrigger value="track" className="py-3">
                <Camera className="mr-2 h-4 w-4" />
                <span>Track</span>
              </TabsTrigger>
              <TabsTrigger value="analyze" className="py-3">
                <Calendar className="mr-2 h-4 w-4" />
                <span>Analyze</span>
              </TabsTrigger>
              <TabsTrigger value="insights" className="py-3">
                <BarChart2 className="mr-2 h-4 w-4" />
                <span>Insights</span>
              </TabsTrigger>
            </TabsList>
            
            <div className="p-1 glass-card rounded-xl overflow-hidden">
              <TabsContent value="track">
                <img 
                  src="https://images.unsplash.com/photo-1583511655857-d19b40a7a54e?auto=format&fit=crop&w=1000&q=80" 
                  alt="Dog health tracking screenshot" 
                  className="rounded-lg w-full h-auto max-h-[500px] object-cover object-center" 
                />
              </TabsContent>
              <TabsContent value="analyze">
                <img 
                  src="https://images.unsplash.com/photo-1544568100-847a948585b9?auto=format&fit=crop&w=1000&q=80" 
                  alt="Dog health analysis screenshot" 
                  className="rounded-lg w-full h-auto max-h-[500px] object-cover object-center" 
                />
              </TabsContent>
              <TabsContent value="insights">
                <img 
                  src="https://images.unsplash.com/photo-1543466835-00a7907e9de1?auto=format&fit=crop&w=1000&q=80" 
                  alt="Dog health insights screenshot" 
                  className="rounded-lg w-full h-auto max-h-[500px] object-cover object-center" 
                />
              </TabsContent>
            </div>
          </Tabs>
        </div>
      </section>
      
      {/* How It Works */}
      <section 
        ref={howItWorksRef} 
        className={cn(
          "py-20",
          getAnimationClass(howItWorksInView, 'fade-in')
        )}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Simple Three-Step Process</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Start monitoring your dog's health in minutes with our easy to use platform.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-12">
            {[
              {
                step: 1,
                title: "Create a Profile",
                description: "Add your dog's details including breed, age, and weight to personalize the experience.",
                icon: <CheckCircle className="h-6 w-6 text-white" />,
              },
              {
                step: 2,
                title: "Take Daily Photos",
                description: "Use the app to capture photos of your dog's poop during your regular walks.",
                icon: <Camera className="h-6 w-6 text-white" />,
              },
              {
                step: 3,
                title: "Get Health Insights",
                description: "Receive personalized analysis and track changes over time to spot potential issues.",
                icon: <BarChart2 className="h-6 w-6 text-white" />,
              }
            ].map((item, index) => (
              <div 
                key={index} 
                className="relative glass-card p-6 flex flex-col"
                style={{ animationDelay: `${index * 150}ms` }}
              >
                <div className="absolute -top-5 -right-5 bg-primary w-12 h-12 rounded-full flex items-center justify-center shadow-lg border-4 border-white">
                  {item.icon}
                </div>
                <div className="mb-4 text-5xl font-bold text-gray-200">{item.step}</div>
                <h3 className="text-xl font-semibold mb-2">{item.title}</h3>
                <p className="text-gray-600 mb-4">{item.description}</p>
                <div className="mt-auto">
                  <Button 
                    variant="ghost" 
                    className="group text-primary p-0 h-auto" 
                    asChild
                  >
                    <Link to="/dashboard">
                      Learn more <ChevronRight className="ml-1 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                    </Link>
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
      
      {/* Testimonial */}
      <section 
        ref={testimonialRef}
        className={cn(
          "py-20 bg-blue-50/50",
          getAnimationClass(testimonialInView, 'fade-in')
        )}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Card className="glass-card max-w-4xl mx-auto p-8 md:p-12">
            <CardContent className="p-0">
              <blockquote className="relative">
                <div className="text-center">
                  <p className="text-lg md:text-xl text-gray-800 italic mb-6">
                    "This app has been a game-changer for monitoring my dog's health. The photo tracking and analysis helped us identify a dietary issue early, before it became serious. Highly recommend to all pet parents!"
                  </p>
                  <footer className="mt-4">
                    <div className="flex items-center justify-center space-x-4">
                      <img 
                        src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=100&h=100" 
                        alt="User avatar" 
                        className="w-12 h-12 rounded-full object-cover" 
                      />
                      <div>
                        <p className="font-semibold">Sarah Johnson</p>
                        <p className="text-sm text-gray-600">Dog mom to Max, Golden Retriever</p>
                      </div>
                    </div>
                  </footer>
                </div>
              </blockquote>
            </CardContent>
          </Card>
          
          <div className="mt-16 text-center">
            <h2 className="text-2xl font-bold mb-6">Ready to start monitoring your dog's health?</h2>
            <Button asChild size="lg" className="px-8 py-6 text-base">
              <Link to="/dashboard">
                Get Started Now <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
          </div>
        </div>
      </section>
    </Layout>
  );
};

// Import cn from utils
import { cn } from "@/lib/utils";

export default Index;
