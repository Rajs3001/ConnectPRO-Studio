
"use client";

import React from 'react';
import { motion } from 'framer-motion';
import { GraduationCap, Search, Filter, MessageSquare, Video, UserCheck, TrendingUp } from 'lucide-react';
import Link from 'next/link';
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
  const iconClass = "h-7 w-7 md:h-8 md:w-8 transition-colors duration-300"; // Responsive icon size
  const textClass = "text-[10px] md:text-xs font-semibold text-muted-foreground mt-1.5 text-center"; // Responsive text size

  // Adjusted node positions for better alignment within viewBox="0 0 600 250"
  // Increased X separation, slight Y adjustments for clarity
  const nodeRadius = 28; // Approximate radius of the icon container for path offset calculation
  const studentPos = { x: 60, y: 125 };
  const searchPos = { x: 180, y: 70 };
  const filterPos = { x: 180, y: 180 };
  const messagePos = { x: 300, y: 70 };
  const videoPos = { x: 300, y: 180 };
  const professionalPos = { x: 420, y: 125 };
  const growthPos = { x: 540, y: 125 };

  // Function to create curved paths (simplified Bezier)
  const createCurve = (p1: {x: number, y: number}, p2: {x: number, y: number}) => {
    const midX = (p1.x + p2.x) / 2;
    const midY = (p1.y + p2.y) / 2;
    // Control point calculation (adjust curvature here)
    const ctrl1X = midX;
    const ctrl1Y = p1.y;
    const ctrl2X = midX;
    const ctrl2Y = p2.y;
    // Offset start/end points slightly away from node center
    const angle = Math.atan2(p2.y - p1.y, p2.x - p1.x);
    const startX = p1.x + nodeRadius * Math.cos(angle);
    const startY = p1.y + nodeRadius * Math.sin(angle);
    const endX = p2.x - nodeRadius * Math.cos(angle);
    const endY = p2.y - nodeRadius * Math.sin(angle);

    return `M ${startX},${startY} C ${ctrl1X},${ctrl1Y} ${ctrl2X},${ctrl2Y} ${endX},${endY}`;
  };

  // Function for straight line (offset from center)
   const createLine = (p1: {x: number, y: number}, p2: {x: number, y: number}) => {
      const angle = Math.atan2(p2.y - p1.y, p2.x - p1.x);
      const startX = p1.x + nodeRadius * Math.cos(angle);
      const startY = p1.y + nodeRadius * Math.sin(angle);
      const endX = p2.x - nodeRadius * Math.cos(angle);
      const endY = p2.y - nodeRadius * Math.sin(angle);
      return `M ${startX},${startY} L ${endX},${endY}`;
   };

  return (
    <motion.div
      // Removed bg-card background
      className="relative w-full max-w-5xl mx-auto flex items-center justify-center p-4 md:p-8 min-h-[350px] overflow-visible"
      variants={containerVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: false, amount: 0.3 }} // Re-trigger animation on scroll into view
    >
      {/* SVG for lines */}
      <motion.svg
        className="absolute inset-0 w-full h-full"
        viewBox="0 0 600 250" // Maintained viewBox
        preserveAspectRatio="xMidYMid meet"
        style={{ zIndex: 5 }}
      >
        {/* Lines from Student to Search/Filter */}
        <motion.path
           d={createCurve(studentPos, searchPos)}
           stroke="hsl(var(--primary) / 0.4)" strokeWidth="1.5" fill="none"
           variants={lineVariants} custom={0}
           className="transition-all duration-300 hover:stroke-primary hover:stroke-[2px] shadow-glow-primary"
         />
         <motion.path
            d={createCurve(studentPos, filterPos)}
            stroke="hsl(var(--primary) / 0.4)" strokeWidth="1.5" fill="none"
            variants={lineVariants} custom={0.3}
            className="transition-all duration-300 hover:stroke-primary hover:stroke-[2px] shadow-glow-primary"
         />

        {/* Lines from Search/Filter to Message/Video */}
         <motion.path
           d={createLine(searchPos, messagePos)}
           stroke="hsl(var(--primary) / 0.4)" strokeWidth="1.5" fill="none"
           variants={lineVariants} custom={0.6}
           className="transition-all duration-300 hover:stroke-primary hover:stroke-[2px] shadow-glow-primary"
         />
         <motion.path
            d={createLine(filterPos, videoPos)}
            stroke="hsl(var(--primary) / 0.4)" strokeWidth="1.5" fill="none"
            variants={lineVariants} custom={0.9}
            className="transition-all duration-300 hover:stroke-primary hover:stroke-[2px] shadow-glow-primary"
         />

        {/* Lines from Message/Video to Professional */}
        <motion.path
             d={createCurve(messagePos, professionalPos)}
            stroke="hsl(var(--primary) / 0.4)" strokeWidth="1.5" fill="none"
            variants={lineVariants} custom={1.2}
            className="transition-all duration-300 hover:stroke-primary hover:stroke-[2px] shadow-glow-primary"
        />
         <motion.path
             d={createCurve(videoPos, professionalPos)}
           stroke="hsl(var(--primary) / 0.4)" strokeWidth="1.5" fill="none"
           variants={lineVariants} custom={1.5}
           className="transition-all duration-300 hover:stroke-primary hover:stroke-[2px] shadow-glow-primary"
         />

        {/* Line from Professional to Growth */}
        <motion.path
          d={createLine(professionalPos, growthPos)}
          stroke="hsl(var(--accent) / 0.6)"
          strokeWidth="1.5"
          strokeDasharray="4 2"
          fill="none"
          variants={lineVariants}
          custom={1.8}
          className="transition-all duration-300 hover:stroke-accent hover:stroke-[2px] shadow-glow-accent"
        />
      </motion.svg>

      {/* Nodes - Positioned absolutely */}
      {/* Node positions adjusted to match SVG viewBox coordinates */}
       <motion.div
           className="absolute flex flex-col items-center text-center z-10 cursor-pointer group w-auto min-w-16 md:min-w-20"
           style={{ left: `${(studentPos.x / 600) * 100}%`, top: `${(studentPos.y / 250) * 100}%`, transform: 'translate(-50%, -50%)' }}
           variants={itemVariants}
        >
         <Link href="#step-student" aria-label="Go to Student Step Description">
           {/* Use transparent background for icon container */}
            <div className={cn(`${iconBgClass} bg-background/70 border-blue-500/30 group-hover:bg-blue-500/20 group-hover:border-blue-500/50 group-hover:shadow-glow-primary`)}>
              <GraduationCap className={`${iconClass} text-blue-500 group-hover:text-blue-400`} />
            </div>
            <span className={textClass}>User</span>
         </Link>
       </motion.div>

       <motion.div
          className="absolute flex flex-col items-center text-center z-10 cursor-pointer group w-auto min-w-16 md:min-w-20"
          style={{ left: `${(searchPos.x / 600) * 100}%`, top: `${(searchPos.y / 250) * 100}%`, transform: 'translate(-50%, -50%)' }}
          variants={itemVariants}
        >
          <Link href="#step-find" aria-label="Go to Find Professional Step Description">
             {/* Use transparent background */}
             <div className={cn(`${iconBgClass} bg-background/70 border-purple-500/30 group-hover:bg-purple-500/20 group-hover:border-purple-500/50 group-hover:shadow-glow-primary`)}>
               <Search className={`${iconClass} text-purple-500 group-hover:text-purple-400`} />
             </div>
             <span className={textClass}>Find</span>
           </Link>
       </motion.div>

       <motion.div
          className="absolute flex flex-col items-center text-center z-10 cursor-pointer group w-auto min-w-16 md:min-w-20"
           style={{ left: `${(filterPos.x / 600) * 100}%`, top: `${(filterPos.y / 250) * 100}%`, transform: 'translate(-50%, -50%)' }}
          variants={itemVariants}
        >
           <Link href="#step-find" aria-label="Go to Filter Professional Step Description">
              {/* Use transparent background */}
             <div className={cn(`${iconBgClass} bg-background/70 border-orange-500/30 group-hover:bg-orange-500/20 group-hover:border-orange-500/50 group-hover:shadow-glow-primary`)}>
               <Filter className={`${iconClass} text-orange-500 group-hover:text-orange-400`} />
             </div>
             <span className={textClass}>Filter</span>
           </Link>
       </motion.div>

       <motion.div
         className="absolute flex flex-col items-center text-center z-10 cursor-pointer group w-auto min-w-16 md:min-w-20"
         style={{ left: `${(messagePos.x / 600) * 100}%`, top: `${(messagePos.y / 250) * 100}%`, transform: 'translate(-50%, -50%)' }}
         variants={itemVariants}
        >
         <Link href="#step-connect" aria-label="Go to Connect Step Description">
             {/* Use transparent background */}
             <div className={cn(`${iconBgClass} bg-background/70 border-yellow-500/30 group-hover:bg-yellow-500/20 group-hover:border-yellow-500/50 group-hover:shadow-glow-primary`)}>
              <MessageSquare className={`${iconClass} text-yellow-500 group-hover:text-yellow-400`} />
            </div>
            <span className={textClass}>Chat</span>
          </Link>
       </motion.div>

       <motion.div
         className="absolute flex flex-col items-center text-center z-10 cursor-pointer group w-auto min-w-[80px] md:min-w-[90px]" // Increased min-width for longer text
         style={{ left: `${(videoPos.x / 600) * 100}%`, top: `${(videoPos.y / 250) * 100}%`, transform: 'translate(-50%, -50%)' }}
         variants={itemVariants}
        >
          <Link href="#step-connect" aria-label="Go to Video Call Step Description">
             {/* Use transparent background */}
             <div className={cn(`${iconBgClass} bg-background/70 border-red-500/30 group-hover:bg-red-500/20 group-hover:border-red-500/50 group-hover:shadow-glow-primary`)}>
               <Video className={`${iconClass} text-red-500 group-hover:text-red-400`} />
             </div>
             <span className={textClass}>Video Call</span>
           </Link>
       </motion.div>

       <motion.div
         className="absolute flex flex-col items-center text-center z-10 cursor-pointer group w-auto min-w-[80px] md:min-w-[90px]" // Increased min-width for longer text
         style={{ left: `${(professionalPos.x / 600) * 100}%`, top: `${(professionalPos.y / 250) * 100}%`, transform: 'translate(-50%, -50%)' }}
         variants={itemVariants}
        >
          <Link href="#step-professional" aria-label="Go to Professional Interaction Step Description">
             {/* Use transparent background */}
             <div className={cn(`${iconBgClass} bg-background/70 border-indigo-500/30 group-hover:bg-indigo-500/20 group-hover:border-indigo-500/50 group-hover:shadow-glow-primary`)}>
               <UserCheck className={`${iconClass} text-indigo-500 group-hover:text-indigo-400`} />
             </div>
             <span className={textClass}>Professional</span>
           </Link>
       </motion.div>

      <motion.div
         className="absolute flex flex-col items-center text-center z-10 cursor-pointer group w-auto min-w-16 md:min-w-20"
         style={{ left: `${(growthPos.x / 600) * 100}%`, top: `${(growthPos.y / 250) * 100}%`, transform: 'translate(-50%, -50%)' }}
         variants={itemVariants}
        >
           <Link href="#step-growth" aria-label="Go to Growth Step Description">
              {/* Use transparent background */}
             <div className={cn(`${iconBgClass} bg-background/70 border-green-500/30 group-hover:bg-green-500/20 group-hover:border-green-500/50 group-hover:shadow-glow-accent`)}>
              <TrendingUp className={`${iconClass} text-green-500 group-hover:text-green-400`} />
            </div>
            <span className={textClass}>Growth</span>
          </Link>
       </motion.div>

    </motion.div>
  );
};

export default ConnectionAnimation;


    