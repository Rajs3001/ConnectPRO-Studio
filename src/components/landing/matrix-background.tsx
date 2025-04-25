
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

    // Characters to display - Katakana subset + numbers
    const characters = 'アァカサタナハマヤャラワガザダバパイィキシチニヒミリヰギジヂビピウゥクスツヌフムユュルグズブヅプエェケセテネヘメレヱゲゼデベペオォコソトノホモヨョロヲゴゾドボポヴッン0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    const charactersArray = characters.split('');

    const fontSize = 16;
    const columns = Math.floor(width / fontSize);

    // y-coordinate for each column's rain drop
    const drops: number[] = [];
    for (let x = 0; x < columns; x++) {
      drops[x] = Math.random() * height / fontSize; // Start randomly
    }

    const draw = () => {
      // Semi-transparent background to create the fading trail effect
      ctx.fillStyle = 'rgba(10, 10, 15, 0.06)'; // Darker background, subtle fade
      ctx.fillRect(0, 0, width, height);

      // Primary color with some opacity for the characters
      ctx.fillStyle = 'hsla(var(--primary), 0.7)'; // Use primary color from theme
      ctx.font = `${fontSize}px monospace`;

      // Loop through columns
      for (let i = 0; i < drops.length; i++) {
        // Random character from the array
        const text = charactersArray[Math.floor(Math.random() * charactersArray.length)];
        // Draw the character
        ctx.fillText(text, i * fontSize, drops[i] * fontSize);

        // Reset drop to top randomly after it goes off screen
        if (drops[i] * fontSize > height && Math.random() > 0.975) { // Adjust randomness
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
      const newColumns = Math.floor(width / fontSize);
      drops.length = 0; // Clear old drops
      for (let x = 0; x < newColumns; x++) {
         drops[x] = Math.random() * height / fontSize;
      }
      draw(); // Restart animation
    };

    window.addEventListener('resize', resizeHandler);
    draw(); // Initial draw

    // Cleanup function
    return () => {
      if (animationFrameId.current) {
        cancelAnimationFrame(animationFrameId.current);
      }
      window.removeEventListener('resize', resizeHandler);
    };
  }, [isClient]); // Depend on isClient to ensure canvasRef is available

  // Render nothing server-side or before hydration
  if (!isClient) {
    return null;
  }

  return (
    <canvas
      ref={canvasRef}
      className={cn('fixed inset-0 -z-20 w-full h-full pointer-events-none opacity-40', className)} // Position behind everything, low opacity
    />
  );
};

export default MatrixBackground;
