
"use client";

import React, { useState, useEffect } from 'react';
import AppLayout from '@/components/layouts/app-layout'; // Assuming user is logged in
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { ArrowRight, Code, Filter, Heart, ImageIcon, Link as LinkIconLucid, MessageCircle, Plus, Search, Send, Text, UserCircle } from 'lucide-react'; // Renamed LinkIcon to LinkIconLucid
import Link from 'next/link';
import { Skeleton } from '@/components/ui/skeleton';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils'; // Import cn

// Mock data for community posts (replace with actual API fetching)
interface CommunityPost {
    id: string;
    type: 'text' | 'image' | 'code' | 'link';
    title: string;
    content?: string; // Add full content for potential preview expansion
    excerpt: string;
    tags?: string[];
    timestamp: Date;
    commentCount: number;
    likeCount: number; // Added like count
}

const fetchCommunityPosts = async (filters: { query?: string; type?: string } = {}): Promise<CommunityPost[]> => {
    await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate network delay

    const allPosts: CommunityPost[] = [
        { id: 'p1', type: 'text', title: 'Navigating Career Change in Tech?', excerpt: 'Feeling stuck in my current role. Anyone successfully transitioned from non-tech to a dev role? Looking for advice and resources...', tags: ['career', 'tech', 'advice'], timestamp: new Date(Date.now() - 3600000), commentCount: 15, likeCount: 42 },
        { id: 'p2', type: 'code', title: 'Python Script for Data Cleaning', content: '```python\nimport pandas as pd\n# ... rest of the script ...\n```', excerpt: 'Sharing a small script I wrote for cleaning CSV files. Hope it helps someone! #python #datascience', tags: ['python', 'data-science', 'code'], timestamp: new Date(Date.now() - 7200000), commentCount: 8, likeCount: 25 },
        { id: 'p3', type: 'image', title: 'My Remote Work Setup Inspiration', content: 'https://picsum.photos/seed/setup/800/600', excerpt: 'Finally happy with my home office setup! Thought I\'d share for inspiration. #remotework #productivity', tags: ['remote-work', 'setup', 'inspiration'], timestamp: new Date(Date.now() - 10800000), commentCount: 22, likeCount: 68 },
        { id: 'p4', type: 'link', title: 'Useful Free Resource for Learning Docker', content: 'https://docs.docker.com/get-started/', excerpt: 'Found this comprehensive free tutorial on Docker basics. Highly recommended!', tags: ['docker', 'devops', 'learning', 'resource'], timestamp: new Date(Date.now() - 14400000), commentCount: 5, likeCount: 18 },
        { id: 'p5', type: 'text', title: 'Best Practices for API Design?', excerpt: 'What are some key principles you follow when designing RESTful APIs? Looking for different perspectives.', tags: ['api', 'design', 'best-practices', 'backend'], timestamp: new Date(Date.now() - 18000000), commentCount: 30, likeCount: 95 },
    ];

    return allPosts.filter(post => {
        const queryMatch = !filters.query ||
                           post.title.toLowerCase().includes(filters.query.toLowerCase()) ||
                           post.excerpt.toLowerCase().includes(filters.query.toLowerCase()) ||
                           (post.tags && post.tags.some(tag => tag.toLowerCase().includes(filters.query!.toLowerCase())));
        const typeMatch = !filters.type || post.type === filters.type;
        return queryMatch && typeMatch;
    }).sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());
};


const typeIcons = {
    text: Text,
    image: ImageIcon,
    code: Code,
    link: LinkIconLucid, // Use the aliased import
};


export default function CommunityPage() {
    const [posts, setPosts] = useState<CommunityPost[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        const loadPosts = async () => {
            setLoading(true);
            const fetchedPosts = await fetchCommunityPosts({ query: searchTerm });
            setPosts(fetchedPosts);
            setLoading(false);
        };
        loadPosts();
    }, [searchTerm]);

    const handleSearch = (e: React.FormEvent) => {
      e.preventDefault();
      console.log("Searching for:", searchTerm);
    };

    return (
        <AppLayout userType="user">
            <div className="container mx-auto py-8 max-w-3xl"> {/* Centered content */}
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
                    <h1 className="text-3xl font-bold text-primary">Community Feed</h1>
                    <Link href="/community/new">
                        <Button className="bg-primary text-primary-foreground hover:bg-primary/90">
                            <Plus className="mr-2 h-4 w-4" /> Create Post
                        </Button>
                    </Link>
                </div>

                {/* Search Bar (Optional) */}
                 <form onSubmit={handleSearch} className="mb-8 p-4 bg-card border border-border/60 rounded-lg shadow flex flex-col md:flex-row gap-4 items-center">
                    <div className="relative flex-grow w-full md:w-auto">
                         <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                         <Input
                            placeholder="Search community..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="pl-10"
                         />
                    </div>
                     <Button type="submit" className="w-full md:w-auto" variant="secondary">Search</Button>
                 </form>

                {/* Posts Feed */}
                <div className="space-y-0"> {/* Remove default space-y, Card handles margin */}
                    {loading ? (
                        [...Array(5)].map((_, i) => <PostSkeleton key={i} />)
                    ) : posts.length > 0 ? (
                        posts.map(post => <PostCard key={post.id} post={post} />)
                    ) : (
                        <Card className="text-center py-12 bg-card border-b border-border/60 rounded-none shadow-none">
                            <CardContent>
                                <p className="text-muted-foreground">No posts found.</p>
                                {searchTerm && <Button variant="link" onClick={() => setSearchTerm('')}>Clear search</Button>}
                            </CardContent>
                        </Card>
                    )}
                </div>
            </div>
        </AppLayout>
    );
}


// Updated Post Card Component (Twitter/Threads like)
const PostCard: React.FC<{ post: CommunityPost }> = ({ post }) => {
    const PostIcon = typeIcons[post.type] || Text;

     const timeAgo = (date: Date): string => {
        const seconds = Math.floor((new Date().getTime() - date.getTime()) / 1000);
        let interval = seconds / 31536000;
        if (interval > 1) return Math.floor(interval) + "y";
        interval = seconds / 2592000;
        if (interval > 1) return Math.floor(interval) + "mo";
        interval = seconds / 86400;
        if (interval > 1) return Math.floor(interval) + "d";
        interval = seconds / 3600;
        if (interval > 1) return Math.floor(interval) + "h";
        interval = seconds / 60;
        if (interval > 1) return Math.floor(interval) + "m";
        return Math.floor(seconds) + "s";
     };

    const renderContentPreview = () => {
        switch (post.type) {
            case 'image':
                return (
                    <Link href={`/community/post/${post.id}`} className="block mt-2">
                        <img src={post.content} alt={post.title} className="rounded-lg border border-border/60 max-h-72 w-full object-cover" />
                    </Link>
                );
            case 'code':
                return (
                     <Link href={`/community/post/${post.id}`} className="block mt-2">
                        <pre className="bg-muted/50 p-3 rounded-md text-xs overflow-x-auto max-h-40">
                            <code className="font-mono line-clamp-6">{post.content?.replace(/```.*\n|```/g, '')}</code> {/* Basic code preview */}
                        </pre>
                     </Link>
                );
             case 'link':
                return (
                     <Link href={post.content || '#'} target="_blank" rel="noopener noreferrer" className="block mt-2 border border-border/60 rounded-lg p-3 hover:bg-muted/50 transition-colors">
                         <p className="text-sm font-medium text-primary">{post.title}</p>
                         <p className="text-xs text-muted-foreground truncate">{post.content}</p>
                     </Link>
                );
            case 'text':
            default:
                return (
                    <Link href={`/community/post/${post.id}`}>
                        <p className="mt-2 text-sm text-foreground/90 line-clamp-4">{post.excerpt}</p> {/* Use excerpt for text */}
                    </Link>
                );
        }
    };

    return (
        <Card className={cn(
            "shadow-none hover:bg-muted/30 transition-colors duration-150 border-b border-border/60 rounded-none", // More like Twitter/Threads
            "flex p-4 gap-3" // Use flex layout
        )}>
            {/* Avatar Column */}
            <div className="shrink-0">
                <Avatar className="h-10 w-10 bg-secondary">
                    <AvatarFallback><UserCircle size={24} className="text-muted-foreground" /></AvatarFallback>
                </Avatar>
                {/* Optionally add a vertical line connector for threads view */}
                 {/* <div className="h-full w-0.5 bg-border/40 mx-auto mt-2"></div> */}
            </div>

             {/* Content Column */}
             <div className="flex-grow">
                 {/* Post Header */}
                 <div className="flex items-center justify-between gap-2">
                     <div className="flex items-center gap-2">
                         <span className="font-semibold text-sm">Anonymous</span>
                         <span className="text-xs text-muted-foreground">&middot;</span>
                         <Link href={`/community/post/${post.id}`} className="text-xs text-muted-foreground hover:underline">{timeAgo(post.timestamp)}</Link>
                     </div>
                     {/* Optional: More actions button (...) */}
                 </div>

                 {/* Post Title (Optional, maybe integrate into content) */}
                 <Link href={`/community/post/${post.id}`}>
                     <h3 className="font-semibold mt-1 line-clamp-2 hover:underline">{post.title}</h3>
                 </Link>

                 {/* Content Preview */}
                 {renderContentPreview()}

                  {/* Tags */}
                  {post.tags && post.tags.length > 0 && (
                     <div className="mt-3 flex flex-wrap gap-1">
                        {post.tags.map(tag => (
                           <Badge key={tag} variant="secondary" className="text-xs font-normal cursor-pointer hover:bg-secondary/80">#{tag}</Badge>
                        ))}
                     </div>
                  )}

                 {/* Action Bar */}
                 <div className="mt-3 flex justify-between items-center text-muted-foreground max-w-xs">
                      <Button variant="ghost" size="sm" className="flex items-center gap-1.5 text-xs hover:text-blue-500">
                         <MessageCircle size={16} />
                         <span>{post.commentCount}</span>
                      </Button>
                      <Button variant="ghost" size="sm" className="flex items-center gap-1.5 text-xs hover:text-red-500">
                          <Heart size={16} />
                          <span>{post.likeCount}</span>
                      </Button>
                      <Button variant="ghost" size="sm" className="flex items-center gap-1.5 text-xs hover:text-green-500">
                          <Send size={16} />
                           {/* Share or Send */}
                      </Button>
                      {/* Optional: Bookmark */}
                 </div>
             </div>
        </Card>
    );
};

// Skeleton Loader for Post Card (Updated for new layout)
const PostSkeleton = () => (
    <Card className="border-b border-border/60 rounded-none flex p-4 gap-3">
        <div className="shrink-0">
            <Skeleton className="h-10 w-10 rounded-full bg-muted/50" />
        </div>
         <div className="flex-grow space-y-2.5">
             <div className="flex items-center gap-2">
                 <Skeleton className="h-4 w-20 bg-muted/50" />
                 <Skeleton className="h-3 w-12 bg-muted/50" />
             </div>
             <Skeleton className="h-4 w-3/4 bg-muted/50" />
             <Skeleton className="h-3 w-full bg-muted/50" />
             <Skeleton className="h-3 w-5/6 bg-muted/50" />
             <div className="flex justify-between items-center max-w-xs pt-1">
                 <Skeleton className="h-5 w-8 bg-muted/50" />
                 <Skeleton className="h-5 w-8 bg-muted/50" />
                 <Skeleton className="h-5 w-8 bg-muted/50" />
             </div>
        </div>
    </Card>
);
