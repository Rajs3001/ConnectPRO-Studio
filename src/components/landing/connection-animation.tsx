
"use client";

import React from 'react';
import { motion } from 'framer-motion'; // Assuming Framer Motion is installed
import { GraduationCap, Briefcase, MessageSquare, Video, TrendingUp } from 'lucide-react';

const ConnectionAnimation: React.FC = () => {
  // Define animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.3,
        delayChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1, transition: { type: 'spring', stiffness: 100 } },
  };

  const lineVariants = {
    hidden: { pathLength: 0, opacity: 0 },
    visible: (i: number) => ({
      pathLength: 1,
      opacity: 1,
      transition: {
        pathLength: { delay: i * 0.4 + 0.5, type: "tween", duration: 0.8, ease: "easeInOut" },
        opacity: { delay: i * 0.4 + 0.5, duration: 0.01 }
      }
    })
  };

  return (
    <motion.div
      className="relative flex flex-col md:flex-row items-center justify-around p-8 bg-card/50 rounded-lg shadow-inner border border-border/40 min-h-[300px] overflow-hidden"
      variants={containerVariants}
      initial="hidden"
      whileInView="visible" // Trigger animation when in view
      viewport={{ once: true, amount: 0.3 }} // Adjust viewport settings as needed
    >
      {/* Student Node */}
      <motion.div
        className="flex flex-col items-center text-center mb-8 md:mb-0 z-10"
        variants={itemVariants}
      >
        <div className="p-4 bg-blue-500/20 rounded-full border border-blue-500/50 shadow-lg mb-2">
          <GraduationCap className="h-10 w-10 text-blue-400" />
        </div>
        <span className="font-semibold text-sm">Student</span>
        <p className="text-xs text-muted-foreground">Seeking Guidance</p>
      </motion.div>

      {/* Connection Elements (Lines & Icons) - SVG for lines */}
      <motion.svg
        className="absolute inset-0 w-full h-full"
        viewBox="0 0 400 200" // Adjust viewBox based on desired layout proportions
        preserveAspectRatio="xMidYMid meet"
        style={{ zIndex: 5 }} // Ensure lines are behind nodes if needed, but above background
      >
         {/* Line from Student to Chat/Video */}
        <motion.line
          x1="100" y1="100" x2="180" y2="60" // Adjust coordinates
          stroke="hsl(var(--primary) / 0.5)"
          strokeWidth="1.5"
          variants={lineVariants}
          custom={0} // Delay index
        />
         <motion.line
          x1="100" y1="100" x2="180" y2="140" // Adjust coordinates
          stroke="hsl(var(--primary) / 0.5)"
          strokeWidth="1.5"
          variants={lineVariants}
          custom={0.5} // Delay index
        />

        {/* Line from Chat/Video to Professional */}
         <motion.line
          x1="220" y1="60" x2="300" y2="100" // Adjust coordinates
          stroke="hsl(var(--primary) / 0.5)"
          strokeWidth="1.5"
          variants={lineVariants}
          custom={1} // Delay index
        />
         <motion.line
          x1="220" y1="140" x2="300" y2="100" // Adjust coordinates
          stroke="hsl(var(--primary) / 0.5)"
          strokeWidth="1.5"
          variants={lineVariants}
          custom={1.5} // Delay index
        />

         {/* Line from Professional to Growth */}
        <motion.line
          x1="300" y1="100" x2="360" y2="100" // Adjust coordinates (Example - might need adjustment)
          stroke="hsl(var(--accent) / 0.6)"
          strokeWidth="1.5"
          strokeDasharray="4 2"
          variants={lineVariants}
          custom={2} // Delay index
        />
      </motion.svg>


      {/* Interaction Icons (Positioned relative to container) */}
        <motion.div
            className="absolute top-[30%] left-1/2 transform -translate-x-[60px] -translate-y-1/2 z-10" // Adjust positioning
            variants={itemVariants}
          >
            <div className="p-2 bg-yellow-500/20 rounded-full border border-yellow-500/50 shadow">
              <MessageSquare className="h-5 w-5 text-yellow-400" />
            </div>
          </motion.div>
          <motion.div
            className="absolute bottom-[30%] left-1/2 transform -translate-x-[60px] translate-y-1/2 z-10" // Adjust positioning
            variants={itemVariants}
          >
            <div className="p-2 bg-red-500/20 rounded-full border border-red-500/50 shadow">
              <Video className="h-5 w-5 text-red-400" />
            </div>
        </motion.div>


      {/* Professional Node */}
      <motion.div
        className="flex flex-col items-center text-center my-8 md:my-0 z-10"
        variants={itemVariants}
      >
        <div className="p-4 bg-purple-500/20 rounded-full border border-purple-500/50 shadow-lg mb-2">
          <Briefcase className="h-10 w-10 text-purple-400" />
        </div>
        <span className="font-semibold text-sm">Professional</span>
        <p className="text-xs text-muted-foreground">Sharing Expertise</p>
      </motion.div>

       {/* Growth/Outcome Icon (Positioned relative to container) */}
        <motion.div
            className="absolute top-1/2 right-[5%] md:right-[10%] transform -translate-y-1/2 z-10" // Adjust positioning
            variants={itemVariants}
          >
            <div className="p-3 bg-green-500/20 rounded-full border border-green-500/50 shadow-lg">
              <TrendingUp className="h-7 w-7 text-green-500" />
            </div>
        </motion.div>

    </motion.div>
  );
};

export default ConnectionAnimation;
