
import React from 'react';
import { Button } from '@/components/ui/button';

interface HeroProps {
  title: string;
  subtitle: string;
  ctaText: string;
  onCtaClick: () => void;
}

const Hero: React.FC<HeroProps> = ({ title, subtitle, ctaText, onCtaClick }) => {
  return (
    <div className="py-12 md:py-24 flex flex-col items-center text-center max-w-5xl mx-auto">
      <h1 className="text-4xl md:text-6xl font-bold leading-tight mb-6 animate-fade-up">
        {title}
      </h1>
      <p className="text-xl md:text-2xl text-gray-500 dark:text-gray-400 max-w-3xl mb-8 animate-fade-up animation-delay-100">
        {subtitle}
      </p>
      <Button 
        size="lg" 
        onClick={onCtaClick} 
        className="px-8 py-6 text-lg font-medium animate-fade-up animation-delay-200"
      >
        {ctaText}
      </Button>
    </div>
  );
};

export default Hero;
