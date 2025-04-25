
"use client";

import React, { useRef, useEffect, useState } from 'react';
import { cn } from '@/lib/utils';

const MatrixBackground: React.FC<{ className?: string }> = ({ className }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isClient, setIsClient] = useState(false);
  const animationFrameId = useRef<number | null>(null);

  useEffect(() => {
    setIsClient(true); // Ensure this runs only on the client
  }, []);

  useEffect(() => {
    if (!isClient || !canvasRef.current) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let width = canvas.width = window.innerWidth;
    let height = canvas.height = window.innerHeight;

    // Characters to display - Katakana subset + numbers + some symbols
    const characters = 'アァカサタナハマヤャラワガザダバパイィキシチニヒミリヰギジヂビピウゥクスツヌフムユュルグズブヅプエェケセテネヘメレヱゲゼデベペオォコソトノホモヨョロヲゴゾドボポヴッン0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ+=-*<>{}[]|';
    const charactersArray = characters.split('');

    const fontSize = 12; // Slightly smaller font size for denser effect
    const columns = Math.ceil(width / fontSize); // Use ceil to cover edges

    // y-coordinate for each column's rain drop
    const drops: number[] = [];
    for (let x = 0; x < columns; x++) {
      drops[x] = Math.random() * height / fontSize; // Start randomly off-screen or on-screen
    }

    const draw = () => {
      // Semi-transparent background for fading trail effect
      // Use the theme's background color with low alpha
      ctx.fillStyle = 'hsla(var(--background), 0.1)'; // Slightly slower fade for trails
      ctx.fillRect(0, 0, width, height);

      // Use theme's primary color but slightly brighter/more visible
      ctx.fillStyle = 'hsla(var(--primary), 0.7)'; // Increased character opacity
      ctx.font = `${fontSize}px monospace`;

      // Loop through columns
      for (let i = 0; i < drops.length; i++) {
        // Random character from the array
        const text = charactersArray[Math.floor(Math.random() * charactersArray.length)];
        // Draw the character
        ctx.fillText(text, i * fontSize, drops[i] * fontSize);

        // Reset drop to top randomly after it goes off screen
        // Make reset more frequent
        if (drops[i] * fontSize > height && Math.random() > 0.97) {
          drops[i] = 0;
        }

        // Increment y-coordinate
        drops[i]++;
      }

      animationFrameId.current = requestAnimationFrame(draw);
    };

    const resizeHandler = () => {
      if (animationFrameId.current) {
        cancelAnimationFrame(animationFrameId.current);
      }
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
      // Recalculate columns and reset drops if needed
      const newColumns = Math.ceil(width / fontSize);
      drops.length = 0; // Clear old drops
      for (let x = 0; x < newColumns; x++) {
         drops[x] = Math.random() * height / fontSize;
      }
      if (ctx) { // Ensure context is still valid after resize potentially clears it
        draw(); // Restart animation
      }
    };

    // Debounce resize handler slightly
    let resizeTimeout: NodeJS.Timeout;
    const debouncedResizeHandler = () => {
        clearTimeout(resizeTimeout);
        resizeTimeout = setTimeout(resizeHandler, 100);
    };


    window.addEventListener('resize', debouncedResizeHandler);
    draw(); // Initial draw

    // Cleanup function
    return () => {
      if (animationFrameId.current) {
        cancelAnimationFrame(animationFrameId.current);
      }
      window.removeEventListener('resize', debouncedResizeHandler);
      clearTimeout(resizeTimeout);
    };
  }, [isClient]); // Depend on isClient to ensure canvasRef is available

  // Render nothing server-side or before hydration
  if (!isClient) {
    return null;
  }

  return (
    <canvas
      ref={canvasRef}
      className={cn(
          'fixed inset-0 -z-20 w-full h-full pointer-events-none opacity-40 blur-[0.5px]', // Increased opacity, slightly reduced blur
          className
      )}
    />
  );
};

export default MatrixBackground;
