import React from 'react';
import { motion } from 'framer-motion';

const orbs = [
  {
    size: 'w-40 h-40',
    top: 'top-10',
    left: 'left-10',
    color: 'from-primary/40 via-accent/30 to-white/20',
    blur: 'blur-2xl',
    delay: 0,
  },
  {
    size: 'w-32 h-32',
    top: 'top-1/2',
    left: 'left-1/4',
    color: 'from-accent/40 via-primary/30 to-white/10',
    blur: 'blur-xl',
    delay: 0.2,
  },
  {
    size: 'w-52 h-52',
    top: 'top-1/3',
    left: 'left-2/3',
    color: 'from-primary/30 via-accent/40 to-white/20',
    blur: 'blur-3xl',
    delay: 0.4,
  },
  {
    size: 'w-24 h-24',
    top: 'top-2/3',
    left: 'left-3/4',
    color: 'from-accent/30 via-primary/20 to-white/20',
    blur: 'blur-lg',
    delay: 0.6,
  },
];

export default function Animated3DOrbs() {
  return (
    <div className="pointer-events-none absolute inset-0 -z-10">
      {orbs.map((orb, i) => (
        <motion.div
          key={i}
          className={`absolute ${orb.size} ${orb.top} ${orb.left} rounded-full bg-gradient-to-br ${orb.color} ${orb.blur} opacity-60`}
          initial={{ y: 0, scale: 1 }}
          animate={{
            y: [0, -20, 0, 20, 0],
            scale: [1, 1.1, 1, 0.95, 1],
          }}
          transition={{
            duration: 8 + i * 2,
            repeat: Infinity,
            repeatType: 'loop',
            delay: orb.delay,
            ease: 'easeInOut',
          }}
        />
      ))}
    </div>
  );
} 