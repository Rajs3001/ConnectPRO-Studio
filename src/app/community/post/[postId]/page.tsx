
"use client";

import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useRouter } from 'next/navigation';
// Removed AppLayout import, assuming standalone page now
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card'; // Removed Title, Description
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Skeleton } from '@/components/ui/skeleton';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { ArrowLeft, Code, Heart, ImageIcon, Link as LinkIconLucid, MessageCircle, Send, Text, UserCircle, Share2, Repeat } from 'lucide-react'; // Renamed LinkIcon, added Share2, Repeat
import { useToast } from '@/hooks/use-toast';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { cn } from '@/lib/utils'; // Import cn
import Link from 'next/link'; // Import Link
import SiteLoader from '@/components/shared/site-loader'; // Import SiteLoader

// Mock data (replace with actual API fetching)
interface CommunityPost {
    id: string;
    type: 'text' | 'image' | 'code' | 'link';
    title: string;
    content: string; // Full content
    tags?: string[];
    timestamp: Date;
    commentCount: number;
    likeCount: number;
    reshareCount: number; // Added reshare count
    likedByMe?: boolean;
    resharedByMe?: boolean;
}

interface Comment {
    id: string;
    content: string;
    timestamp: Date;
    likeCount: number;
    likedByMe?: boolean; // Added likedByMe for comments
    reshareCount?: number; // Optional reshare for comments
    resharedByMe?: boolean; // Optional reshare for comments
}

// Simulate authentication check - Replace with actual auth logic
const useAuthCheck = () => {
    const router = useRouter();
    const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);

    useEffect(() => {
        const checkAuth = async () => {
            await new Promise(resolve => setTimeout(resolve, 100));
            const authStatus = true; // Assume logged in
            setIsAuthenticated(authStatus);
            if (!authStatus) {
                const currentPath = window.location.pathname;
                router.push(`/login/user?redirect=${currentPath}`);
            }
        };
        checkAuth();
    }, [router]);

    return isAuthenticated;
};


const fetchPostDetails = async (postId: string): Promise<CommunityPost | null> => {
    await new Promise(resolve => setTimeout(resolve, 700));
     const posts: Record<string, CommunityPost> = {
        'p1': { id: 'p1', type: 'text', title: 'Navigating Career Change in Tech?', content: 'Feeling stuck in my current role. Anyone successfully transitioned from non-tech to a dev role? Looking for advice and resources on building a portfolio and networking. Any bootcamps worth it?', tags: ['career', 'tech', 'advice', 'portfolio'], timestamp: new Date(Date.now() - 3600000), commentCount: 15, likeCount: 42, reshareCount: 5, likedByMe: false, resharedByMe: false },
        'p2': { id: 'p2', type: 'code', title: 'Python Script for Data Cleaning', content: '```python\nimport pandas as pd\n\ndef clean_csv(filepath):\n    df = pd.read_csv(filepath)\n    # Example: Drop rows with missing values\n    df.dropna(inplace=True)\n    # Example: Convert column to numeric\n    df[\'numeric_col\'] = pd.to_numeric(df[\'numeric_col\'], errors=\'coerce\')\n    print("Cleaned DataFrame head:")\n    print(df.head())\n    return df\n\n# Usage:\n# clean_csv(\'your_data.csv\')\n```\nSharing a small script I wrote for cleaning CSV files using Pandas. Hope it helps someone!', tags: ['python', 'data-science', 'code', 'pandas'], timestamp: new Date(Date.now() - 7200000), commentCount: 8, likeCount: 25, reshareCount: 2, likedByMe: true, resharedByMe: false },
        'p3': { id: 'p3', type: 'image', title: 'My Remote Work Setup Inspiration', content: 'https://picsum.photos/seed/setup/800/600', tags: ['remote-work', 'setup', 'inspiration', 'home-office'], timestamp: new Date(Date.now() - 10800000), commentCount: 22, likeCount: 68, reshareCount: 12, likedByMe: false, resharedByMe: true },
        'p4': { id: 'p4', type: 'link', title: 'Useful Free Resource for Learning Docker', content: 'https://docs.docker.com/get-started/', tags: ['docker', 'devops', 'learning', 'resource', 'free'], timestamp: new Date(Date.now() - 14400000), commentCount: 5, likeCount: 18, reshareCount: 3, likedByMe: false, resharedByMe: false },
        'p5': { id: 'p5', type: 'text', title: 'Best Practices for API Design?', content: 'What are some key principles you follow when designing RESTful APIs? Looking for different perspectives on versioning, authentication, error handling, and documentation.', tags: ['api', 'design', 'best-practices', 'backend', 'rest'], timestamp: new Date(Date.now() - 18000000), commentCount: 30, likeCount: 95, reshareCount: 10, likedByMe: true, resharedByMe: true },
     };
    return posts[postId] || null;
};

const fetchPostComments = async (postId: string): Promise<Comment[]> => {
    await new Promise(resolve => setTimeout(resolve, 1000)); // Increased delay
    const commentBase = `Comment on post ${postId}`;
    const count = Math.floor(Math.random() * 10) + 1;
    return Array.from({ length: count }, (_, i) => ({
        id: `c${postId}-${i + 1}`,
        content: `${commentBase} - response number ${i + 1}. Lorem ipsum dolor sit amet, consectetur adipiscing elit. \n\nProin gravida nibh vel velit auctor aliquet. Aenean sollicitudin, lorem quis bibendum auctor.`,
        timestamp: new Date(Date.now() - (i + 1) * 60000 * (Math.random() * 30 + 5)),
        likeCount: Math.floor(Math.random() * 20),
        likedByMe: Math.random() > 0.7, // Randomly liked
        reshareCount: Math.floor(Math.random() * 5),
        resharedByMe: Math.random() > 0.9, // Randomly reshared
    })).sort((a, b) => a.timestamp.getTime() - b.timestamp.getTime());
};

const postComment = async (postId: string, content: string): Promise<Comment> => {
     await new Promise(resolve => setTimeout(resolve, 800));
     console.log(`Posting comment to ${postId}: ${content}`);
     return {
         id: `c${postId}-new-${Date.now()}`,
         content: content,
         timestamp: new Date(),
         likeCount: 0,
         likedByMe: false,
         reshareCount: 0,
         resharedByMe: false,
     };
 };

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
    return "now";
};


export default function CommunityPostPage() {
    const isAuthenticated = useAuthCheck();
    const params = useParams();
    const router = useRouter();
    const { toast } = useToast();
    const postId = params.postId as string;

    const [post, setPost] = useState<CommunityPost | null>(null);
    const [comments, setComments] = useState<Comment[]>([]);
    const [newComment, setNewComment] = useState('');
    const [loadingPost, setLoadingPost] = useState(true);
    const [loadingComments, setLoadingComments] = useState(true);
    const [postingComment, setPostingComment] = useState(false);

    useEffect(() => {
        if (!postId || isAuthenticated === false) return; // Check auth status

        const loadData = async () => {
            setLoadingPost(true);
            setLoadingComments(true);
            try {
                const [postDetails, postComments] = await Promise.all([
                    fetchPostDetails(postId),
                    fetchPostComments(postId),
                ]);
                 setPost(postDetails);
                 // Sort comments newest first for display
                 setComments(postComments.sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime()));
            } catch (error) {
                console.error("Failed to load post details or comments:", error);
                toast({ variant: "destructive", title: "Error", description: "Could not load the post or comments." });
            } finally {
                 setLoadingPost(false); // Stop post loading first
                 // Delay stopping comment loading slightly for smoother feel
                 setTimeout(() => setLoadingComments(false), 300);
            }
        };

        if (isAuthenticated === true) {
          loadData();
        }
    }, [postId, toast, isAuthenticated]);


     const handleLikePost = () => {
        if (!post) return;
        setPost(prevPost => {
            if (!prevPost) return null;
            return {
                ...prevPost,
                likedByMe: !prevPost.likedByMe,
                likeCount: prevPost.likedByMe ? prevPost.likeCount - 1 : prevPost.likeCount + 1
            };
        });
         // TODO: API call to toggle post like status
         console.log(`Toggled like for post ${postId}`);
     };

     const handleResharePost = () => {
        if (!post) return;
        setPost(prevPost => {
            if (!prevPost) return null;
            return {
                 ...prevPost,
                 resharedByMe: !prevPost.resharedByMe,
                 reshareCount: prevPost.resharedByMe ? prevPost.reshareCount - 1 : prevPost.reshareCount + 1
             };
        });
         // TODO: API call to toggle post reshare status
         console.log(`Toggled reshare for post ${postId}`);
     };

     const handleLikeComment = (commentId: string) => {
         setComments(prevComments =>
             prevComments.map(comment =>
                 comment.id === commentId
                     ? {
                         ...comment,
                         likedByMe: !comment.likedByMe,
                         likeCount: comment.likedByMe ? comment.likeCount - 1 : comment.likeCount + 1
                       }
                     : comment
             )
         );
         // TODO: API call to toggle comment like status
         console.log(`Toggled like for comment ${commentId}`);
      };

      const handleReshareComment = (commentId: string) => {
           setComments(prevComments =>
              prevComments.map(comment =>
                  comment.id === commentId
                      ? {
                          ...comment,
                          resharedByMe: !comment.resharedByMe,
                          reshareCount: comment.resharedByMe ? (comment.reshareCount || 1) - 1 : (comment.reshareCount || 0) + 1
                        }
                      : comment
              )
          );
           // TODO: API call to toggle comment reshare status
           console.log(`Toggled reshare for comment ${commentId}`);
       };

       const handleShare = async () => {
           const shareUrl = window.location.href;
           if (navigator.share) {
               try {
                 await navigator.share({
                   title: post?.title || 'ConnectPro Community Post',
                   text: post?.content.substring(0, 100) || 'Check out this post on ConnectPro Community',
                   url: shareUrl,
                 });
                 console.log('Shared successfully');
               } catch (error) {
                 console.error('Error sharing:', error);
                 toast({ variant: "destructive", title: "Sharing Failed", description: "Could not share this post." });
               }
             } else {
                try {
                   await navigator.clipboard.writeText(shareUrl);
                   toast({ title: "Link Copied", description: "Post link copied to clipboard." });
                } catch (err) {
                    console.error('Failed to copy link: ', err);
                    toast({ variant: "destructive", title: "Copy Failed", description: "Could not copy post link." });
                }
             }
         };


    const handlePostComment = async (e: React.FormEvent) => {
         e.preventDefault();
         if (!newComment.trim() || postingComment || !post) return;

         setPostingComment(true);
         try {
             const postedComment = await postComment(post.id, newComment);
             setComments(prev => [postedComment, ...prev]); // Add to the beginning (newest first)
             setNewComment('');
             toast({ title: "Comment Posted", description: "Your anonymous comment has been added." });
             // Update comment count on post object
             setPost(prev => prev ? { ...prev, commentCount: prev.commentCount + 1 } : null);
         } catch (error) {
              console.error("Failed to post comment:", error);
              toast({ variant: "destructive", title: "Error", description: "Could not post your comment." });
         } finally {
              setPostingComment(false);
         }
     };

    const renderContent = (p: CommunityPost) => {
        switch (p.type) {
            case 'image':
                return <img src={p.content} alt={p.title} className="mt-2 rounded-lg border border-border/60 w-full object-contain max-h-[70vh]" />;
            case 'code':
                return <ReactMarkdown remarkPlugins={[remarkGfm]} className="prose prose-sm md:prose-base dark:prose-invert max-w-none prose-pre:bg-muted prose-pre:p-4 prose-pre:rounded-md mt-2">{p.content}</ReactMarkdown>;
            case 'link':
                return (
                    <a href={p.content} target="_blank" rel="noopener noreferrer" className="block mt-2 border border-border/60 rounded-lg p-4 hover:bg-muted/50 transition-colors">
                        <p className="font-medium text-primary">{p.title}</p>
                        <p className="text-sm text-muted-foreground break-all">{p.content}</p>
                    </a>
                );
            case 'text':
            default:
                return <ReactMarkdown remarkPlugins={[remarkGfm]} className="prose prose-sm md:prose-base dark:prose-invert max-w-none mt-2 whitespace-pre-wrap">{p.content}</ReactMarkdown>;
        }
    };

      // Show loading or require login screen
      if (isAuthenticated === null) {
         return (
             <div className="flex items-center justify-center min-h-screen bg-background">
                 <SiteLoader size="lg" />
             </div>
         );
     }
     if (isAuthenticated === false) {
          return (
              <div className="flex items-center justify-center min-h-screen bg-background">
                 <p className="text-muted-foreground">Redirecting to login...</p>
              </div>
          );
      }


    return (
         // Removed AppLayout, using simple div wrapper
         <div className="bg-background min-h-screen">
             {/* Community Header */}
             <header className="sticky top-0 z-40 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
                 <div className="container mx-auto flex h-16 items-center justify-between px-4 md:px-6">
                      {/* Back Button */}
                     <Button variant="ghost" size="icon" className="text-foreground" onClick={() => router.back()}>
                         <ArrowLeft size={20} />
                     </Button>
                     <h1 className="text-lg font-semibold text-primary font-poppins text-glow-primary">
                         Post Details
                     </h1>
                      {/* Placeholder for User Menu or Profile Button */}
                     <Avatar className="h-9 w-9">
                         {/* <AvatarImage src="user-avatar.png" /> */}
                         <AvatarFallback><UserCircle size={20} /></AvatarFallback>
                      </Avatar>
                 </div>
             </header>

            <main className="container mx-auto py-6 max-w-2xl">
                {/* Post Details */}
                {loadingPost ? (
                    <PostDetailsSkeleton />
                ) : post ? (
                    <Card className="mb-6 shadow-none border-none rounded-none"> {/* Remove card look */}
                         <CardHeader className="flex flex-row gap-3 px-4 pt-4 pb-2">
                            <Avatar className="h-10 w-10 bg-secondary">
                                <AvatarFallback><UserCircle size={24} className="text-muted-foreground" /></AvatarFallback>
                            </Avatar>
                            <div className="flex-grow">
                                <div className="flex items-center justify-between">
                                    <div className='flex items-center gap-2'>
                                        <span className="font-semibold text-sm">Anonymous</span>
                                        <span className="text-xs text-muted-foreground">&middot;</span>
                                         <span className="text-xs text-muted-foreground">{timeAgo(post.timestamp)}</span>
                                    </div>
                                     {/* More actions button (...) */}
                                </div>
                                 {/* Title can be optional or integrated */}
                                 <h2 className="text-lg font-semibold mt-0.5">{post.title}</h2>
                            </div>
                         </CardHeader>
                         <CardContent className="px-4 pt-1 pb-3">
                            {renderContent(post)}
                             {/* Tags */}
                             {post.tags && post.tags.length > 0 && (
                                <div className="mt-4 flex flex-wrap gap-1">
                                    {post.tags.map(tag => (
                                        <Badge key={tag} variant="secondary" className="text-xs font-normal cursor-pointer hover:bg-secondary/80">#{tag}</Badge>
                                    ))}
                                </div>
                             )}
                         </CardContent>
                         {/* Stats and Actions */}
                          <div className="px-4 pt-3 pb-2 border-t border-border/60 flex items-center gap-4 text-xs text-muted-foreground">
                            <span>{post.likeCount} Likes</span>
                            <span>{post.commentCount} Comments</span>
                            <span>{post.reshareCount} Reshares</span>
                          </div>
                         <CardFooter className="px-4 py-2 border-t border-border/60 flex justify-around items-center text-muted-foreground">
                              {/* Action Bar */}
                              <Button variant="ghost" size="sm" className={cn("flex items-center gap-1.5 text-sm hover:text-blue-500", "flex-1 justify-center")} onClick={() => document.getElementById('new-comment')?.focus()}>
                                 <MessageCircle size={18} />
                                 <span className="ml-1 hidden sm:inline">Comment</span>
                              </Button>
                               <Button variant="ghost" size="sm" className={cn("flex items-center gap-1.5 text-sm", post.resharedByMe ? "text-green-500" : "hover:text-green-500", "flex-1 justify-center")} onClick={handleResharePost}>
                                  <Repeat size={18} className={cn(post.resharedByMe ? "fill-current" : "")}/>
                                  <span className="ml-1 hidden sm:inline">Reshare</span>
                               </Button>
                               <Button variant="ghost" size="sm" className={cn("flex items-center gap-1.5 text-sm", post.likedByMe ? "text-red-500" : "hover:text-red-500", "flex-1 justify-center")} onClick={handleLikePost}>
                                   <Heart size={18} className={cn(post.likedByMe ? "fill-current" : "")}/>
                                   <span className="ml-1 hidden sm:inline">Like</span>
                               </Button>
                               <Button variant="ghost" size="sm" className={cn("flex items-center gap-1.5 text-sm hover:text-primary", "flex-1 justify-center")} onClick={handleShare}>
                                   <Share2 size={18} />
                                   <span className="ml-1 hidden sm:inline">Share</span>
                               </Button>
                         </CardFooter>
                    </Card>
                ) : (
                    <Card className="text-center py-12 bg-card border border-destructive/50">
                        <CardContent>
                            <p className="text-destructive font-semibold">Post not found.</p>
                            <p className="text-muted-foreground text-sm mt-1">The post may have been removed or the link is incorrect.</p>
                             <Button variant="outline" size="sm" className="mt-4" onClick={() => router.push('/community')}>
                                Go to Community Feed
                            </Button>
                        </CardContent>
                    </Card>
                )}

                {/* Add Comment Form */}
                 {post && (
                     <Card className="mb-6 border-t border-b border-border/60 shadow-none rounded-none">
                         <form onSubmit={handlePostComment}>
                             <CardContent className="p-4 flex gap-3 items-start">
                                  <Avatar className="h-10 w-10 bg-secondary mt-1 shrink-0">
                                     <AvatarFallback><UserCircle size={24} className="text-muted-foreground" /></AvatarFallback>
                                  </Avatar>
                                 <div className="flex-grow">
                                     <Label htmlFor="new-comment" className="sr-only">Add your comment</Label>
                                     <Textarea
                                         id="new-comment"
                                         rows={2} // Reduced rows
                                         placeholder="Post your reply..."
                                         value={newComment}
                                         onChange={(e) => setNewComment(e.target.value)}
                                         disabled={postingComment || loadingPost}
                                         required
                                         className="mb-3 bg-background/80 focus:bg-background border-border/60 focus:ring-primary text-sm resize-none" // No resize
                                     />
                                     <div className="flex justify-end">
                                          <Button type="submit" disabled={postingComment || !newComment.trim()} className="bg-primary text-primary-foreground hover:bg-primary/90 rounded-full px-4 h-8 text-xs">
                                              {postingComment ? 'Posting...' : 'Reply'}
                                          </Button>
                                      </div>
                                 </div>
                             </CardContent>
                         </form>
                      </Card>
                 )}

                {/* Comments Section */}
                 <div className="mt-0 border-t border-border/60" id="comments"> {/* Anchor for comment button */}
                      {loadingComments ? (
                           <div className="flex items-center justify-center py-8">
                              <SiteLoader size="md" />
                           </div>
                      ) : comments.length > 0 ? (
                          comments.map(comment => (
                               <CommentCard
                                   key={comment.id}
                                   comment={comment}
                                   onLike={handleLikeComment}
                                   onReshare={handleReshareComment} // Pass down reshare handler
                               />
                          ))
                      ) : !loadingPost && post ? ( // Only show if post loaded and no comments
                           <p className="text-muted-foreground text-center py-8 text-sm">Be the first to comment.</p>
                      ) : null }
                  </div>
            </main>
        </div>
    );
}


// Updated Comment Card (Threads/Twitter style)
interface CommentCardProps {
  comment: Comment;
  onLike: (commentId: string) => void;
  onReshare: (commentId: string) => void; // Added onReshare prop
}

const CommentCard: React.FC<CommentCardProps> = ({ comment, onLike, onReshare }) => (
     <Card className={cn(
        "shadow-none hover:bg-muted/30 transition-colors duration-150 border-b border-border/60 rounded-none last:border-b-0", // More like Twitter/Threads
        "flex p-4 gap-3" // Use flex layout
    )}>
         {/* Avatar Column */}
        <div className="shrink-0">
            <Avatar className="h-10 w-10 bg-secondary">
                <AvatarFallback><UserCircle size={24} className="text-muted-foreground" /></AvatarFallback>
            </Avatar>
            {/* Optional: Vertical line connector */}
        </div>

        {/* Content Column */}
        <div className="flex-grow overflow-hidden"> {/* Added overflow-hidden */}
            {/* Comment Header */}
            <div className="flex items-center justify-between gap-2">
                 <div className="flex items-center gap-2 overflow-hidden"> {/* Added overflow-hidden */}
                     <span className="font-semibold text-sm truncate">Anonymous</span> {/* Truncate if needed */}
                     <span className="text-xs text-muted-foreground">&middot;</span>
                     <span className="text-xs text-muted-foreground flex-shrink-0">{timeAgo(comment.timestamp)}</span>
                 </div>
                 {/* Optional: More actions button (...) */}
            </div>

             {/* Comment Content */}
            <div className="mt-1 text-sm text-foreground/90 whitespace-pre-wrap"> {/* Allow line breaks */}
                 <ReactMarkdown remarkPlugins={[remarkGfm]} className="prose prose-sm dark:prose-invert max-w-none">
                      {comment.content}
                  </ReactMarkdown>
            </div>


             {/* Action Bar */}
             <div className="mt-2 flex items-center text-muted-foreground -ml-2">
                  {/* Reply Button (placeholder) */}
                   <Button variant="ghost" size="sm" className="flex items-center gap-1.5 text-xs hover:text-blue-500">
                      <MessageCircle size={16} />
                      {/* Reply count if nested */}
                   </Button>
                   {/* Reshare Button */}
                   <Button variant="ghost" size="sm" className={cn("flex items-center gap-1.5 text-xs", comment.resharedByMe ? "text-green-500" : "hover:text-green-500")} onClick={() => onReshare(comment.id)}>
                      <Repeat size={16} className={cn(comment.resharedByMe ? "fill-current" : "")}/>
                      <span>{comment.reshareCount && comment.reshareCount > 0 ? comment.reshareCount : ''}</span>
                   </Button>
                   {/* Like Button */}
                   <Button variant="ghost" size="sm" className={cn("flex items-center gap-1.5 text-xs", comment.likedByMe ? "text-red-500" : "hover:text-red-500")} onClick={() => onLike(comment.id)}>
                       <Heart size={16} className={cn(comment.likedByMe ? "fill-current" : "")}/>
                       <span>{comment.likeCount > 0 ? comment.likeCount : ''}</span>
                   </Button>
                    {/* Share Button (placeholder) */}
                   <Button variant="ghost" size="sm" className="flex items-center gap-1.5 text-xs hover:text-primary">
                       <Share2 size={16} />
                   </Button>
             </div>
         </div>
    </Card>
 );


// Skeleton Loaders (Updated)
const PostDetailsSkeleton = () => (
    <Card className="mb-6 shadow-none border-none rounded-none">
        <CardHeader className="flex flex-row gap-3 px-4 pt-4 pb-2">
             <Skeleton className="h-10 w-10 rounded-full bg-muted/50" />
             <div className="flex-grow space-y-1.5">
                 <Skeleton className="h-4 w-24 bg-muted/50" />
                 <Skeleton className="h-5 w-3/4 bg-muted/50" />
             </div>
        </CardHeader>
        <CardContent className="px-4 pt-1 pb-3 space-y-2">
             <Skeleton className="h-4 w-full bg-muted/50" />
             <Skeleton className="h-4 w-full bg-muted/50" />
             <Skeleton className="h-4 w-5/6 bg-muted/50" />
             <div className="flex gap-2 pt-2">
                <Skeleton className="h-5 w-16 rounded-full bg-muted/50" />
                <Skeleton className="h-5 w-20 rounded-full bg-muted/50" />
             </div>
        </CardContent>
        <div className="px-4 pt-3 pb-2 border-t border-border/60 flex items-center gap-4">
             <Skeleton className="h-4 w-12 bg-muted/50" />
             <Skeleton className="h-4 w-16 bg-muted/50" />
             <Skeleton className="h-4 w-14 bg-muted/50" />
        </div>
        <CardFooter className="px-4 py-2 border-t border-border/60 flex justify-around items-center">
             <Skeleton className="h-8 w-16 rounded-md bg-muted/50" />
             <Skeleton className="h-8 w-16 rounded-md bg-muted/50" />
             <Skeleton className="h-8 w-16 rounded-md bg-muted/50" />
             <Skeleton className="h-8 w-16 rounded-md bg-muted/50" />
        </CardFooter>
    </Card>
);

const CommentSkeleton = () => (
    <Card className="border-b border-border/60 rounded-none flex p-4 gap-3">
        <div className="shrink-0">
            <Skeleton className="h-10 w-10 rounded-full bg-muted/50" />
        </div>
         <div className="flex-grow space-y-2">
             <div className='flex items-center gap-2'>
                <Skeleton className="h-4 w-20 bg-muted/50" />
                <Skeleton className="h-3 w-10 bg-muted/50" />
             </div>
             <Skeleton className="h-3 w-full bg-muted/50" />
             <Skeleton className="h-3 w-5/6 bg-muted/50" />
             <div className="flex items-center gap-4 pt-1">
                 <Skeleton className="h-5 w-6 bg-muted/50" />
                 <Skeleton className="h-5 w-8 bg-muted/50" />
                 <Skeleton className="h-5 w-8 bg-muted/50" />
                 <Skeleton className="h-5 w-6 bg-muted/50" />
             </div>
        </div>
    </Card>
);
