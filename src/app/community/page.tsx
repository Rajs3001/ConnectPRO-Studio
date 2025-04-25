
"use client";

import React, { useState, useEffect } from 'react';
import AppLayout from '@/components/layouts/app-layout'; // Assuming user is logged in
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { ArrowRight, Code, Filter, ImageIcon, LinkIcon, MessageCircle, Plus, Search, Text } from 'lucide-react';
import Link from 'next/link';
import { Skeleton } from '@/components/ui/skeleton';
import { Badge } from '@/components/ui/badge'; // Added Badge

// Mock data for community posts (replace with actual API fetching)
interface CommunityPost {
    id: string;
    type: 'text' | 'image' | 'code' | 'link';
    title: string;
    excerpt: string;
    tags?: string[];
    timestamp: Date;
    commentCount: number;
    // No author info needed due to anonymity
}

const fetchCommunityPosts = async (filters: { query?: string; type?: string } = {}): Promise<CommunityPost[]> => {
    await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate network delay

    const allPosts: CommunityPost[] = [
        { id: 'p1', type: 'text', title: 'Navigating Career Change in Tech?', excerpt: 'Feeling stuck in my current role. Anyone successfully transitioned from non-tech to a dev role? Looking for advice and resources...', tags: ['career', 'tech', 'advice'], timestamp: new Date(Date.now() - 3600000), commentCount: 15 },
        { id: 'p2', type: 'code', title: 'Python Script for Data Cleaning', excerpt: 'Sharing a small script I wrote for cleaning CSV files. Hope it helps someone! #python #datascience', tags: ['python', 'data-science', 'code'], timestamp: new Date(Date.now() - 7200000), commentCount: 8 },
        { id: 'p3', type: 'image', title: 'My Remote Work Setup Inspiration', excerpt: 'Finally happy with my home office setup! Thought I\'d share for inspiration. #remotework #productivity', tags: ['remote-work', 'setup', 'inspiration'], timestamp: new Date(Date.now() - 10800000), commentCount: 22 },
        { id: 'p4', type: 'link', title: 'Useful Free Resource for Learning Docker', excerpt: 'Found this comprehensive free tutorial on Docker basics. Highly recommended!', tags: ['docker', 'devops', 'learning', 'resource'], timestamp: new Date(Date.now() - 14400000), commentCount: 5 },
        { id: 'p5', type: 'text', title: 'Best Practices for API Design?', excerpt: 'What are some key principles you follow when designing RESTful APIs? Looking for different perspectives.', tags: ['api', 'design', 'best-practices', 'backend'], timestamp: new Date(Date.now() - 18000000), commentCount: 30 },
    ];

    // Simple filtering logic (improve with actual backend search)
    return allPosts.filter(post => {
        const queryMatch = !filters.query ||
                           post.title.toLowerCase().includes(filters.query.toLowerCase()) ||
                           post.excerpt.toLowerCase().includes(filters.query.toLowerCase()) ||
                           (post.tags && post.tags.some(tag => tag.toLowerCase().includes(filters.query!.toLowerCase())));
        const typeMatch = !filters.type || post.type === filters.type;
        return queryMatch && typeMatch;
    }).sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime()); // Sort by newest first
};


const typeIcons = {
    text: Text,
    image: ImageIcon,
    code: Code,
    link: LinkIcon,
};


export default function CommunityPage() {
    const [posts, setPosts] = useState<CommunityPost[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    // Add filter state if implementing type filters

    useEffect(() => {
        const loadPosts = async () => {
            setLoading(true);
            const fetchedPosts = await fetchCommunityPosts({ query: searchTerm });
            setPosts(fetchedPosts);
            setLoading(false);
        };
        loadPosts();
    }, [searchTerm]); // Refetch when search term changes

    const handleSearch = (e: React.FormEvent) => {
      e.preventDefault();
      // The useEffect already handles refetching when searchTerm changes
      console.log("Searching for:", searchTerm);
    };

    return (
        <AppLayout userType="user"> {/* Or 'professional', layout adjusts */}
            <div className="container mx-auto py-8">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
                    <h1 className="text-3xl font-bold gradient-text-primary">Community Feed</h1>
                    <Link href="/community/new">
                        <Button className="bg-primary text-primary-foreground hover:bg-primary/90">
                            <Plus className="mr-2 h-4 w-4" /> Create New Post
                        </Button>
                    </Link>
                </div>

                {/* Search and Filter Bar */}
                 <form onSubmit={handleSearch} className="mb-8 p-4 bg-card border border-border/60 rounded-lg shadow flex flex-col md:flex-row gap-4 items-center">
                    <div className="relative flex-grow w-full md:w-auto">
                         <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                         <Input
                            placeholder="Search posts by title, content, or tag..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="pl-10" // Padding left for icon
                         />
                    </div>
                     {/* Add Filters Dropdown/Buttons if needed */}
                     {/* <Button type="button" variant="outline">
                         <Filter className="mr-2 h-4 w-4" /> Filter
                     </Button> */}
                     <Button type="submit" className="w-full md:w-auto" variant="secondary">Search</Button>
                 </form>


                {/* Posts Grid/List */}
                <div className="space-y-6">
                    {loading ? (
                        [...Array(5)].map((_, i) => <PostSkeleton key={i} />)
                    ) : posts.length > 0 ? (
                        posts.map(post => <PostCard key={post.id} post={post} />)
                    ) : (
                        <Card className="text-center py-12 glassmorphic">
                            <CardContent>
                                <p className="text-muted-foreground">No posts found matching your criteria.</p>
                                {searchTerm && <Button variant="link" onClick={() => setSearchTerm('')}>Clear search</Button>}
                            </CardContent>
                        </Card>
                    )}
                </div>
            </div>
        </AppLayout>
    );
}


// Individual Post Card Component
const PostCard: React.FC<{ post: CommunityPost }> = ({ post }) => {
    const PostIcon = typeIcons[post.type] || Text; // Fallback icon

     const timeAgo = (date: Date): string => {
        const seconds = Math.floor((new Date().getTime() - date.getTime()) / 1000);
        let interval = seconds / 31536000;
        if (interval > 1) return Math.floor(interval) + " years ago";
        interval = seconds / 2592000;
        if (interval > 1) return Math.floor(interval) + " months ago";
        interval = seconds / 86400;
        if (interval > 1) return Math.floor(interval) + " days ago";
        interval = seconds / 3600;
        if (interval > 1) return Math.floor(interval) + " hours ago";
        interval = seconds / 60;
        if (interval > 1) return Math.floor(interval) + " minutes ago";
        return Math.floor(seconds) + " seconds ago";
     };


    return (
        <Card className="shadow-md hover:shadow-lg transition-shadow duration-300 glassmorphic border border-border/60 overflow-hidden">
            <CardHeader className="p-4 md:p-5">
                <div className="flex items-center gap-3 mb-2">
                    <Avatar className="h-8 w-8 bg-secondary">
                        {/* Anonymous Avatar */}
                        <AvatarFallback>?</AvatarFallback>
                    </Avatar>
                    <CardTitle className="text-lg font-semibold leading-tight line-clamp-2">
                        <Link href={`/community/post/${post.id}`} className="hover:text-primary transition-colors">
                           {post.title}
                        </Link>
                    </CardTitle>
                    <Badge variant="outline" className="ml-auto capitalize text-xs hidden sm:inline-flex items-center gap-1 shrink-0">
                        <PostIcon className="h-3 w-3" />
                        {post.type}
                    </Badge>
                </div>
                <CardDescription className="text-sm line-clamp-3">
                    {post.excerpt}
                </CardDescription>
            </CardHeader>
            <CardFooter className="p-4 md:p-5 bg-card/50 border-t border-border/40 flex justify-between items-center text-xs text-muted-foreground">
                <div className="flex items-center gap-3">
                   <div className="flex flex-wrap gap-1">
                       {post.tags?.slice(0, 3).map(tag => (
                         <Badge key={tag} variant="secondary" className="text-xs font-normal">#{tag}</Badge>
                       ))}
                    </div>
                </div>
                <div className="flex items-center gap-4">
                    <span>{timeAgo(post.timestamp)}</span>
                    <div className="flex items-center gap-1">
                        <MessageCircle className="h-3.5 w-3.5" />
                        <span>{post.commentCount}</span>
                    </div>
                    <Link href={`/community/post/${post.id}`} className="text-primary hover:underline font-medium hidden sm:inline-block">
                       View Post <ArrowRight className="inline h-3 w-3" />
                    </Link>
                </div>
            </CardFooter>
        </Card>
    );
};

// Skeleton Loader for Post Card
const PostSkeleton = () => (
    <Card className="shadow-md glassmorphic border border-border/60 overflow-hidden">
        <CardHeader className="p-4 md:p-5">
            <div className="flex items-center gap-3 mb-2">
                <Skeleton className="h-8 w-8 rounded-full bg-muted/50" />
                <div className="space-y-1.5 flex-grow">
                   <Skeleton className="h-4 w-3/4 bg-muted/50" />
                   <Skeleton className="h-3 w-1/2 bg-muted/50" />
                </div>
                 <Skeleton className="h-5 w-12 rounded-full bg-muted/50 hidden sm:block" />
            </div>
             <div className="space-y-2 mt-1">
                 <Skeleton className="h-3 w-full bg-muted/50" />
                 <Skeleton className="h-3 w-5/6 bg-muted/50" />
             </div>
        </CardHeader>
        <CardFooter className="p-4 md:p-5 bg-card/50 border-t border-border/40 flex justify-between items-center">
             <div className="flex gap-2">
                <Skeleton className="h-5 w-12 rounded-full bg-muted/50" />
                <Skeleton className="h-5 w-16 rounded-full bg-muted/50" />
             </div>
             <div className="flex items-center gap-4">
                <Skeleton className="h-3 w-16 bg-muted/50" />
                <Skeleton className="h-3 w-8 bg-muted/50" />
             </div>
        </CardFooter>
    </Card>
);
