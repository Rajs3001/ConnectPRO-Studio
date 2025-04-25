
"use client";

import React, { useRef } from 'react'; // Import useRef
import Autoplay from "embla-carousel-autoplay"; // Import Autoplay plugin
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Star } from 'lucide-react';
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel";
import { cn } from '@/lib/utils';

// Dummy review data
const reviews = [
  {
    id: 1,
    name: "Sarah L.",
    role: "Software Engineer",
    avatar: "https://picsum.photos/seed/user1/40/40",
    rating: 5,
    text: "ConnectPro connected me with an amazing mentor who helped me navigate my first year in the industry. The AI counselor also gave surprisingly relevant advice!",
  },
  {
    id: 2,
    name: "Mike R.",
    role: "Product Manager",
    avatar: "https://picsum.photos/seed/user2/40/40",
    rating: 4,
    text: "The anonymous community is fantastic for asking candid questions without judgment. Found some great insights there. Video calls are smooth too.",
  },
  {
    id: 3,
    name: "Chen W.",
    role: "UX Designer",
    avatar: "https://picsum.photos/seed/user3/40/40",
    rating: 5,
    text: "As a professional, the platform is easy to use for managing my availability and appointments. Connecting with users has been rewarding.",
  },
   {
    id: 4,
    name: "David K.",
    role: "Data Scientist",
    avatar: "https://picsum.photos/seed/user4/40/40",
    rating: 5,
    text: "The AI's ability to understand context and suggest relevant professionals saved me a lot of time. Highly recommend!",
  },
   {
    id: 5,
    name: "Priya S.",
    role: "Marketing Specialist",
    avatar: "https://picsum.photos/seed/user5/40/40",
    rating: 4,
    text: "A great resource for professional development. The combination of human expertise and AI support is unique and effective.",
  },
];

export default function UserReviews() {
   // Initialize the autoplay plugin
   const plugin = useRef(
     Autoplay({ delay: 4000, stopOnInteraction: true }) // Adjust delay as needed
   );

  return (
    <section className="py-16 md:py-24 bg-card/30 animate-fade-in-up" style={{ animationDelay: '0.5s' }}> {/* Section animation */}
      <div className="container mx-auto px-4 md:px-6">
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-12 text-primary">What Our Users Say</h2>
        <Carousel
           plugins={[plugin.current]} // Add the autoplay plugin instance
           opts={{
             align: "start",
             loop: true,
           }}
           onMouseEnter={plugin.current.stop} // Pause on hover
           onMouseLeave={plugin.current.reset} // Resume on mouse leave
           className="w-full max-w-xs sm:max-w-xl md:max-w-3xl lg:max-w-5xl mx-auto"
         >
          <CarouselContent className="-ml-4"> {/* Adjust margin for spacing */}
            {reviews.map((review, index) => ( // Added index for staggered animation
              <CarouselItem key={review.id} className="md:basis-1/2 lg:basis-1/3 pl-4"> {/* Add padding left */}
                <div className="p-1 h-full">
                  <Card className={cn(
                      "border border-border/60 h-full flex flex-col justify-between shadow-lg transition-all duration-300 hover:shadow-xl hover:border-primary/40 hover:-translate-y-1 animate-fade-in-up", // Hover and animation
                      "bg-card" // Ensure card background
                      )}
                      style={{ animationDelay: `${index * 0.1 + 0.1}s` }}>
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
                      <p className="text-sm text-foreground/90 italic leading-relaxed">"{review.text}"</p>
                    </CardContent>
                  </Card>
                </div>
              </CarouselItem>
            ))}
          </CarouselContent>
          {/* Styled Carousel Controls */}
          <CarouselPrevious className="absolute left-[-15px] sm:left-[-30px] top-1/2 -translate-y-1/2 hidden md:inline-flex bg-background/80 hover:bg-background border-primary text-primary hover:scale-110 transition-all duration-200" />
          <CarouselNext className="absolute right-[-15px] sm:right-[-30px] top-1/2 -translate-y-1/2 hidden md:inline-flex bg-background/80 hover:bg-background border-primary text-primary hover:scale-110 transition-all duration-200" />
        </Carousel>
      </div>
    </section>
  );
}
