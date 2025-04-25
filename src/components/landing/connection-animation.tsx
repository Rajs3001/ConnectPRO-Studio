
"use client";

import React from 'react';
import { motion } from 'framer-motion';
import { GraduationCap, Search, Filter, MessageSquare, Video, UserCheck, TrendingUp } from 'lucide-react';
import Link from 'next/link'; // Import Link for internal navigation
import { cn } from '@/lib/utils';

const ConnectionAnimation: React.FC = () => {
  // Define animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        delayChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { y: 15, opacity: 0, scale: 0.9 },
    visible: { y: 0, opacity: 1, scale: 1, transition: { type: 'spring', stiffness: 120, damping: 10 } },
  };

  const lineVariants = {
    hidden: { pathLength: 0, opacity: 0 },
    visible: (i: number) => ({
      pathLength: 1,
      opacity: 1,
      transition: {
        pathLength: { delay: i * 0.3 + 0.4, type: "tween", duration: 0.6, ease: "easeInOut" },
        opacity: { delay: i * 0.3 + 0.4, duration: 0.01 }
      }
    })
  };

  const iconBgClass = "p-3 rounded-full border shadow-md transition-all duration-300 hover:scale-110 hover:shadow-lg"; // Added hover effects
  const iconClass = "h-8 w-8 transition-colors duration-300"; // Added transition
  const textClass = "text-xs font-semibold text-muted-foreground mt-1.5";

  // Adjusted node positions (relative percentages for SVG viewBox 0 0 500 200)
  const nodeSize = 40; // Approximate icon container size for path calculation
  const studentPos = { x: 50, y: 100 };
  const searchPos = { x: 160, y: 45 }; // Adjusted
  const filterPos = { x: 160, y: 155 }; // Adjusted
  const messagePos = { x: 280, y: 45 }; // Adjusted
  const videoPos = { x: 280, y: 155 }; // Adjusted
  const professionalPos = { x: 390, y: 100 }; // Adjusted
  const growthPos = { x: 470, y: 100 };

  // Calculate path end/start points closer to icon centers/edges
  const pathOffset = nodeSize / 3; // Offset from center to edge

  return (
    <motion.div
      // Removed card background and adjusted styling
      className="relative flex items-center justify-center p-4 md:p-8 min-h-[300px] overflow-hidden"
      key={Date.now()} // Add key to force re-render on view, triggering animation
      variants={containerVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: false, amount: 0.3 }} // once: false to trigger animation everytime it enters viewport
    >
      {/* SVG for lines */}
      <motion.svg
        className="absolute inset-0 w-full h-full"
        viewBox="0 0 500 200" // Maintained viewBox for coordinate system
        preserveAspectRatio="xMidYMid meet"
        style={{ zIndex: 5 }}
      >
        {/* Lines from Student to Search/Filter */}
        <motion.path
           d={`M ${studentPos.x + pathOffset},${studentPos.y} C ${studentPos.x + 50},${studentPos.y} ${searchPos.x - 50},${searchPos.y} ${searchPos.x - pathOffset},${searchPos.y}`}
           stroke="hsl(var(--primary) / 0.4)" strokeWidth="1.5" fill="none"
           variants={lineVariants} custom={0}
           className="transition-all duration-300 hover:stroke-primary hover:stroke-[2px] shadow-glow-primary" // Neon effect on hover
         />
         <motion.path
            d={`M ${studentPos.x + pathOffset},${studentPos.y} C ${studentPos.x + 50},${studentPos.y} ${filterPos.x - 50},${filterPos.y} ${filterPos.x - pathOffset},${filterPos.y}`}
            stroke="hsl(var(--primary) / 0.4)" strokeWidth="1.5" fill="none"
            variants={lineVariants} custom={0.3}
            className="transition-all duration-300 hover:stroke-primary hover:stroke-[2px] shadow-glow-primary"
         />

        {/* Lines from Search/Filter to Message/Video */}
         <motion.path
           d={`M ${searchPos.x + pathOffset},${searchPos.y} C ${searchPos.x + 30},${searchPos.y} ${messagePos.x - 30},${messagePos.y} ${messagePos.x - pathOffset},${messagePos.y}`}
           stroke="hsl(var(--primary) / 0.4)" strokeWidth="1.5" fill="none"
           variants={lineVariants} custom={0.6}
           className="transition-all duration-300 hover:stroke-primary hover:stroke-[2px] shadow-glow-primary"
         />
         <motion.path
            d={`M ${filterPos.x + pathOffset},${filterPos.y} C ${filterPos.x + 30},${filterPos.y} ${videoPos.x - 30},${videoPos.y} ${videoPos.x - pathOffset},${videoPos.y}`}
            stroke="hsl(var(--primary) / 0.4)" strokeWidth="1.5" fill="none"
            variants={lineVariants} custom={0.9}
            className="transition-all duration-300 hover:stroke-primary hover:stroke-[2px] shadow-glow-primary"
         />

        {/* Lines from Message/Video to Professional */}
        <motion.path
            d={`M ${messagePos.x + pathOffset},${messagePos.y} C ${messagePos.x + 30},${messagePos.y} ${professionalPos.x - 50},${professionalPos.y} ${professionalPos.x - pathOffset},${professionalPos.y}`}
            stroke="hsl(var(--primary) / 0.4)" strokeWidth="1.5" fill="none"
            variants={lineVariants} custom={1.2}
            className="transition-all duration-300 hover:stroke-primary hover:stroke-[2px] shadow-glow-primary"
        />
         <motion.path
           d={`M ${videoPos.x + pathOffset},${videoPos.y} C ${videoPos.x + 30},${videoPos.y} ${professionalPos.x - 50},${professionalPos.y} ${professionalPos.x - pathOffset},${professionalPos.y}`}
           stroke="hsl(var(--primary) / 0.4)" strokeWidth="1.5" fill="none"
           variants={lineVariants} custom={1.5}
           className="transition-all duration-300 hover:stroke-primary hover:stroke-[2px] shadow-glow-primary"
         />

        {/* Line from Professional to Growth */}
        <motion.line
          x1={professionalPos.x + pathOffset} y1={professionalPos.y}
          x2={growthPos.x - pathOffset} y2={growthPos.y}
          stroke="hsl(var(--accent) / 0.6)"
          strokeWidth="1.5"
          strokeDasharray="4 2"
          variants={lineVariants}
          custom={1.8}
          className="transition-all duration-300 hover:stroke-accent hover:stroke-[2px] shadow-glow-accent"
        />
      </motion.svg>

      {/* Nodes - Wrapped with Link - Use percentages for positioning */}
      <motion.div
          className="absolute flex flex-col items-center text-center z-10 cursor-pointer group"
          // Adjusted positioning using percentages relative to the container
          style={{ left: `${studentPos.x / 5}%`, top: `${studentPos.y / 2}%`, transform: 'translate(-50%, -50%)' }}
          variants={itemVariants}
       >
         <Link href="#step-student" aria-label="Go to Student Step Description">
            <div className={cn(`${iconBgClass} bg-blue-500/10 border-blue-500/30 group-hover:bg-blue-500/20 group-hover:border-blue-500/50 group-hover:shadow-glow-primary`)}>
              <GraduationCap className={`${iconClass} text-blue-500 group-hover:text-blue-400`} />
            </div>
            <span className={textClass}>Student</span>
         </Link>
      </motion.div>


       <motion.div
          className="absolute flex flex-col items-center text-center z-10 cursor-pointer group"
          style={{ left: `${searchPos.x / 5}%`, top: `${searchPos.y / 2}%`, transform: 'translate(-50%, -50%)' }}
          variants={itemVariants}
        >
          <Link href="#step-find" aria-label="Go to Find Professional Step Description">
             <div className={cn(`${iconBgClass} bg-purple-500/10 border-purple-500/30 group-hover:bg-purple-500/20 group-hover:border-purple-500/50 group-hover:shadow-glow-primary`)}>
               <Search className={`${iconClass} text-purple-500 group-hover:text-purple-400`} />
             </div>
             <span className={textClass}>Find</span>
           </Link>
       </motion.div>

       <motion.div
          className="absolute flex flex-col items-center text-center z-10 cursor-pointer group"
           style={{ left: `${filterPos.x / 5}%`, top: `${filterPos.y / 2}%`, transform: 'translate(-50%, -50%)' }}
          variants={itemVariants}
        >
           <Link href="#step-find" aria-label="Go to Filter Professional Step Description"> {/* Links to same section as Search */}
             <div className={cn(`${iconBgClass} bg-orange-500/10 border-orange-500/30 group-hover:bg-orange-500/20 group-hover:border-orange-500/50 group-hover:shadow-glow-primary`)}>
               <Filter className={`${iconClass} text-orange-500 group-hover:text-orange-400`} />
             </div>
             <span className={textClass}>Filter</span>
           </Link>
       </motion.div>

       <motion.div
         className="absolute flex flex-col items-center text-center z-10 cursor-pointer group"
         style={{ left: `${messagePos.x / 5}%`, top: `${messagePos.y / 2}%`, transform: 'translate(-50%, -50%)' }}
         variants={itemVariants}
        >
         <Link href="#step-connect" aria-label="Go to Connect Step Description">
             <div className={cn(`${iconBgClass} bg-yellow-500/10 border-yellow-500/30 group-hover:bg-yellow-500/20 group-hover:border-yellow-500/50 group-hover:shadow-glow-primary`)}>
              <MessageSquare className={`${iconClass} text-yellow-500 group-hover:text-yellow-400`} />
            </div>
            <span className={textClass}>Connect</span>
          </Link>
       </motion.div>

       <motion.div
         className="absolute flex flex-col items-center text-center z-10 cursor-pointer group"
         style={{ left: `${videoPos.x / 5}%`, top: `${videoPos.y / 2}%`, transform: 'translate(-50%, -50%)' }}
         variants={itemVariants}
        >
          <Link href="#step-connect" aria-label="Go to Video Call Step Description"> {/* Links to same section as Chat */}
             <div className={cn(`${iconBgClass} bg-red-500/10 border-red-500/30 group-hover:bg-red-500/20 group-hover:border-red-500/50 group-hover:shadow-glow-primary`)}>
               <Video className={`${iconClass} text-red-500 group-hover:text-red-400`} />
             </div>
             <span className={textClass}>Video Call</span>
           </Link>
       </motion.div>

       <motion.div
         className="absolute flex flex-col items-center text-center z-10 cursor-pointer group"
         style={{ left: `${professionalPos.x / 5}%`, top: `${professionalPos.y / 2}%`, transform: 'translate(-50%, -50%)' }}
         variants={itemVariants}
        >
          <Link href="#step-professional" aria-label="Go to Professional Interaction Step Description">
             <div className={cn(`${iconBgClass} bg-indigo-500/10 border-indigo-500/30 group-hover:bg-indigo-500/20 group-hover:border-indigo-500/50 group-hover:shadow-glow-primary`)}>
               <UserCheck className={`${iconClass} text-indigo-500 group-hover:text-indigo-400`} />
             </div>
             <span className={textClass}>Professional</span>
           </Link>
       </motion.div>

      <motion.div
         className="absolute flex flex-col items-center text-center z-10 cursor-pointer group"
         style={{ left: `${growthPos.x / 5}%`, top: `${growthPos.y / 2}%`, transform: 'translate(-50%, -50%)' }}
         variants={itemVariants}
        >
           <Link href="#step-growth" aria-label="Go to Growth Step Description">
             <div className={cn(`${iconBgClass} bg-green-500/10 border-green-500/30 group-hover:bg-green-500/20 group-hover:border-green-500/50 group-hover:shadow-glow-accent`)}>
              <TrendingUp className={`${iconClass} text-green-500 group-hover:text-green-400`} />
            </div>
            <span className={textClass}>Growth</span>
          </Link>
       </motion.div>

    </motion.div>
  );
};

export default ConnectionAnimation;

    