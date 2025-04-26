
"use client";

import React, { useRef } from 'react';
// Removed Autoplay import as we'll use manual scroll + snap
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Star } from 'lucide-react';
import { Carousel, CarouselContent, CarouselItem } from "@/components/ui/carousel"; // Removed Next/Previous
import { cn } from '@/lib/utils';

// Dummy review data (Keep as is)
const reviews = [
  { id: 1, name: "Sarah L.", role: "Software Engineer", avatar: "https://picsum.photos/seed/user1/40/40", rating: 5, text: "ConnectPro connected me with an amazing mentor who helped me navigate my first year in the industry. The AI counselor also gave surprisingly relevant advice!" },
  { id: 2, name: "Mike R.", role: "Product Manager", avatar: "https://picsum.photos/seed/user2/40/40", rating: 4, text: "The anonymous community is fantastic for asking candid questions without judgment. Found some great insights there. Video calls are smooth too." },
  { id: 3, name: "Chen W.", role: "UX Designer", avatar: "https://picsum.photos/seed/user3/40/40", rating: 5, text: "As a professional, the platform is easy to use for managing my availability and appointments. Connecting with users has been rewarding." },
  { id: 4, name: "David K.", role: "Data Scientist", avatar: "https://picsum.photos/seed/user4/40/40", rating: 5, text: "The AI's ability to understand context and suggest relevant professionals saved me a lot of time. Highly recommend!" },
  { id: 5, name: "Priya S.", role: "Marketing Specialist", avatar: "https://picsum.photos/seed/user5/40/40", rating: 4, text: "A great resource for professional development. The combination of human expertise and AI support is unique and effective." },
  { id: 6, name: "Omar F.", role: "Student", avatar: "https://picsum.photos/seed/user6/40/40", rating: 5, text: "Really helpful for exploring different career paths. The scheduling was straightforward, and the professional I spoke to was very knowledgeable." },
   { id: 7, name: "Linda H.", role: "Recruiter", avatar: "https://picsum.photos/seed/user7/40/40", rating: 4, text: "The quality of professionals is impressive. It's a valuable tool for anyone seeking specific industry insights or mentorship." },
];

export default function UserReviews() {
  // Ref for the carousel container if needed for direct manipulation, but CSS handles scroll/snap
  const carouselRef = useRef<HTMLDivElement>(null);

  return (
    // Removed bg-card/30, added relative positioning for gradients
    <section className="py-16 md:py-24 animate-fade-in-up overflow-hidden relative" style={{ animationDelay: '0.5s' }}>
      <div className="container mx-auto px-0 md:px-6"> {/* Remove horizontal padding on small screens */}
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-12 px-4 md:px-0 text-primary">What Our Users Say</h2>

        {/* Use native scrolling with snap for the effect */}
        <div
          ref={carouselRef}
          className="flex overflow-x-auto pb-8 scroll-smooth snap-x snap-mandatory scrollbar-hide" // Enable horizontal scroll, hide scrollbar, add snapping
        >
          {/* Add padding elements for centering the first/last items */}
           <div className="snap-center shrink-0 w-1/2 md:w-1/3 lg:w-1/4 xl:w-1/6"></div>

           {reviews.map((review, index) => (
            <div key={review.id} className="snap-center shrink-0 w-4/5 sm:w-3/5 md:w-1/2 lg:w-1/3 px-2 md:px-3"> {/* Adjust width and padding */}
              {/* Adjusted Card background for slight transparency */}
              <Card className={cn(
                 "border border-border/60 h-full flex flex-col justify-between shadow-lg transition-all duration-300 hover:shadow-xl hover:border-primary/40 hover:scale-105 animate-fade-in-up", // Keep hover effect
                 "bg-background/80 backdrop-blur-sm cursor-pointer" // Make it seem interactive, slightly transparent background
                 )}
                 style={{ animationDelay: `${index * 0.1 + 0.1}s` }}
                 tabIndex={0} // Make focusable
                 >
                 <CardHeader className="pb-4">
                   <div className="flex items-center gap-3 mb-3">
                     <Avatar className="h-10 w-10 border-2 border-muted">
                       <AvatarImage src={review.avatar} alt={review.name} />
                       <AvatarFallback>{review.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                     </Avatar>
                     <div>
                       <CardTitle className="text-base font-semibold">{review.name}</CardTitle>
                       <p className="text-xs text-muted-foreground">{review.role}</p>
                     </div>
                   </div>
                   <div className="flex items-center gap-0.5">
                     {[...Array(5)].map((_, i) => (
                       <Star
                         key={i}
                         className={`h-4 w-4 transition-colors ${i < review.rating ? 'text-yellow-400 fill-yellow-400' : 'text-muted-foreground/50'}`}
                       />
                     ))}
                   </div>
                 </CardHeader>
                 <CardContent className="flex-grow">
                   <p className="text-sm text-foreground/90 italic leading-relaxed line-clamp-5">"{review.text}"</p> {/* Limit lines */}
                 </CardContent>
              </Card>
            </div>
           ))}

           {/* Add padding elements for centering */}
           <div className="snap-center shrink-0 w-1/2 md:w-1/3 lg:w-1/4 xl:w-1/6"></div>
        </div>
        {/* Removed Carousel controls */}
      </div>
       {/* Add subtle gradient overlays at the edges using background color */}
        <div className="absolute inset-y-0 left-0 w-16 md:w-24 bg-gradient-to-r from-background to-transparent pointer-events-none"></div>
        <div className="absolute inset-y-0 right-0 w-16 md:w-24 bg-gradient-to-l from-background to-transparent pointer-events-none"></div>
    </section>
  );
}

// Add CSS for scrollbar hiding (optional, works in WebKit/Firefox)
const scrollbarHideCSS = `
  .scrollbar-hide {
    -ms-overflow-style: none;  /* IE and Edge */
    scrollbar-width: none;  /* Firefox */
  }
  .scrollbar-hide::-webkit-scrollbar {
    display: none; /* Chrome, Safari, Opera */
  }
`;

// Inject CSS (ensure this runs client-side)
if (typeof window !== 'undefined') {
  const styleSheet = document.createElement("style");
  styleSheet.type = "text/css";
  styleSheet.innerText = scrollbarHideCSS;
  document.head.appendChild(styleSheet);
}


    