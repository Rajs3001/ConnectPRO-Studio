
import { cn } from '@/lib/utils'; // Import cn for conditional classes

// Simple, minimalistic logo using initials C and P
const Logo = ({ className }: { className?: string }) => ( // Accept className prop
    <svg width="32" height="32" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg" className={cn("text-primary hover:opacity-80 transition-opacity duration-300", className)}>
      {/* Added subtle glow definition */}
       <defs>
         <filter id="logo-glow" x="-50%" y="-50%" width="200%" height="200%">
           <feGaussianBlur stdDeviation="3.5" result="coloredBlur"/>
           <feMerge>
             <feMergeNode in="coloredBlur"/>
             <feMergeNode in="SourceGraphic"/>
           </feMerge>
         </filter>
       </defs>
      {/* Apply glow filter */}
      <g filter="url(#logo-glow)" style={{ filter: 'drop-shadow(0 0 3px hsl(var(--primary-glow)))' }}>
         <path d="M60,15 A35,35 0 0 0 60,85 A15,15 0 0 0 60,65 A15,15 0 0 1 60,35 A35,35 0 0 0 60,15 Z" fill="currentColor" />
         <path d="M40,15 A35,35 0 1 1 40,85 L40,65 A15,15 0 1 0 40,35 L40,15 Z" fill="currentColor" opacity="0.7"/>
      </g>
    </svg>
);

export default Logo;
