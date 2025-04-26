
"use client";

import React, { useRef, useEffect, useState } from 'react';
import { cn } from '@/lib/utils';

interface Dot {
  x: number;
  y: number;
  vx: number;
  vy: number;
  radius: number;
  isGlowing?: boolean; // Added property for glowing dots
}

const ConnectingDotsBackground: React.FC<{ className?: string }> = ({ className }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isClient, setIsClient] = useState(false);
  const animationFrameId = useRef<number | null>(null);
  const dots = useRef<Dot[]>([]);

  useEffect(() => {
    setIsClient(true);
  }, []);

  useEffect(() => {
    if (!isClient || !canvasRef.current) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let width = canvas.width = window.innerWidth;
    let height = canvas.height = window.innerHeight;
    const MAX_DOTS = Math.floor((width * height) / 12000); // Adjust density
    const CONNECT_DISTANCE = 120; // Increase connection distance slightly
    const DOT_SPEED = 0.3;
    const DOT_RADIUS_MIN = 1.5; // Increase min radius
    const DOT_RADIUS_MAX = 3.5; // Increase max radius
    const GLOW_PROBABILITY = 0.05; // Chance for a dot to glow

    const initDots = () => {
        dots.current = [];
        for (let i = 0; i < MAX_DOTS; i++) {
            dots.current.push({
                x: Math.random() * width,
                y: Math.random() * height,
                vx: (Math.random() - 0.5) * DOT_SPEED * 2,
                vy: (Math.random() - 0.5) * DOT_SPEED * 2,
                radius: Math.random() * (DOT_RADIUS_MAX - DOT_RADIUS_MIN) + DOT_RADIUS_MIN,
                isGlowing: Math.random() < GLOW_PROBABILITY, // Randomly assign glow
            });
        }
    };

    initDots();

    const draw = () => {
      ctx.clearRect(0, 0, width, height); // Clear canvas each frame

      // Move dots
      dots.current.forEach(dot => {
        dot.x += dot.vx;
        dot.y += dot.vy;

        // Bounce off edges
        if (dot.x < 0 || dot.x > width) dot.vx *= -1;
        if (dot.y < 0 || dot.y > height) dot.vy *= -1;

        // Determine color and glow
         const primaryHslMatch = getComputedStyle(document.documentElement).getPropertyValue('--primary').match(/(\d+)\s+(\d+)%\s+(\d+)%/);
         const accentHslMatch = getComputedStyle(document.documentElement).getPropertyValue('--accent').match(/(\d+)\s+(\d+)%\s+(\d+)%/);

         let dotColor = primaryHslMatch ? `hsla(${primaryHslMatch[1]}, ${primaryHslMatch[2]}%, ${primaryHslMatch[3]}%, 0.8)` : 'rgba(67, 100, 247, 0.8)'; // Increase opacity

         if (dot.isGlowing) {
             dotColor = accentHslMatch ? `hsla(${accentHslMatch[1]}, ${accentHslMatch[2]}%, ${accentHslMatch[3]}%, 0.9)` : 'rgba(111, 177, 252, 0.9)'; // Accent color for glowing dots
             ctx.shadowColor = dotColor;
             ctx.shadowBlur = 5; // Add glow effect
         } else {
              ctx.shadowBlur = 0; // Remove glow for non-glowing dots
         }


        // Draw dot
        ctx.beginPath();
        ctx.arc(dot.x, dot.y, dot.radius, 0, Math.PI * 2);
        ctx.fillStyle = dotColor;
        ctx.fill();
      });

       // Reset shadow before drawing lines
      ctx.shadowBlur = 0;

      // Draw connecting lines
      for (let i = 0; i < dots.current.length; i++) {
        for (let j = i + 1; j < dots.current.length; j++) {
          const dx = dots.current[i].x - dots.current[j].x;
          const dy = dots.current[i].y - dots.current[j].y;
          const distance = Math.sqrt(dx * dx + dy * dy);

          if (distance < CONNECT_DISTANCE) {
            const opacity = 1 - distance / CONNECT_DISTANCE;
            ctx.beginPath();
            ctx.moveTo(dots.current[i].x, dots.current[i].y);
            ctx.lineTo(dots.current[j].x, dots.current[j].y);
            // Use theme color for lines, slightly thicker and more opaque
            const primaryHslMatch = getComputedStyle(document.documentElement).getPropertyValue('--primary').match(/(\d+)\s+(\d+)%\s+(\d+)%/);
            const lineColor = primaryHslMatch ? `hsla(${primaryHslMatch[1]}, ${primaryHslMatch[2]}%, ${primaryHslMatch[3]}%, ${opacity * 0.5})` : `rgba(67, 100, 247, ${opacity * 0.5})`; // Increase line opacity
            ctx.strokeStyle = lineColor;
            ctx.lineWidth = 0.7; // Increase line width
            ctx.stroke();
          }
        }
      }

      animationFrameId.current = requestAnimationFrame(draw);
    };

    const resizeHandler = () => {
      if (animationFrameId.current) {
        cancelAnimationFrame(animationFrameId.current);
      }
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
      initDots();
      if (ctx) {
        draw();
      }
    };

    let resizeTimeout: NodeJS.Timeout;
    const debouncedResizeHandler = () => {
        clearTimeout(resizeTimeout);
        resizeTimeout = setTimeout(resizeHandler, 100);
    };


    window.addEventListener('resize', debouncedResizeHandler);
    draw();

    return () => {
      if (animationFrameId.current) {
        cancelAnimationFrame(animationFrameId.current);
      }
      window.removeEventListener('resize', debouncedResizeHandler);
      clearTimeout(resizeTimeout);
    };
  }, [isClient]);

  if (!isClient) {
    return null;
  }

  return (
    <canvas
      ref={canvasRef}
      className={cn(
          'absolute inset-0 -z-10 w-full h-full pointer-events-none opacity-50', // Adjusted opacity
          className
      )}
    />
  );
};

export default ConnectingDotsBackground;
