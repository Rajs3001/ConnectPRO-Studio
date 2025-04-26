
"use client";

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation'; // Use for redirection
import AppLayout from '@/components/layouts/app-layout'; // Assuming user is logged in
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { ArrowRight, Code, Filter, Heart, ImageIcon, Link as LinkIconLucid, MessageCircle, Plus, Search, Send, Text, UserCircle, Share2, Repeat } from 'lucide-react'; // Renamed LinkIcon to LinkIconLucid, added Share2, Repeat
import Link from 'next/link';
import { Skeleton } from '@/components/ui/skeleton';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils'; // Import cn
import { useToast } from '@/hooks/use-toast'; // Import useToast

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
    likeCount: number;
    reshareCount: number; // Added reshare count
    likedByMe?: boolean; // Added likedByMe
    resharedByMe?: boolean; // Added resharedByMe
}

// Simulate authentication check - Replace with actual auth logic
const useAuthCheck = () => {
    const router = useRouter();
    const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null); // Start as null

    useEffect(() => {
        // Simulate checking auth status (e.g., from context, local storage)
        const checkAuth = async () => {
            await new Promise(resolve => setTimeout(resolve, 100)); // Simulate async check
            const authStatus = true; // Placeholder: Assume user is logged in for now
            setIsAuthenticated(authStatus);
            if (!authStatus) {
                console.log("User not authenticated, redirecting to login...");
                router.push('/login/user?redirect=/community'); // Redirect to login if not authenticated
            }
        };
        checkAuth();
    }, [router]);

    return isAuthenticated; // Return the auth status
};


const fetchCommunityPosts = async (filters: { query?: string; type?: string } = {}): Promise<CommunityPost[]> => {
    await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate network delay

    const allPosts: CommunityPost[] = [
        { id: 'p1', type: 'text', title: 'Navigating Career Change in Tech?', excerpt: 'Feeling stuck in my current role. Anyone successfully transitioned from non-tech to a dev role? Looking for advice and resources...', tags: ['career', 'tech', 'advice'], timestamp: new Date(Date.now() - 3600000), commentCount: 15, likeCount: 42, reshareCount: 5, likedByMe: false, resharedByMe: false },
        { id: 'p2', type: 'code', title: 'Python Script for Data Cleaning', content: '```python\nimport pandas as pd\n# ... rest of the script ...\n```', excerpt: 'Sharing a small script I wrote for cleaning CSV files. Hope it helps someone! #python #datascience', tags: ['python', 'data-science', 'code'], timestamp: new Date(Date.now() - 7200000), commentCount: 8, likeCount: 25, reshareCount: 2, likedByMe: true, resharedByMe: false },
        { id: 'p3', type: 'image', title: 'My Remote Work Setup Inspiration', content: 'https://picsum.photos/seed/setup/800/600', excerpt: 'Finally happy with my home office setup! Thought I\'d share for inspiration. #remotework #productivity', tags: ['remote-work', 'setup', 'inspiration'], timestamp: new Date(Date.now() - 10800000), commentCount: 22, likeCount: 68, reshareCount: 12, likedByMe: false, resharedByMe: true },
        { id: 'p4', type: 'link', title: 'Useful Free Resource for Learning Docker', content: 'https://docs.docker.com/get-started/', excerpt: 'Found this comprehensive free tutorial on Docker basics. Highly recommended!', tags: ['docker', 'devops', 'learning', 'resource'], timestamp: new Date(Date.now() - 14400000), commentCount: 5, likeCount: 18, reshareCount: 3, likedByMe: false, resharedByMe: false },
        { id: 'p5', type: 'text', title: 'Best Practices for API Design?', excerpt: 'What are some key principles you follow when designing RESTful APIs? Looking for different perspectives.', tags: ['api', 'design', 'best-practices', 'backend'], timestamp: new Date(Date.now() - 18000000), commentCount: 30, likeCount: 95, reshareCount: 10, likedByMe: true, resharedByMe: true },
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
    const isAuthenticated = useAuthCheck();
    const [posts, setPosts] = useState<CommunityPost[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        if (isAuthenticated === false) return; // Don't fetch if not authenticated (or still checking)

        const loadPosts = async () => {
            setLoading(true);
            const fetchedPosts = await fetchCommunityPosts({ query: searchTerm });
            setPosts(fetchedPosts);
            setLoading(false);
        };

        if (isAuthenticated === true) {
           loadPosts();
        }
    }, [searchTerm, isAuthenticated]);

     const handleLike = (postId: string) => {
        setPosts(prevPosts =>
            prevPosts.map(post =>
                post.id === postId
                    ? {
                        ...post,
                        likedByMe: !post.likedByMe,
                        likeCount: post.likedByMe ? post.likeCount - 1 : post.likeCount + 1
                      }
                    : post
            )
        );
        // TODO: API call to toggle like status
        console.log(`Toggled like for post ${postId}`);
    };

     const handleReshare = (postId: string) => {
        setPosts(prevPosts =>
            prevPosts.map(post =>
                post.id === postId
                    ? {
                        ...post,
                        resharedByMe: !post.resharedByMe,
                        reshareCount: post.resharedByMe ? post.reshareCount - 1 : post.reshareCount + 1
                      }
                    : post
            )
        );
         // TODO: API call to toggle reshare status
         console.log(`Toggled reshare for post ${postId}`);
     };


    const handleSearch = (e: React.FormEvent) => {
      e.preventDefault();
      // Fetching is handled by useEffect on searchTerm change
      console.log("Searching for:", searchTerm);
    };

     // Show loading or require login screen
     if (isAuthenticated === null) {
        return (
            <div className="flex items-center justify-center min-h-screen bg-background">
                <p className="text-muted-foreground">Checking authentication...</p>
                 {/* Optionally add a spinner */}
            </div>
        );
    }
    if (isAuthenticated === false) {
         // The hook redirects, but we can show a message briefly
         return (
             <div className="flex items-center justify-center min-h-screen bg-background">
                <p className="text-muted-foreground">Redirecting to login...</p>
             </div>
         );
     }


    return (
        // Use a different layout or no layout if community is standalone
         <div className="bg-background min-h-screen">
             {/* Community Header */}
            <header className="sticky top-0 z-40 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
                <div className="container mx-auto flex h-16 items-center justify-between px-4 md:px-6">
                    <Link href="/" className="text-2xl font-bold text-primary font-poppins text-glow-primary">
                        ConnectPro Community
                     </Link>
                    <div className="flex items-center gap-4">
                        <Link href="/community/new">
                             <Button size="sm" className="bg-primary text-primary-foreground hover:bg-primary/90">
                                <Plus className="mr-1 h-4 w-4" /> Create Post
                             </Button>
                        </Link>
                         {/* Placeholder for User Menu or Profile Button */}
                         <Avatar className="h-9 w-9">
                             {/* <AvatarImage src="user-avatar.png" /> */}
                            <AvatarFallback><UserCircle size={20} /></AvatarFallback>
                         </Avatar>
                     </div>
                </div>
             </header>

            <main className="container mx-auto py-8 max-w-2xl"> {/* Centered content, similar to X/Threads */}

                {/* Removed large title and redundant Create Post button */}

                {/* Search Bar (Optional) */}
                 <form onSubmit={handleSearch} className="mb-6 p-3 bg-card border border-border/60 rounded-lg shadow-sm flex items-center gap-3">
                    <Search className="h-4 w-4 text-muted-foreground" />
                     <Input
                        placeholder="Search community..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="flex-grow bg-transparent border-none focus-visible:ring-0 focus-visible:ring-offset-0 h-auto p-0 text-sm"
                     />
                     {/* <Button type="submit" size="sm" variant="ghost" className="text-primary">Search</Button> */}
                 </form>

                {/* Posts Feed */}
                <div className="space-y-0 border border-border/60 rounded-lg overflow-hidden bg-card"> {/* Container for posts */}
                    {loading ? (
                        [...Array(5)].map((_, i) => <PostSkeleton key={i} />)
                    ) : posts.length > 0 ? (
                        posts.map(post => (
                            <PostCard
                                key={post.id}
                                post={post}
                                onLike={handleLike}
                                onReshare={handleReshare}
                            />
                        ))
                    ) : (
                        <div className="text-center py-12">
                            <p className="text-muted-foreground">No posts found.</p>
                            {searchTerm && <Button variant="link" onClick={() => setSearchTerm('')}>Clear search</Button>}
                        </div>
                    )}
                </div>
            </main>
        </div>
    );
}


// Updated Post Card Component (Instagram/Threads like)
interface PostCardProps {
  post: CommunityPost;
  onLike: (postId: string) => void;
  onReshare: (postId: string) => void;
}

const PostCard: React.FC<PostCardProps> = ({ post, onLike, onReshare }) => {
    const router = useRouter();
    const { toast } = useToast();
    const PostIcon = typeIcons[post.type] || Text; // Keep this mapping

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

    const handleShare = async () => {
        const shareUrl = `${window.location.origin}/community/post/${post.id}`;
        if (navigator.share) {
          try {
            await navigator.share({
              title: post.title || 'ConnectPro Community Post',
              text: post.excerpt,
              url: shareUrl,
            });
            console.log('Shared successfully');
          } catch (error) {
            console.error('Error sharing:', error);
            toast({ variant: "destructive", title: "Sharing Failed", description: "Could not share this post." });
          }
        } else {
            // Fallback for browsers that don't support navigator.share
             try {
                await navigator.clipboard.writeText(shareUrl);
                toast({ title: "Link Copied", description: "Post link copied to clipboard." });
             } catch (err) {
                 console.error('Failed to copy link: ', err);
                 toast({ variant: "destructive", title: "Copy Failed", description: "Could not copy post link." });
             }
        }
      };

    const renderContentPreview = () => {
        switch (post.type) {
            case 'image':
                return (
                    <Link href={`/community/post/${post.id}`} className="block mt-2 overflow-hidden rounded-lg border border-border/60 aspect-video">
                        <img src={post.content} alt={post.title} className="w-full h-full object-cover transition-transform duration-300 hover:scale-105" />
                    </Link>
                );
            case 'code':
                return (
                     <Link href={`/community/post/${post.id}`} className="block mt-2">
                        <div className="bg-muted/50 p-3 rounded-md text-xs overflow-x-auto max-h-40 border border-border/60">
                            <pre className="whitespace-pre-wrap"><code className="font-mono line-clamp-6">{post.content?.replace(/```.*\n|```/g, '')}</code></pre> {/* Basic code preview */}
                        </div>
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
                        <p className="mt-2 text-sm text-foreground/90 line-clamp-4 whitespace-pre-wrap">{post.excerpt}</p> {/* Use excerpt for text, allow wrapping */}
                    </Link>
                );
        }
    };

    return (
        <Card className={cn(
            "shadow-none hover:bg-muted/30 transition-colors duration-150 border-b border-border/60 rounded-none last:border-b-0", // More like Twitter/Threads
            "flex p-4 gap-3" // Use flex layout
        )}>
            {/* Avatar Column */}
            <div className="shrink-0">
                <Avatar className="h-10 w-10 bg-secondary">
                    <AvatarFallback><UserCircle size={24} className="text-muted-foreground" /></AvatarFallback>
                </Avatar>
                {/* Optional: Add a vertical line connector for threads view */}
                 {/* <div className="h-full w-0.5 bg-border/40 mx-auto mt-2"></div> */}
            </div>

             {/* Content Column */}
             <div className="flex-grow overflow-hidden"> {/* Added overflow-hidden */}
                 {/* Post Header */}
                 <div className="flex items-center justify-between gap-2">
                     <div className="flex items-center gap-2 overflow-hidden"> {/* Added overflow-hidden */}
                         <span className="font-semibold text-sm truncate">Anonymous</span> {/* Truncate if needed */}
                         <span className="text-xs text-muted-foreground">&middot;</span>
                         <Link href={`/community/post/${post.id}`} className="text-xs text-muted-foreground hover:underline flex-shrink-0">{timeAgo(post.timestamp)}</Link>
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
                 <div className="mt-3 flex justify-between items-center text-muted-foreground max-w-md">
                      {/* Comment Button */}
                      <Button variant="ghost" size="sm" className="flex items-center gap-1.5 text-xs hover:text-blue-500" onClick={() => router.push(`/community/post/${post.id}#comments`)}>
                         <MessageCircle size={16} />
                         <span>{post.commentCount > 0 ? post.commentCount : ''}</span>
                      </Button>

                      {/* Reshare Button */}
                       <Button variant="ghost" size="sm" className={cn("flex items-center gap-1.5 text-xs", post.resharedByMe ? "text-green-500" : "hover:text-green-500")} onClick={() => onReshare(post.id)}>
                          <Repeat size={16} className={cn(post.resharedByMe ? "fill-current" : "")} />
                          <span>{post.reshareCount > 0 ? post.reshareCount : ''}</span>
                       </Button>

                       {/* Like Button */}
                       <Button variant="ghost" size="sm" className={cn("flex items-center gap-1.5 text-xs", post.likedByMe ? "text-red-500" : "hover:text-red-500")} onClick={() => onLike(post.id)}>
                           <Heart size={16} className={cn(post.likedByMe ? "fill-current" : "")}/>
                           <span>{post.likeCount > 0 ? post.likeCount : ''}</span>
                       </Button>

                       {/* Share Button */}
                       <Button variant="ghost" size="sm" className="flex items-center gap-1.5 text-xs hover:text-primary" onClick={handleShare}>
                           <Share2 size={16} />
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
             <div className="flex justify-between items-center max-w-md pt-1">
                 <Skeleton className="h-5 w-8 bg-muted/50" />
                 <Skeleton className="h-5 w-8 bg-muted/50" />
                 <Skeleton className="h-5 w-8 bg-muted/50" />
                  <Skeleton className="h-5 w-8 bg-muted/50" />
             </div>
        </div>
    </Card>
);
