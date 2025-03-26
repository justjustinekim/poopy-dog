
import { useEffect, useState } from "react";

// Intersection Observer to trigger animations when element is in view
export const useInView = (options?: IntersectionObserverInit) => {
  const [ref, setRef] = useState<HTMLElement | null>(null);
  const [isInView, setIsInView] = useState(false);

  useEffect(() => {
    if (!ref) return;

    const observer = new IntersectionObserver(([entry]) => {
      setIsInView(entry.isIntersecting);
    }, {
      threshold: 0.1,
      ...options
    });

    observer.observe(ref);
    
    return () => {
      observer.disconnect();
    };
  }, [ref, options]);

  return { ref: setRef, isInView };
};

// Animation variants for staggered children
export const staggerContainer = (staggerChildren: number, delayChildren: number = 0) => ({
  hidden: {},
  show: {
    transition: {
      staggerChildren,
      delayChildren
    }
  }
});

// Generate CSS class based on animation state
export const getAnimationClass = (
  isInView: boolean, 
  animation: string = 'fade-in', 
  delay: number = 0
): string => {
  if (!isInView) return 'opacity-0';
  
  const delayClass = delay > 0 ? `delay-[${delay}ms]` : '';
  return `animate-${animation} ${delayClass}`;
};

// Add smooth page transitions
export const pageTransition = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -20 }
};
