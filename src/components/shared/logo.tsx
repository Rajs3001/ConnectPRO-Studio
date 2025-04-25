
import { cn } from '@/lib/utils'; // Import cn for conditional classes

// Updated logo: Abstract interlocking C and P shapes representing connection
// C forms a pathway, P interlinks, negative space implies forward motion.
const Logo = ({ className }: { className?: string }) => ( // Accept className prop
    <svg width="32" height="32" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg" className={cn("text-primary hover:opacity-80 transition-opacity duration-300", className)}>
      {/* C Shape - Open Circle/Pathway */}
      <path
        d="M 80 25 A 40 40 0 1 0 80 75" // Large C-like arc starting from top-right, going counter-clockwise, slightly wider
        fill="none"
        stroke="currentColor" // Use primary color
        strokeWidth="12" // Consistent stroke width
        strokeLinecap="round"
      />
      {/* P Shape - Vertical Line + Smaller Half Circle - using accent color and positioned to slightly overlap/connect */}
      <path
        // Vertical line starts lower, arc connects higher and extends slightly right
        d="M 45 35 V 75 M 45 55 A 20 20 0 0 1 45 35"
        fill="none"
        stroke="hsl(var(--accent))" // Use accent color
        strokeWidth="12" // Consistent stroke width
        strokeLinecap="round"
        opacity="0.9" // Slight transparency for accent
      />
       {/* Small Node/Intersection Point (Optional) - visually connects the two */}
       <circle cx="60" cy="55" r="5" fill="currentColor" opacity="0.7"/>
    </svg>
);

export default Logo;
