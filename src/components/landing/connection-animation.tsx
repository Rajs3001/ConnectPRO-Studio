
"use client";

import React from 'react';
import { motion } from 'framer-motion';
import { GraduationCap, Search, Filter, MessageSquare, Video, UserCheck, TrendingUp } from 'lucide-react';

const ConnectionAnimation: React.FC = () => {
  // Define animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2, // Faster staggering
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

  const iconBgClass = "p-3 rounded-full border shadow-md";
  const iconClass = "h-8 w-8";
  const textClass = "text-xs font-semibold text-muted-foreground mt-1.5";

  // Define node positions (adjust as needed for responsiveness / final look)
  // These are relative percentages for SVG viewBox 0 0 500 200
  const studentPos = { x: 50, y: 100 };
  const searchPos = { x: 150, y: 40 };
  const filterPos = { x: 150, y: 160 };
  const messagePos = { x: 270, y: 40 };
  const videoPos = { x: 270, y: 160 };
  const professionalPos = { x: 380, y: 100 };
  const growthPos = { x: 470, y: 100 };

  return (
    <motion.div
      className="relative flex items-center justify-center p-8 bg-card/60 rounded-lg shadow-inner border border-border/40 min-h-[300px] overflow-hidden"
      variants={containerVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.3 }}
    >
      {/* SVG for lines */}
      <motion.svg
        className="absolute inset-0 w-full h-full"
        viewBox="0 0 500 200" // Updated viewBox
        preserveAspectRatio="xMidYMid meet"
        style={{ zIndex: 5 }}
      >
        {/* Lines from Student to Search/Filter */}
        <motion.path d={`M ${studentPos.x + 20},${studentPos.y} C ${studentPos.x + 50},${studentPos.y} ${searchPos.x - 50},${searchPos.y} ${searchPos.x - 20},${searchPos.y}`} stroke="hsl(var(--primary) / 0.4)" strokeWidth="1.5" fill="none" variants={lineVariants} custom={0} />
        <motion.path d={`M ${studentPos.x + 20},${studentPos.y} C ${studentPos.x + 50},${studentPos.y} ${filterPos.x - 50},${filterPos.y} ${filterPos.x - 20},${filterPos.y}`} stroke="hsl(var(--primary) / 0.4)" strokeWidth="1.5" fill="none" variants={lineVariants} custom={0.3} />

        {/* Lines from Search/Filter to Message/Video */}
        <motion.path d={`M ${searchPos.x + 20},${searchPos.y} C ${searchPos.x + 30},${searchPos.y} ${messagePos.x - 30},${messagePos.y} ${messagePos.x - 20},${messagePos.y}`} stroke="hsl(var(--primary) / 0.4)" strokeWidth="1.5" fill="none" variants={lineVariants} custom={0.6} />
        <motion.path d={`M ${filterPos.x + 20},${filterPos.y} C ${filterPos.x + 30},${filterPos.y} ${videoPos.x - 30},${videoPos.y} ${videoPos.x - 20},${videoPos.y}`} stroke="hsl(var(--primary) / 0.4)" strokeWidth="1.5" fill="none" variants={lineVariants} custom={0.9} />

        {/* Lines from Message/Video to Professional */}
        <motion.path d={`M ${messagePos.x + 20},${messagePos.y} C ${messagePos.x + 30},${messagePos.y} ${professionalPos.x - 50},${professionalPos.y} ${professionalPos.x - 20},${professionalPos.y}`} stroke="hsl(var(--primary) / 0.4)" strokeWidth="1.5" fill="none" variants={lineVariants} custom={1.2} />
        <motion.path d={`M ${videoPos.x + 20},${videoPos.y} C ${videoPos.x + 30},${videoPos.y} ${professionalPos.x - 50},${professionalPos.y} ${professionalPos.x - 20},${professionalPos.y}`} stroke="hsl(var(--primary) / 0.4)" strokeWidth="1.5" fill="none" variants={lineVariants} custom={1.5} />

        {/* Line from Professional to Growth */}
        <motion.line
          x1={professionalPos.x + 20} y1={professionalPos.y}
          x2={growthPos.x - 20} y2={growthPos.y}
          stroke="hsl(var(--accent) / 0.6)"
          strokeWidth="1.5"
          strokeDasharray="4 2"
          variants={lineVariants}
          custom={1.8}
        />
      </motion.svg>

      {/* Nodes */}
      <div className="absolute flex flex-col items-center text-center z-10" style={{ left: `${studentPos.x / 5}%`, top: `${studentPos.y / 2}%`, transform: 'translate(-50%, -50%)' }}>
        <motion.div className={`${iconBgClass} bg-blue-500/10 border-blue-500/30`} variants={itemVariants}>
          <GraduationCap className={`${iconClass} text-blue-500`} />
        </motion.div>
        <motion.span className={textClass} variants={itemVariants}>Student</motion.span>
      </div>

       <div className="absolute flex flex-col items-center text-center z-10" style={{ left: `${searchPos.x / 5}%`, top: `${searchPos.y / 2}%`, transform: 'translate(-50%, -50%)' }}>
        <motion.div className={`${iconBgClass} bg-purple-500/10 border-purple-500/30`} variants={itemVariants}>
          <Search className={`${iconClass} text-purple-500`} />
        </motion.div>
         <motion.span className={textClass} variants={itemVariants}>Search</motion.span>
      </div>

       <div className="absolute flex flex-col items-center text-center z-10" style={{ left: `${filterPos.x / 5}%`, top: `${filterPos.y / 2}%`, transform: 'translate(-50%, -50%)' }}>
         <motion.div className={`${iconBgClass} bg-orange-500/10 border-orange-500/30`} variants={itemVariants}>
           <Filter className={`${iconClass} text-orange-500`} />
         </motion.div>
         <motion.span className={textClass} variants={itemVariants}>Filter</motion.span>
       </div>

      <div className="absolute flex flex-col items-center text-center z-10" style={{ left: `${messagePos.x / 5}%`, top: `${messagePos.y / 2}%`, transform: 'translate(-50%, -50%)' }}>
        <motion.div className={`${iconBgClass} bg-yellow-500/10 border-yellow-500/30`} variants={itemVariants}>
          <MessageSquare className={`${iconClass} text-yellow-500`} />
        </motion.div>
        <motion.span className={textClass} variants={itemVariants}>Chat</motion.span>
      </div>

       <div className="absolute flex flex-col items-center text-center z-10" style={{ left: `${videoPos.x / 5}%`, top: `${videoPos.y / 2}%`, transform: 'translate(-50%, -50%)' }}>
        <motion.div className={`${iconBgClass} bg-red-500/10 border-red-500/30`} variants={itemVariants}>
          <Video className={`${iconClass} text-red-500`} />
        </motion.div>
         <motion.span className={textClass} variants={itemVariants}>Video Call</motion.span>
      </div>

      <div className="absolute flex flex-col items-center text-center z-10" style={{ left: `${professionalPos.x / 5}%`, top: `${professionalPos.y / 2}%`, transform: 'translate(-50%, -50%)' }}>
        <motion.div className={`${iconBgClass} bg-indigo-500/10 border-indigo-500/30`} variants={itemVariants}>
          <UserCheck className={`${iconClass} text-indigo-500`} />
        </motion.div>
        <motion.span className={textClass} variants={itemVariants}>Professional</motion.span>
      </div>

      <div className="absolute flex flex-col items-center text-center z-10" style={{ left: `${growthPos.x / 5}%`, top: `${growthPos.y / 2}%`, transform: 'translate(-50%, -50%)' }}>
        <motion.div className={`${iconBgClass} bg-green-500/10 border-green-500/30`} variants={itemVariants}>
          <TrendingUp className={`${iconClass} text-green-500`} />
        </motion.div>
         <motion.span className={textClass} variants={itemVariants}>Growth</motion.span>
      </div>

    </motion.div>
  );
};

export default ConnectionAnimation;
