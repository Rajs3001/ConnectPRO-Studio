
"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from '@/components/ui/input';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'; // Added AvatarImage
import { Code, Heart, ImageIcon, Link as LinkIconLucid, MessageCircle, Plus, Search, Text, UserCircle, Share2, Repeat, Video, PlusCircle, Home, Users, Clapperboard } from 'lucide-react';
import Link from 'next/link';
import { Skeleton } from '@/components/ui/skeleton';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { useToast } from '@/hooks/use-toast';
import { Loader2 } from "lucide-react";
import CommunityProfileSection from "@/components/community/ProfileSection";
import CommunitySearchSection from "@/components/community/SearchSection";
import CommunityGroupsSection from "@/components/community/GroupsSection";
import CommunityMessagesSection from "@/components/community/MessagesSection";
import ProShortsSection from "@/components/community/ProShortsSection";
import NewCommunityPostPage from "@/app/community/new/page"; // Adjusted path
import SiteLoader from "@/components/shared/site-loader";
import { useAuth } from '@/hooks/useAuth'; // Import useAuth

// Mock data for community posts (replace with actual API fetching)

type CommunitySection = "feed" | "shorts" | "search" | "create" | "groups" | "messages" | "profile"; // Updated section order

interface CommunityPost {
    id: string;
    type: 'text' | 'image' | 'code' | 'link';
    // authorId: string; // Link post to an author for profile viewing later (even if displayed as Anonymous)
    authorName?: string; // Generated display name
    displayName: string; // Anonymous display name
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

const fetchCommunityPosts = async (filters: { query?: string; type?: string } = {}): Promise<CommunityPost[]> => {
    await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate network delay

    const allPosts: CommunityPost[] = [
        { id: 'p1', type: 'text', displayName: 'TechSeeker34', title: 'Navigating Career Change in Tech?', excerpt: 'Feeling stuck in my current role. Anyone successfully transitioned from non-tech to a dev role? Looking for advice and resources...', tags: ['career', 'tech', 'advice'], timestamp: new Date(Date.now() - 3600000), commentCount: 15, likeCount: 42, reshareCount: 5, likedByMe: false, resharedByMe: false },
        { id: 'p2', type: 'code', displayName: 'CodeWhisperer99', title: 'Python Script for Data Cleaning', content: '```python\nimport pandas as pd\n# ... rest of the script ...\n```', excerpt: 'Sharing a small script I wrote for cleaning CSV files. Hope it helps someone! #python #datascience', tags: ['python', 'data-science', 'code'], timestamp: new Date(Date.now() - 7200000), commentCount: 8, likeCount: 25, reshareCount: 2, likedByMe: true, resharedByMe: false },
        { id: 'p3', type: 'image', displayName: 'PixelDreamer1', title: 'My Remote Work Setup Inspiration', content: 'https://picsum.photos/seed/setup/800/600', excerpt: 'Finally happy with my home office setup! Thought I\'d share for inspiration. #remotework #productivity', tags: ['remote-work', 'setup', 'inspiration'], timestamp: new Date(Date.now() - 10800000), commentCount: 22, likeCount: 68, reshareCount: 12, likedByMe: false, resharedByMe: true },
        { id: 'p4', type: 'link', displayName: 'InfoHunter7', title: 'Useful Free Resource for Learning Docker', content: 'https://docs.docker.com/get-started/', excerpt: 'Found this comprehensive free tutorial on Docker basics. Highly recommended!', tags: ['docker', 'devops', 'learning', 'resource'], timestamp: new Date(Date.now() - 14400000), commentCount: 5, likeCount: 18, reshareCount: 3, likedByMe: false, resharedByMe: false },
        { id: 'p5', type: 'text', displayName: 'APIMastermind', title: 'Best Practices for API Design?', excerpt: 'What are some key principles you follow when designing RESTful APIs? Looking for different perspectives on versioning, authentication, error handling, and documentation.', tags: ['api', 'design', 'best-practices', 'backend'], timestamp: new Date(Date.now() - 18000000), commentCount: 30, likeCount: 95, reshareCount: 10, likedByMe: true, resharedByMe: true },
    ];

    // Client-side filtering for demo purposes
    return allPosts.filter((post) => {
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

// Updated section titles
const sectionTitles: Record<CommunitySection, string> = {
    feed: "Home", // Changed from "Community Feed"
    shorts: "Pro Shorts",
    search: "Search", // Changed from "Search Community"
    create: "Create Post",
    groups: "Groups", // Changed from "Community Groups"
    messages: "Messages", // Changed from "Messages & Chats"
    profile: "My Profile",
};


export default function CommunityPage() {
    const { user, loading: authLoading } = useAuth(); // Use auth hook
    const [posts, setPosts] = useState<CommunityPost[]>([]);
    const [loading, setLoading] = useState(true); // Combined loading state for page content
    const [activeSection, setActiveSection] = useState<CommunitySection>("feed");
    const router = useRouter();
    const { toast } = useToast();

    // Fetch data only when authenticated and auth loading is done
    useEffect(() => {
        if (authLoading) return; // Wait for auth check
        if (!user) {
           // This should ideally be handled by ProtectedRoute, but as a fallback:
           console.log("CommunityPage: No user found, redirecting might happen.");
           return;
        }

        const loadData = async () => {
            setLoading(true); // Set loading true for all section changes initially
             if (activeSection === "feed") {
                 const fetchedPosts = await fetchCommunityPosts({});
                 setPosts(fetchedPosts);
             }
            // Other sections load their own data within their components
            // Simulate a small delay for non-feed sections to show loader briefly
             await new Promise(resolve => setTimeout(resolve, 300));
            setLoading(false);
        };

        loadData();

    }, [activeSection, user, authLoading]); // Depend on user and authLoading

     const handleLike = (postId: string) => {
        // Ensure user is logged in (already checked by ProtectedRoute, but good practice)
        if (!user) {
            toast({ variant: "destructive", title: "Login Required", description: "You must be logged in to like posts."});
            return;
        }
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
        if (!user) {
            toast({ variant: "destructive", title: "Login Required", description: "You must be logged in to reshare posts."});
            return;
         }
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


     // Show main loader if auth is still checking or initial data is loading
     if (authLoading || loading) {
        return (
            <div className="flex items-center justify-center min-h-screen bg-background">
                 <SiteLoader size="lg" />
            </div>
        );
    }

    // If auth check complete but no user (shouldn't happen with ProtectedRoute, but safe)
    if (!user) {
         return (
             <div className="flex items-center justify-center min-h-screen bg-background">
                <p className="text-muted-foreground">Authentication required...</p>
             </div>
         );
     }


    return (
         <div className="bg-background min-h-screen flex flex-col" data-testid="community-page-container">
             {/* Community Header */}
            <header className="sticky top-0 z-40 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60" data-testid="community-header">
                <div className="container mx-auto flex h-16 items-center justify-between px-4 md:px-6">
                    {/* Display current section title */}
                    <h1 className="text-lg font-semibold text-primary font-poppins text-glow-primary" data-testid="community-section-title">
                        {sectionTitles[activeSection]}
                    </h1>
                    {/* Removed Back to Home button */}
                    {/* Placeholder for potential future actions */}
                    <div></div>
                </div>
             </header>

             {/* Main Content Area */}
             <main className="flex-grow container mx-auto py-8 max-w-4xl" data-testid="community-main-content">
                 {/* Conditional rendering based on activeSection */}
                 {activeSection === "feed" && (
                     <div className="space-y-0 border border-border/60 rounded-lg overflow-hidden bg-card max-h-[calc(100vh-14rem)] overflow-y-auto scrollbar-hide" data-testid="feed-post-list"> {/* Adjusted max-height and hide scrollbar */}
                        {posts.length > 0 ? (
                          posts.map((post) => (
                            <PostCard
                              key={post.id}
                              post={post}
                              onLike={handleLike}
                              onReshare={handleReshare}
                            />
                          ))
                        ) : (
                          <div className="text-center py-12" data-testid="no-posts-message">
                            <p className="text-muted-foreground">No posts available in the feed.</p>
                          </div>
                        )}
                     </div>
                 )}
                 {activeSection === "shorts" && <ProShortsSection data-testid="pro-shorts-section"/>}
                 {activeSection === "search" && <CommunitySearchSection data-testid="search-section"/>}
                 {activeSection === "create" && <NewCommunityPostPage data-testid="create-post-section"/>}
                 {activeSection === "groups" && <CommunityGroupsSection data-testid="groups-section"/>}
                 {activeSection === "messages" && <CommunityMessagesSection data-testid="messages-section"/>}
                 {activeSection === "profile" && <CommunityProfileSection data-testid="profile-section"/>}
             </main>

             {/* Community Bottom Navigation Bar (Fixed) */}
             <nav className="sticky bottom-0 z-40 w-full border-t border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60" data-testid="community-bottom-nav">
                 <div className="container mx-auto flex h-14 items-center justify-around px-4 md:px-6">
                      {/* Feed Icon */}
                      <button onClick={() => setActiveSection("feed")} className={cn("flex-1 flex flex-col items-center justify-center hover:text-primary transition-colors duration-200 relative", activeSection === "feed" ? "text-primary" : "text-muted-foreground")} data-testid="nav-button-feed">
                         <Home className="h-6 w-6" />
                          {activeSection === 'feed' && <span className="absolute bottom-0.5 left-1/2 -translate-x-1/2 w-6 h-0.5 bg-primary rounded-full" data-testid="nav-indicator-feed"></span>}
                      </button>

                      {/* Pro Shorts Icon */}
                      <button onClick={() => setActiveSection("shorts")} className={cn("flex-1 flex flex-col items-center justify-center hover:text-primary transition-colors duration-200 relative", activeSection === "shorts" ? "text-primary" : "text-muted-foreground")} data-testid="nav-button-shorts">
                          <Clapperboard className="h-6 w-6" />
                          {activeSection === 'shorts' && <span className="absolute bottom-0.5 left-1/2 -translate-x-1/2 w-6 h-0.5 bg-primary rounded-full" data-testid="nav-indicator-shorts"></span>}
                      </button>

                       {/* Search Icon */}
                       <button onClick={() => setActiveSection("search")} className={cn("flex-1 flex flex-col items-center justify-center hover:text-primary transition-colors duration-200 relative", activeSection === "search" ? "text-primary" : "text-muted-foreground")} data-testid="nav-button-search">
                          <Search className="h-6 w-6" />
                          {activeSection === 'search' && <span className="absolute bottom-0.5 left-1/2 -translate-x-1/2 w-6 h-0.5 bg-primary rounded-full" data-testid="nav-indicator-search"></span>}
                       </button>

                      {/* Create Icon (Centered, Larger, Background) */}
                      <button
                         onClick={() => setActiveSection("create")}
                         className={`flex-1 flex flex-col items-center justify-center relative -mt-4 group`} // Lift button up
                         aria-label="Create Post"
                         data-testid="nav-button-create"
                       >
                         <div className={`h-12 w-12 rounded-full flex items-center justify-center transition-all duration-300 ${activeSection === "create" ? "bg-primary shadow-lg scale-110" : "bg-secondary group-hover:bg-primary/20"}`}>
                            <PlusCircle className={`h-7 w-7 transition-colors duration-200 ${activeSection === "create" ? "text-primary-foreground" : "text-primary group-hover:text-primary"}`} />
                         </div>
                          {/* No text label for create button */}
                      </button>

                      {/* Groups Icon */}
                      <button onClick={() => setActiveSection("groups")} className={cn("flex-1 flex flex-col items-center justify-center hover:text-primary transition-colors duration-200 relative", activeSection === "groups" ? "text-primary" : "text-muted-foreground")} data-testid="nav-button-groups">
                          <Users className="h-6 w-6" />
                          {activeSection === 'groups' && <span className="absolute bottom-0.5 left-1/2 -translate-x-1/2 w-6 h-0.5 bg-primary rounded-full" data-testid="nav-indicator-groups"></span>}
                      </button>

                       {/* Messages Icon */}
                       <button onClick={() => setActiveSection("messages")} className={cn("flex-1 flex flex-col items-center justify-center hover:text-primary transition-colors duration-200 relative", activeSection === "messages" ? "text-primary" : "text-muted-foreground")} data-testid="nav-button-messages">
                           <MessageCircle className="h-6 w-6" />
                           {activeSection === 'messages' && <span className="absolute bottom-0.5 left-1/2 -translate-x-1/2 w-6 h-0.5 bg-primary rounded-full" data-testid="nav-indicator-messages"></span>}
                       </button>

                       {/* Profile Icon */}
                       <button onClick={() => setActiveSection("profile")} className={cn("flex-1 flex flex-col items-center justify-center hover:text-primary transition-colors duration-200 relative", activeSection === "profile" ? "text-primary" : "text-muted-foreground")} data-testid="nav-button-profile">
                          <UserCircle className="h-6 w-6" />
                          {activeSection === 'profile' && <span className="absolute bottom-0.5 left-1/2 -translate-x-1/2 w-6 h-0.5 bg-primary rounded-full" data-testid="nav-indicator-profile"></span>}
                       </button>
                 </div>
             </nav>
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
    const { user } = useAuth(); // Get user for interactions
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
            title: post.title || "ConnectPro Community Post",
            text: post.excerpt,
            url: shareUrl,
          });
          console.log("Shared successfully");
        } catch (error) {
          console.error("Error sharing:", error);
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
                    <Link href={`/community/post/${post.id}`} className="block mt-2 overflow-hidden rounded-lg border border-border/60 aspect-video" data-testid={`post-content-image-${post.id}`}>
                        <img src={post.content || `https://picsum.photos/seed/${post.id}/800/600`} alt={post.title} className="w-full h-full object-cover transition-transform duration-300 hover:scale-105" />
                    </Link>
                );
            case 'code':
                return (
                     <Link href={`/community/post/${post.id}`} className="block mt-2" data-testid={`post-content-code-${post.id}`}>
                        <div className="bg-muted/50 p-3 rounded-md text-xs overflow-x-auto max-h-40 border border-border/60">
                            <pre className="whitespace-pre-wrap"><code className="font-mono line-clamp-6">{post.content?.replace(/```.*\n|```/g, '')}</code></pre> {/* Basic code preview */}
                        </div>
                     </Link>
                );
             case 'link':
                return (
                     <Link href={post.content || '#'} target="_blank" rel="noopener noreferrer" className="block mt-2 border border-border/60 rounded-lg p-3 hover:bg-muted/50 transition-colors" data-testid={`post-content-link-${post.id}`}>
                         <p className="text-sm font-medium text-primary">{post.title}</p>
                         <p className="text-xs text-muted-foreground truncate">{post.content}</p>
                     </Link>
                );
            case 'text':
            default:
                return (
                    <Link href={`/community/post/${post.id}`} data-testid={`post-content-text-${post.id}`}>
                        <p className="mt-2 text-sm text-foreground/90 line-clamp-4 whitespace-pre-wrap">{post.excerpt}</p> {/* Use excerpt for text, allow wrapping */}
                    </Link>
                );
        }
    };

    // Get user's anonymous display name or ID if available
    const userDisplayName = user?.displayName || user?.uid || 'Anonymous';

    return (
        <Card className={cn(
            "shadow-none hover:bg-muted/30 transition-colors duration-150 border-b border-border/60 rounded-none last:border-b-0", // More like LinkedIn/Threads
            "flex p-4 gap-3" // Use flex layout
        )} data-testid={`post-card-${post.id}`}>
            {/* Avatar Column */}
            <div className="shrink-0" data-testid="post-avatar-column">
                 {/* Link Avatar to user's community profile */}
                <Link href={`/community/profile/${post.displayName.replace(/\s+/g, '-').toLowerCase()}`} data-testid={`post-author-link-${post.id}`}>
                    <Avatar className="h-10 w-10 bg-secondary cursor-pointer" data-testid="post-author-avatar">
                        {/* Generate avatar based on anonymous name */}
                        <AvatarImage src={`https://api.dicebear.com/8.x/initials/svg?seed=${post.displayName}`} alt={post.displayName} />
                        <AvatarFallback><UserCircle size={24} className="text-muted-foreground" /></AvatarFallback>
                    </Avatar>
                </Link>
            </div>

             {/* Content Column */}
             <div className="flex-grow overflow-hidden" data-testid="post-content-column"> {/* Added overflow-hidden */}
                 {/* Post Header */}
                 <div className="flex items-center justify-between gap-2" data-testid="post-header">
                     <div className="flex items-center gap-2 overflow-hidden" data-testid="post-header-info"> {/* Added overflow-hidden */}
                        <Link href={`/community/profile/${post.displayName.replace(/\s+/g, '-').toLowerCase()}`} data-testid={`post-author-name-link-${post.id}`}>
                             <span className="font-semibold text-sm truncate hover:underline cursor-pointer" data-testid="post-author-name">{post.displayName}</span>
                        </Link>
                         <span className="text-xs text-muted-foreground">&middot;</span>
                         <Link href={`/community/post/${post.id}`} className="text-xs text-muted-foreground hover:underline flex-shrink-0" data-testid="post-timestamp-link">{timeAgo(post.timestamp)}</Link>
                     </div>
                     {/* Optional: More actions button (...) */}
                 </div>

                 {/* Post Title (Optional, maybe integrate into content) */}
                 <Link href={`/community/post/${post.id}`} data-testid={`post-title-link-${post.id}`}>
                     <h3 className="font-semibold mt-1 line-clamp-2 hover:underline" data-testid="post-title">{post.title}</h3>
                 </Link>

                 {/* Content Preview */}
                 {renderContentPreview()}

                  {/* Tags */}
                  {post.tags && post.tags.length > 0 && (
                     <div className="mt-3 flex flex-wrap gap-1" data-testid="post-tags">
                        {post.tags.map(tag => (
                           <Badge key={tag} variant="secondary" className="text-xs font-normal cursor-pointer hover:bg-secondary/80" data-testid={`post-tag-${tag}`}>#{tag}</Badge>
                        ))}
                     </div>
                  )}

                 {/* Action Bar */}
                 <div className="mt-3 flex justify-between items-center text-muted-foreground max-w-md" data-testid="post-action-bar">
                      {/* Comment Button */}
                      <Button variant="ghost" size="sm" className="flex items-center gap-1.5 text-xs hover:text-blue-500" onClick={() => router.push(`/community/post/${post.id}#comments`)} data-testid="post-comment-button">
                         <MessageCircle size={16} />
                         <span data-testid="post-comment-count">{post.commentCount > 0 ? post.commentCount : ''}</span>
                      </Button>

                      {/* Reshare Button */}
                       <Button variant="ghost" size="sm" className={cn("flex items-center gap-1.5 text-xs", post.resharedByMe ? "text-green-500" : "hover:text-green-500")} onClick={() => onReshare(post.id)} data-testid="post-reshare-button">
                          <Repeat size={16} className={cn(post.resharedByMe ? "fill-current" : "")} />
                          <span data-testid="post-reshare-count">{post.reshareCount > 0 ? post.reshareCount : ''}</span>
                       </Button>

                       {/* Like Button */}
                       <Button variant="ghost" size="sm" className={cn("flex items-center gap-1.5 text-xs", post.likedByMe ? "text-red-500" : "hover:text-red-500")} onClick={() => onLike(post.id)} data-testid="post-like-button">
                           <Heart size={16} className={cn(post.likedByMe ? "fill-current" : "")}/>
                           <span data-testid="post-like-count">{post.likeCount > 0 ? post.likeCount : ''}</span>
                       </Button>

                       {/* Share Button */}
                       <Button variant="ghost" size="sm" className="flex items-center gap-1.5 text-xs hover:text-primary" onClick={handleShare} data-testid="post-share-button">
                           <Share2 size={16} />
                       </Button>

                      {/* Optional: Bookmark */}
                 </div>
             </div>
        </Card>
    );
};
