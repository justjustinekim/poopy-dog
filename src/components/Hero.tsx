
import React from "react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { ArrowRight, Camera, CalendarCheck, BarChart2 } from "lucide-react";
import { useInView, getAnimationClass } from "@/utils/animations";

const Hero: React.FC = () => {
  const { ref: headingRef, isInView: headingInView } = useInView();
  const { ref: textRef, isInView: textInView } = useInView();
  const { ref: ctaRef, isInView: ctaInView } = useInView();
  const { ref: featuresRef, isInView: featuresInView } = useInView();
  
  return (
    <section className="relative pt-24 pb-16 md:pt-32 md:pb-24">
      {/* Background decorative elements */}
      <div className="absolute inset-0 overflow-hidden -z-10 opacity-50">
        <div className="absolute top-1/4 -left-10 w-40 h-40 rounded-full bg-blue-200/30 blur-3xl"></div>
        <div className="absolute top-1/3 left-2/3 w-60 h-60 rounded-full bg-earth-200/30 blur-3xl"></div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto">
          <h1 
            ref={headingRef} 
            className={cn(
              "text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl",
              getAnimationClass(headingInView, 'slide-down')
            )}
          >
            <span className="text-primary">Monitor</span> Your Dog's Health
            <span className="block mt-2">Through Poop Tracking</span>
          </h1>
          
          <p 
            ref={textRef}
            className={cn(
              "mt-6 text-lg text-gray-600 max-w-2xl mx-auto",
              getAnimationClass(textInView, 'fade-in', 300)
            )}
          >
            Take daily photos of your dog's poop to track patterns, identify dietary issues, 
            and get insights on your furry friend's digestive health in a simple, intuitive way.
          </p>
          
          <div 
            ref={ctaRef}
            className={cn(
              "mt-10 flex flex-col sm:flex-row justify-center gap-4",
              getAnimationClass(ctaInView, 'fade-in', 600)
            )}
          >
            <Button asChild size="lg" className="text-base px-8 py-6">
              <Link to="/dashboard">Get Started <ArrowRight className="ml-2 h-5 w-5" /></Link>
            </Button>
            <Button asChild size="lg" variant="outline" className="text-base px-8 py-6">
              <Link to="/profile">Create Profile</Link>
            </Button>
          </div>
        </div>

        <div 
          ref={featuresRef} 
          className={cn(
            "mt-20 grid grid-cols-1 md:grid-cols-3 gap-8",
            getAnimationClass(featuresInView, 'slide-up', 800)
          )}
        >
          {[
            {
              icon: <Camera className="h-10 w-10 text-primary" />,
              title: "Easy Photo Capture",
              description: "Take quick photos right from the app and store them securely."
            },
            {
              icon: <CalendarCheck className="h-10 w-10 text-primary" />,
              title: "Daily Tracking",
              description: "Keep a consistent record of your dog's digestive health over time."
            },
            {
              icon: <BarChart2 className="h-10 w-10 text-primary" />,
              title: "Health Insights",
              description: "Get personalized analysis and spot potential health issues early."
            }
          ].map((feature, index) => (
            <div 
              key={index} 
              className="glass-card p-6 flex flex-col items-center text-center"
              style={{ animationDelay: `${index * 100 + 800}ms` }}
            >
              <div className="mb-4 rounded-full bg-primary/10 p-3">
                {feature.icon}
              </div>
              <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
              <p className="text-gray-600">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

// Import cn from utils
import { cn } from "@/lib/utils";

export default Hero;
