
"use client";

import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Logo from '@/components/shared/logo'; // Import your Logo component
import { cn } from '@/lib/utils';

interface PreloaderProps {
  onComplete: () => void;
}

const Preloader: React.FC<PreloaderProps> = ({ onComplete }) => {
  const [step, setStep] = useState(0); // 0: Logo, 1: Site Name, 2: Creator Text
  const [isClient, setIsClient] = useState(false); // State to track client-side execution

  useEffect(() => {
    setIsClient(true); // Component has mounted on the client

    const timeouts = [
      setTimeout(() => setStep(1), 1200), // Show Site Name after 1.2s
      setTimeout(() => setStep(2), 2700), // Show Creator Text after 1.5s (total 2.7s)
      setTimeout(onComplete, 4200),     // Complete after 1.5s (total 4.2s)
    ];

    return () => {
      timeouts.forEach(clearTimeout); // Cleanup timeouts on unmount
    };
  }, [onComplete]);

  const variants = {
    hidden: { opacity: 0, y: 20, scale: 0.8 },
    visible: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.6, ease: 'easeOut' } },
    exit: { opacity: 0, y: -20, scale: 0.8, transition: { duration: 0.4, ease: 'easeIn' } },
  };

  const creatorVariants = {
      hidden: { opacity: 0, y: 20 },
      visible: { opacity: 1, y: 0, transition: { duration: 0.5, delay: 0.1, ease: 'easeOut' } },
      exit: { opacity: 0, y: -20, transition: { duration: 0.3, ease: 'easeIn' } },
  };

  // Render the preloader only if it's running on the client
  if (!isClient) {
    // Optional: Render a static placeholder or nothing during SSR
    return null;
  }

  return (
    <div className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-background overflow-hidden">
      <AnimatePresence mode="wait">
        {step === 0 && (
          <motion.div
            key="logo"
            initial="hidden"
            animate="visible"
            exit="exit"
            variants={variants}
            className="flex flex-col items-center"
          >
            <Logo className="w-20 h-20 md:w-28 md:h-28" /> {/* Larger Logo */}
          </motion.div>
        )}

        {step === 1 && (
          <motion.div
            key="site-name"
            initial="hidden"
            animate="visible"
            exit="exit"
            variants={variants}
            className="flex flex-col items-center"
          >
             <Logo className="w-16 h-16 md:w-20 md:h-20 mb-3" /> {/* Logo remains */}
             <h1 className="text-4xl md:text-5xl font-extrabold text-primary text-glow-primary font-poppins">
               ConnectPro
             </h1>
          </motion.div>
        )}

        {step === 2 && (
           <motion.div
            key="creator"
            initial="hidden"
            animate="visible"
            exit="exit"
            variants={creatorVariants} // Slightly different animation for creator text
            className="flex flex-col items-center"
          >
             {/* Updated text, size, and added glow effect */}
            <p className="text-lg md:text-xl text-muted-foreground font-medium font-sans text-glow-primary">
              An Initiative by Rajdeep Saha
            </p>
          </motion.div>
        )}
      </AnimatePresence>
       {/* Subtle background elements */}
       <div className="absolute top-0 left-0 w-48 h-48 bg-primary/5 rounded-full blur-3xl opacity-30 animate-[spin_15s_linear_infinite_reverse] -translate-x-1/4 -translate-y-1/4"></div>
       <div className="absolute bottom-0 right-0 w-48 h-48 bg-accent/5 rounded-full blur-3xl opacity-30 animate-[spin_20s_linear_infinite] translate-x-1/4 translate-y-1/4"></div>
    </div>
  );
};

export default Preloader;
