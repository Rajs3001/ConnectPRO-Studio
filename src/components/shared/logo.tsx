
import { cn } from '@/lib/utils'; // Import cn for conditional classes

// Updated logo: Abstract interlocking C and P shapes representing connection
const Logo = ({ className }: { className?: string }) => ( // Accept className prop
    <svg width="32" height="32" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg" className={cn("text-primary hover:opacity-80 transition-opacity duration-300", className)}>
      {/* C Shape - Open Circle */}
      <path
        d="M 75 25 A 40 40 0 1 0 75 75"
        fill="none"
        stroke="currentColor" // Use primary color
        strokeWidth="12" // Slightly thinner lines
        strokeLinecap="round"
      />
      {/* P Shape - Vertical Line + Smaller Half Circle - using accent color */}
      <path
        d="M 35 25 V 75 M 35 50 A 20 20 0 0 1 35 25"
        fill="none"
        stroke="hsl(var(--accent))" // Use accent color
        strokeWidth="12" // Slightly thinner lines
        strokeLinecap="round"
        opacity="0.9"
      />
       {/* Optional: Small dot representing connection point or focus */}
       {/* <circle cx="55" cy="50" r="6" fill="currentColor" opacity="0.8"/> */}
    </svg>
);

export default Logo;
