
import { cn } from '@/lib/utils'; // Import cn for conditional classes

// New minimalist logo using abstract C and P shapes
const Logo = ({ className }: { className?: string }) => ( // Accept className prop
    <svg width="32" height="32" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg" className={cn("text-primary hover:opacity-80 transition-opacity duration-300", className)}>
      {/* Added subtle glow definition */}
       <defs>
         <filter id="logo-glow" x="-50%" y="-50%" width="200%" height="200%">
           <feGaussianBlur stdDeviation="4" result="coloredBlur"/> {/* Adjusted blur */}
           <feMerge>
             <feMergeNode in="coloredBlur"/>
             <feMergeNode in="SourceGraphic"/>
           </feMerge>
         </filter>
       </defs>
      {/* Apply glow filter */}
      <g filter="url(#logo-glow)" style={{ filter: 'drop-shadow(0 0 4px hsl(var(--primary-glow)/0.7))' }}>
         {/* Simplified C shape - Arc */}
         <path d="M80 20 A 45 45 0 1 0 80 80" fill="none" stroke="currentColor" strokeWidth="14" strokeLinecap="round" />
         {/* Simplified P shape - Line + smaller arc, using accent color */}
         <path d="M45 20 V 80 M 45 50 A 20 20 0 0 1 45 20" fill="none" stroke="hsl(var(--accent))" strokeWidth="12" strokeLinecap="round" opacity="0.9" />
      </g>
    </svg>
);

export default Logo;
