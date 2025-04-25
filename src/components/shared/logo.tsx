
import { cn } from '@/lib/utils'; // Import cn for conditional classes

// Updated logo based on the provided image: Concentric blue shapes with a central dot.
const Logo = ({ className }: { className?: string }) => (
    <svg
        width="32" // Keep size consistent or adjust as needed
        height="32"
        viewBox="0 0 100 100"
        xmlns="http://www.w3.org/2000/svg"
        className={cn("hover:opacity-90 transition-opacity duration-300", className)}
    >
        {/* Define gradients for the blue shapes */}
        <defs>
            <linearGradient id="grad1" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" style={{ stopColor: 'hsl(210, 90%, 60%)', stopOpacity: 1 }} /> {/* Lighter Blue at top */}
                <stop offset="100%" style={{ stopColor: 'hsl(226, 95%, 55%)', stopOpacity: 1 }} /> {/* Darker Blue at bottom */}
            </linearGradient>
             <linearGradient id="grad2" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" style={{ stopColor: 'hsl(210, 90%, 65%)', stopOpacity: 1 }} />
                <stop offset="100%" style={{ stopColor: 'hsl(226, 95%, 60%)', stopOpacity: 1 }} />
            </linearGradient>
             <linearGradient id="grad3" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" style={{ stopColor: 'hsl(210, 90%, 70%)', stopOpacity: 1 }} />
                <stop offset="100%" style={{ stopColor: 'hsl(226, 95%, 65%)', stopOpacity: 1 }} />
            </linearGradient>
            {/* Glow Filter (Optional, can be applied via CSS too) */}
            <filter id="logo-glow" x="-50%" y="-50%" width="200%" height="200%">
              <feGaussianBlur stdDeviation="3" result="coloredBlur"/>
               <feMerge>
                    <feMergeNode in="coloredBlur"/>
                    <feMergeNode in="SourceGraphic"/>
               </feMerge>
            </filter>
        </defs>

         {/* Apply glow filter to the group */}
         {/* <g filter="url(#logo-glow)"> */}
         <g>
            {/* Outer Shape */}
            <path
                d="M 60 20 C 40 20, 25 35, 25 50 C 25 65, 40 80, 60 80"
                fill="none"
                stroke="url(#grad1)"
                strokeWidth="8"
                strokeLinecap="round"
            />
             {/* Middle Shape */}
            <path
                d="M 50 25 C 35 25, 30 37.5, 30 50 C 30 62.5, 35 75, 50 75"
                fill="none"
                stroke="url(#grad2)"
                strokeWidth="8"
                strokeLinecap="round"
            />
             {/* Inner Shape */}
            <path
                d="M 40 30 C 30 30, 35 40, 35 50 C 35 60, 30 70, 40 70"
                fill="none"
                stroke="url(#grad3)"
                strokeWidth="8"
                strokeLinecap="round"
            />
            {/* Central Dot */}
            <circle cx="75" cy="50" r="6" fill="url(#grad1)" />
        </g>
    </svg>
);

export default Logo;
