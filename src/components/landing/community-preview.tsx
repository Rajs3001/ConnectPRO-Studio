
"use client";

import React from 'react';
import Link from 'next/link';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowRight, Code, ImageIcon, LinkIcon, MessageCircle, Text } from 'lucide-react'; // Relevant icons

// Dummy post data (replace with actual fetch if needed)
const dummyPosts = [
  {
    id: 'p1',
    type: 'text', // text, image, code, link
    title: 'Navigating Career Change in Tech?',
    excerpt: 'Feeling stuck in my current role. Anyone successfully transitioned from non-tech to a dev role? Looking for advice and resources...',
    icon: Text,
  },
  {
    id: 'p2',
    type: 'code',
    title: 'Python Script for Data Cleaning',
    excerpt: 'Sharing a small script I wrote for cleaning CSV files. Hope it helps someone! #python #datascience',
    icon: Code,
  },
  {
    id: 'p3',
    type: 'image',
    title: 'My Remote Work Setup Inspiration',
    excerpt: 'Finally happy with my home office setup! Thought I\'d share for inspiration. #remotework #productivity',
    icon: ImageIcon,
  },
];

export default function CommunityPreview() {
  return (
    <section className="py-16 md:py-24 bg-background">
      <div className="container mx-auto px-4 md:px-6">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-accent">Join the Conversation</h2> {/* Removed gradient-text-accent */}
          <p className="text-lg text-muted-foreground mt-2 max-w-2xl mx-auto">
            Engage with peers, share insights, and ask questions in our anonymous community.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {dummyPosts.map((post, index) => ( // Added index for potential staggered animation key
            <Card key={post.id} className="border border-border/60 shadow-md hover:shadow-lg transition-shadow duration-300 flex flex-col"> {/* Removed glassmorphic and animation classes */}
              <CardHeader className="flex-row items-center gap-3 pb-2">
                 <div className="p-2 bg-primary/10 rounded-md border border-primary/30">
                   <post.icon className="h-5 w-5 text-primary" />
                 </div>
                <CardTitle className="text-base font-semibold line-clamp-1">{post.title}</CardTitle>
              </CardHeader>
              <CardContent className="flex-grow">
                <CardDescription className="line-clamp-3 text-sm">
                  {post.excerpt}
                </CardDescription>
              </CardContent>
              <div className="p-4 pt-0 mt-auto">
                 <Button variant="link" size="sm" className="p-0 h-auto text-primary" asChild>
                    <Link href={`/community/post/${post.id}`}>Read More <ArrowRight className="ml-1 h-4 w-4" /></Link>
                 </Button>
              </div>
            </Card>
          ))}
           {/* Removed style tag for animation */}
        </div>

        <div className="text-center">
          <Button size="lg" variant="outline" className="border-accent text-accent hover:bg-accent/10" asChild>
            <Link href="/community">Explore Full Community <MessageCircle className="ml-2 h-5 w-5" /></Link>
          </Button>
        </div>
      </div>
    </section>
  );
}
