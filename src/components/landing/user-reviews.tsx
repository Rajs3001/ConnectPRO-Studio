
"use client";

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Star } from 'lucide-react';
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel"; // Assuming you have a Carousel component

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
  return (
    <section className="py-16 md:py-24 bg-secondary/30">
      <div className="container mx-auto px-4 md:px-6">
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-12 text-primary">What Our Users Say</h2> {/* Removed gradient-text-primary */}
        <Carousel
           opts={{
             align: "start",
             loop: true,
           }}
           className="w-full max-w-xs sm:max-w-xl md:max-w-3xl lg:max-w-5xl mx-auto"
         >
          <CarouselContent>
            {reviews.map((review) => (
              <CarouselItem key={review.id} className="md:basis-1/2 lg:basis-1/3">
                <div className="p-1 h-full">
                  <Card className="border border-border/60 h-full flex flex-col justify-between shadow-lg hover:shadow-xl transition-shadow duration-300"> {/* Removed glassmorphic */}
                    <CardHeader className="pb-4">
                      <div className="flex items-center gap-3 mb-3">
                        <Avatar>
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
                            className={`h-4 w-4 ${i < review.rating ? 'text-yellow-400 fill-yellow-400' : 'text-muted-foreground/50'}`}
                          />
                        ))}
                      </div>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-foreground/90 italic">"{review.text}"</p>
                    </CardContent>
                  </Card>
                </div>
              </CarouselItem>
            ))}
          </CarouselContent>
          <CarouselPrevious className="absolute left-[-50px] top-1/2 -translate-y-1/2 hidden md:inline-flex" />
          <CarouselNext className="absolute right-[-50px] top-1/2 -translate-y-1/2 hidden md:inline-flex" />
        </Carousel>
      </div>
    </section>
  );
}
