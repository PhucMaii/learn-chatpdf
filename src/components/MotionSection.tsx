import React from 'react';
import { m } from 'framer-motion';
import { useReducedMotion } from '@/hooks/use-mobile';

const MotionSection = ({ children }: { children: React.ReactNode }) => {
  const prefersReducedMotion = useReducedMotion();

  // Check if user is on mobile (simple check)
  const isMobile = typeof window !== 'undefined' && window.innerWidth < 768;

  if (prefersReducedMotion || isMobile) {
    return <div>{children}</div>;
  }

  return (
    <m.div
      initial={{ opacity: 0, y: 10 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ 
        duration: 0.3, 
        ease: 'easeOut',
        delay: 0.05 
      }}
      viewport={{ 
        once: true,
        margin: "-20px"
      }}
    >
      {children}
    </m.div>
  );
};

export default MotionSection;
