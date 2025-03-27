
import React from "react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { ArrowRight, Camera, Dog, Trophy, Heart } from "lucide-react";
import { useInView, getAnimationClass } from "@/utils/animations";
import { cn } from "@/lib/utils";

const Hero: React.FC = () => {
  const { ref: headingRef, isInView: headingInView } = useInView();
  const { ref: textRef, isInView: textInView } = useInView();
  const { ref: ctaRef, isInView: ctaInView } = useInView();
  const { ref: featuresRef, isInView: featuresInView } = useInView();
  
  return (
    <section className="relative pt-24 pb-16 md:pt-32 md:pb-24 overflow-hidden">
      {/* Fun cartoon-style background elements */}
      <div className="absolute inset-0 overflow-hidden -z-10">
        <div className="absolute top-1/4 -left-10 w-40 h-40 rounded-full bg-blue-200/30 blur-3xl"></div>
        <div className="absolute top-1/3 left-2/3 w-60 h-60 rounded-full bg-secondary/20 blur-3xl"></div>
        
        {/* Cartoon paw prints */}
        <div className="absolute bottom-20 left-10 text-4xl rotate-12 opacity-30">🐾</div>
        <div className="absolute bottom-40 left-40 text-3xl -rotate-12 opacity-20">🐾</div>
        <div className="absolute top-40 right-20 text-4xl rotate-45 opacity-20">🐾</div>
        
        {/* Cartoon dog */}
        <div className="absolute -bottom-10 -right-10 md:bottom-10 md:right-10 text-9xl transform rotate-12 opacity-20">🐶</div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto">
          <h1 
            ref={headingRef} 
            className={cn(
              "text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl cartoon-text",
              getAnimationClass(headingInView, 'slide-down')
            )}
          >
            <span className="text-primary">Pup Poop</span> Tracker
            <div className="mt-2 relative inline-block">
              <span className="relative z-10">Made Fun & Easy!</span>
              <span className="absolute -bottom-2 left-0 right-0 h-4 bg-yellow-300/30 -z-0 transform -rotate-1"></span>
            </div>
          </h1>
          
          <p 
            ref={textRef}
            className={cn(
              "mt-6 text-lg text-gray-600 max-w-2xl mx-auto",
              getAnimationClass(textInView, 'fade-in', 300)
            )}
          >
            Track your dog's digestive health with photos, earn achievements, connect with other dog parents, and get personalized insights in this fun, cartoonish app!
          </p>
          
          <div 
            ref={ctaRef}
            className={cn(
              "mt-10 flex flex-col sm:flex-row justify-center gap-4",
              getAnimationClass(ctaInView, 'fade-in', 600)
            )}
          >
            <Button asChild size="lg" className="text-base px-8 py-6 rounded-xl font-bold cartoon-text">
              <Link to="/dashboard">Start Tracking <ArrowRight className="ml-2 h-5 w-5" /></Link>
            </Button>
            <Button asChild size="lg" variant="outline" className="text-base px-8 py-6 rounded-xl font-bold cartoon-text">
              <Link to="/social">Join Community</Link>
            </Button>
          </div>
          
          {/* Mobile app mockup */}
          <div className="mt-12 relative">
            <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-background z-10"></div>
            <img 
              src="https://images.unsplash.com/photo-1583511655857-d19b40a7a54e?auto=format&fit=crop&w=400" 
              alt="Dog using app" 
              className="mx-auto rounded-t-3xl border-2 border-gray-200 shadow-2xl max-w-[260px]"
            />
            
            {/* App mockup overlay elements */}
            <div className="absolute top-6 left-1/2 transform -translate-x-1/2 bg-white/80 backdrop-blur-sm rounded-xl px-3 py-1 border border-gray-200 text-xs font-medium cartoon-text">
              <div className="flex items-center gap-1">
                <Trophy className="h-3 w-3 text-yellow-500" />
                <span>Achievement Unlocked!</span>
              </div>
            </div>
            
            <div className="absolute bottom-20 left-1/2 transform -translate-x-1/2 bg-white/80 backdrop-blur-sm rounded-xl px-3 py-1 border border-gray-200 text-xs font-medium flex items-center gap-1 cartoon-text">
              <Heart className="h-3 w-3 text-red-500" />
              <span>Perfect Poop Streak: 5 Days</span>
            </div>
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
              icon: <Camera className="h-10 w-10 text-white" />,
              title: "Easy Photo Tracking",
              description: "Take quick photos right from the app to track your dog's digestive health."
            },
            {
              icon: <Dog className="h-10 w-10 text-white" />,
              title: "Fun Achievements",
              description: "Earn badges and unlock achievements as you track your dog's health journey."
            },
            {
              icon: <Heart className="h-10 w-10 text-white" />,
              title: "Community Support",
              description: "Connect with other dog parents, share advice and celebrate healthy poops together!"
            }
          ].map((feature, index) => (
            <div 
              key={index} 
              className="glass-card p-6 flex flex-col items-center text-center transform hover:scale-105 transition-all"
              style={{ animationDelay: `${index * 100 + 800}ms` }}
            >
              <div className="mb-4 rounded-full bg-gradient-to-br from-primary to-secondary p-4 cartoon-bubble">
                {feature.icon}
              </div>
              <h3 className="text-xl font-semibold mb-2 cartoon-text">{feature.title}</h3>
              <p className="text-gray-600">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Hero;
