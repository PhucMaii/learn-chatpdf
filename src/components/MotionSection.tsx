import React from 'react';
import { m } from 'framer-motion';
import { useReducedMotion } from '@/hooks/use-mobile';

const MotionSection = ({ children }: { children: React.ReactNode }) => {
  const prefersReducedMotion = useReducedMotion();

  if (prefersReducedMotion) {
    return <div>{children}</div>;
  }

  return (
    <m.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ 
        duration: 0.5, 
        ease: 'easeOut',
        delay: 0.1 
      }}
      viewport={{ 
        once: true,
        margin: "-50px"
      }}
    >
      {children}
    </m.div>
  );
};

export default MotionSection;
