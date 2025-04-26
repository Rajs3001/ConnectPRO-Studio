
"use client";

import React from 'react';
import { motion } from 'framer-motion';
import Logo from '@/components/shared/logo';

const Preloader: React.FC = () => {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { duration: 0.5 } },
    exit: { opacity: 0, transition: { duration: 0.5, delay: 2.8 } }, // Total duration approx 3.3s before exit starts
  };

  const logoVariants = {
    hidden: { scale: 0.5, opacity: 0 },
    visible: { scale: 1, opacity: 1, transition: { duration: 0.8, ease: 'easeOut' } },
    exit: { scale: 0.8, opacity: 0, transition: { duration: 0.5 } },
  };

  const nameVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1, transition: { duration: 0.8, delay: 0.5, ease: 'easeOut' } },
    exit: { y: -10, opacity: 0, transition: { duration: 0.5 } },
  };

  const initiativeVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1, transition: { duration: 0.8, delay: 1.8, ease: 'easeOut' } }, // Delay after logo/name exit starts
    exit: { y: 0, opacity: 0, transition: { duration: 0.5, delay: 0.5 } }, // Delay before final exit
  };

  return (
    <motion.div
      className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-background pointer-events-none"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      exit="exit"
      data-testid="preloader-container"
    >
      {/* Stage 1 & 2: Logo and Name */}
       <motion.div
          className="flex flex-col items-center justify-center"
          initial="visible" // Start visible
          animate="visible"
          exit="exit" // Exit when initiative text appears
          data-testid="preloader-logo-name-stage"
       >
        <motion.div variants={logoVariants} data-testid="preloader-logo">
          <Logo className="h-20 w-20 md:h-28 md:w-28 text-primary" />
        </motion.div>
        <motion.h1
          className="mt-4 text-3xl md:text-4xl font-bold font-poppins text-glow-primary"
          variants={nameVariants}
          data-testid="preloader-app-name"
        >
          ConnectPro
        </motion.h1>
       </motion.div>

      {/* Stage 3: Initiative Text */}
       <motion.div
          className="absolute bottom-10" // Positioned at the bottom
          variants={initiativeVariants}
          data-testid="preloader-initiative-stage"
        >
        <p className="text-lg md:text-xl font-medium text-primary text-glow-primary font-poppins" data-testid="preloader-initiative-text">
          An Initiative by Rajdeep Saha
        </p>
       </motion.div>
    </motion.div>
  );
};

export default Preloader;
