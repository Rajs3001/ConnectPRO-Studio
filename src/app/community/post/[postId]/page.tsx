
"use client";

import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useRouter } from 'next/navigation';
import AppLayout from '@/components/layouts/app-layout';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card'; // Removed Title, Description
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Skeleton } from '@/components/ui/skeleton';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { ArrowLeft, Code, Heart, ImageIcon, Link as LinkIconLucid, MessageCircle, Send, Text, UserCircle, Share2 } from 'lucide-react'; // Renamed LinkIcon, added Share2
import { useToast } from '@/hooks/use-toast';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { cn } from '@/lib/utils'; // Import cn

// Mock data (replace with actual API fetching)
interface CommunityPost {
    id: string;
    type: 'text' | 'image' | 'code' | 'link';
    title: string;
    content: string; // Full content
    tags?: string[];
    timestamp: Date;
    commentCount: number;
    likeCount: number; // Added like count
}

interface Comment {
    id: string;
    content: string;
    timestamp: Date;
    likeCount: number; // Added like count for comments
}

const fetchPostDetails = async (postId: string): Promise<CommunityPost | null> => {
    await new Promise(resolve => setTimeout(resolve, 700));
     const posts: Record<string, CommunityPost> = {
        'p1': { id: 'p1', type: 'text', title: 'Navigating Career Change in Tech?', content: 'Feeling stuck in my current role. Anyone successfully transitioned from non-tech to a dev role? Looking for advice and resources on building a portfolio and networking. Any bootcamps worth it?', tags: ['career', 'tech', 'advice', 'portfolio'], timestamp: new Date(Date.now() - 3600000), commentCount: 15, likeCount: 42 },
        'p2': { id: 'p2', type: 'code', title: 'Python Script for Data Cleaning', content: '```python\nimport pandas as pd\n\ndef clean_csv(filepath):\n    df = pd.read_csv(filepath)\n    # Example: Drop rows with missing values\n    df.dropna(inplace=True)\n    # Example: Convert column to numeric\n    df[\'numeric_col\'] = pd.to_numeric(df[\'numeric_col\'], errors=\'coerce\')\n    print("Cleaned DataFrame head:")\n    print(df.head())\n    return df\n\n# Usage:\n# clean_csv(\'your_data.csv\')\n```\nSharing a small script I wrote for cleaning CSV files using Pandas. Hope it helps someone!', tags: ['python', 'data-science', 'code', 'pandas'], timestamp: new Date(Date.now() - 7200000), commentCount: 8, likeCount: 25 },
        'p3': { id: 'p3', type: 'image', title: 'My Remote Work Setup Inspiration', content: 'https://picsum.photos/seed/setup/800/600', tags: ['remote-work', 'setup', 'inspiration', 'home-office'], timestamp: new Date(Date.now() - 10800000), commentCount: 22, likeCount: 68 },
        'p4': { id: 'p4', type: 'link', title: 'Useful Free Resource for Learning Docker', content: 'https://docs.docker.com/get-started/', tags: ['docker', 'devops', 'learning', 'resource', 'free'], timestamp: new Date(Date.now() - 14400000), commentCount: 5, likeCount: 18 },
        'p5': { id: 'p5', type: 'text', title: 'Best Practices for API Design?', content: 'What are some key principles you follow when designing RESTful APIs? Looking for different perspectives on versioning, authentication, error handling, and documentation.', tags: ['api', 'design', 'best-practices', 'backend', 'rest'], timestamp: new Date(Date.now() - 18000000), commentCount: 30, likeCount: 95 },
     };
    return posts[postId] || null;
};

const fetchPostComments = async (postId: string): Promise<Comment[]> => {
    await new Promise(resolve => setTimeout(resolve, 500));
    const commentBase = `Comment on post ${postId}`;
    const count = Math.floor(Math.random() * 10) + 1;
    return Array.from({ length: count }, (_, i) => ({
        id: `c${postId}-${i + 1}`,
        content: `${commentBase} - response number ${i + 1}. Lorem ipsum dolor sit amet, consectetur adipiscing elit. \n\nProin gravida nibh vel velit auctor aliquet. Aenean sollicitudin, lorem quis bibendum auctor.`,
        timestamp: new Date(Date.now() - (i + 1) * 60000 * (Math.random() * 30 + 5)),
        likeCount: Math.floor(Math.random() * 20),
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
     };
 };

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


export default function CommunityPostPage() {
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
        if (!postId) return;

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
                setLoadingPost(false);
                setLoadingComments(false);
            }
        };
        loadData();
    }, [postId, toast]);

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
                return <ReactMarkdown remarkPlugins={[remarkGfm]} className="prose prose-sm md:prose-base dark:prose-invert max-w-none mt-2">{p.content}</ReactMarkdown>;
        }
    };

    return (
        <AppLayout userType="user">
            <div className="container mx-auto py-8 max-w-3xl">
                <Button variant="ghost" size="sm" className="mb-4 text-muted-foreground hover:text-foreground" onClick={() => router.back()}>
                    <ArrowLeft className="mr-2 h-4 w-4" /> Back
                </Button>

                {/* Post Details */}
                {loadingPost ? (
                    <PostDetailsSkeleton />
                ) : post ? (
                    <Card className="mb-8 shadow-none border-b border-border/60 rounded-none pb-4"> {/* Adjusted styling */}
                         <CardHeader className="flex flex-row gap-3 p-4 pb-2">
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
                         <CardContent className="px-4 pt-0 pb-3">
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
                         <CardFooter className="px-4 py-2 border-t border-border/60 flex justify-between items-center text-muted-foreground">
                              {/* Action Bar */}
                              <div className="flex items-center text-muted-foreground -ml-2">
                                  <Button variant="ghost" size="sm" className="flex items-center gap-1.5 text-xs hover:text-blue-500">
                                     <MessageCircle size={18} />
                                     <span>{comments.length}</span>
                                  </Button>
                                  <Button variant="ghost" size="sm" className="flex items-center gap-1.5 text-xs hover:text-red-500">
                                      <Heart size={18} />
                                      <span>{post.likeCount}</span>
                                  </Button>
                                  <Button variant="ghost" size="sm" className="flex items-center gap-1.5 text-xs hover:text-green-500">
                                      <Share2 size={18} />
                                  </Button>
                              </div>
                              {/* Optional: Bookmark button */}
                         </CardFooter>
                    </Card>
                ) : (
                    <Card className="text-center py-12 bg-card border border-border/60">
                        <CardContent>
                            <p className="text-destructive">Post not found.</p>
                        </CardContent>
                    </Card>
                )}

                {/* Add Comment Form */}
                 {post && (
                     <Card className="mb-6 border border-border/60 shadow-sm">
                         <form onSubmit={handlePostComment}>
                             <CardContent className="p-4 flex gap-3 items-start">
                                  <Avatar className="h-10 w-10 bg-secondary mt-1 shrink-0">
                                     <AvatarFallback><UserCircle size={24} className="text-muted-foreground" /></AvatarFallback>
                                  </Avatar>
                                 <div className="flex-grow">
                                     <Label htmlFor="new-comment" className="sr-only">Add your comment</Label>
                                     <Textarea
                                         id="new-comment"
                                         rows={3}
                                         placeholder="Post your reply..."
                                         value={newComment}
                                         onChange={(e) => setNewComment(e.target.value)}
                                         disabled={postingComment || loadingPost}
                                         required
                                         className="mb-3 bg-background/80 focus:bg-background border-border/60 focus:ring-primary"
                                     />
                                     <div className="flex justify-end">
                                          <Button type="submit" disabled={postingComment || !newComment.trim()} className="bg-primary text-primary-foreground hover:bg-primary/90 rounded-full px-5">
                                              {postingComment ? 'Posting...' : 'Reply'}
                                          </Button>
                                      </div>
                                 </div>
                             </CardContent>
                         </form>
                      </Card>
                 )}

                {/* Comments Section */}
                 <div className="mt-8 space-y-0">
                      {loadingComments ? (
                          [...Array(3)].map((_, i) => <CommentSkeleton key={i} />)
                      ) : comments.length > 0 ? (
                          comments.map(comment => <CommentCard key={comment.id} comment={comment} />)
                      ) : !loadingPost && post ? ( // Only show if post loaded and no comments
                           <p className="text-muted-foreground text-center py-6">No comments yet. Start the conversation!</p>
                      ) : null }
                  </div>
            </div>
        </AppLayout>
    );
}


// Updated Comment Card (Threads/Twitter style)
const CommentCard: React.FC<{ comment: Comment }> = ({ comment }) => (
     <Card className={cn(
        "shadow-none hover:bg-muted/30 transition-colors duration-150 border-b border-border/60 rounded-none", // More like Twitter/Threads
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
        <div className="flex-grow">
            {/* Comment Header */}
            <div className="flex items-center justify-between gap-2">
                 <div className="flex items-center gap-2">
                     <span className="font-semibold text-sm">Anonymous</span>
                     <span className="text-xs text-muted-foreground">&middot;</span>
                     <span className="text-xs text-muted-foreground">{timeAgo(comment.timestamp)}</span>
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
                  <Button variant="ghost" size="sm" className="flex items-center gap-1.5 text-xs hover:text-blue-500">
                     <MessageCircle size={16} />
                     {/* Reply count if nested */}
                  </Button>
                  <Button variant="ghost" size="sm" className="flex items-center gap-1.5 text-xs hover:text-red-500">
                      <Heart size={16} />
                      <span>{comment.likeCount > 0 ? comment.likeCount : ''}</span>
                  </Button>
                  <Button variant="ghost" size="sm" className="flex items-center gap-1.5 text-xs hover:text-green-500">
                      <Share2 size={16} />
                  </Button>
                  {/* Optional: Bookmark */}
             </div>
         </div>
    </Card>
 );


// Skeleton Loaders (Updated)
const PostDetailsSkeleton = () => (
    <Card className="mb-8 shadow-none border-b border-border/60 rounded-none pb-4">
        <CardHeader className="flex flex-row gap-3 p-4 pb-2">
             <Skeleton className="h-10 w-10 rounded-full bg-muted/50" />
             <div className="flex-grow space-y-1.5">
                 <Skeleton className="h-4 w-24 bg-muted/50" />
                 <Skeleton className="h-5 w-3/4 bg-muted/50" />
             </div>
        </CardHeader>
        <CardContent className="px-4 pt-0 pb-3 space-y-2">
             <Skeleton className="h-4 w-full bg-muted/50" />
             <Skeleton className="h-4 w-full bg-muted/50" />
             <Skeleton className="h-4 w-5/6 bg-muted/50" />
             <div className="flex gap-2 pt-2">
                <Skeleton className="h-5 w-16 rounded-full bg-muted/50" />
                <Skeleton className="h-5 w-20 rounded-full bg-muted/50" />
             </div>
        </CardContent>
        <CardFooter className="px-4 py-2 border-t border-border/60 flex justify-between items-center">
             <div className="flex gap-2">
                 <Skeleton className="h-6 w-8 rounded-md bg-muted/50" />
                 <Skeleton className="h-6 w-8 rounded-md bg-muted/50" />
                 <Skeleton className="h-6 w-8 rounded-md bg-muted/50" />
             </div>
        </CardFooter>
    </Card>
);

const CommentSkeleton = () => (
    <Card className="border-b border-border/60 rounded-none flex p-4 gap-3">
        <div className="shrink-0">
            <Skeleton className="h-10 w-10 rounded-full bg-muted/50" />
        </div>
         <div className="flex-grow space-y-2">
             <Skeleton className="h-4 w-20 bg-muted/50" />
             <Skeleton className="h-3 w-full bg-muted/50" />
             <Skeleton className="h-3 w-5/6 bg-muted/50" />
             <div className="flex items-center gap-4 pt-1">
                 <Skeleton className="h-5 w-6 bg-muted/50" />
                 <Skeleton className="h-5 w-6 bg-muted/50" />
                 <Skeleton className="h-5 w-6 bg-muted/50" />
             </div>
        </div>
    </Card>
);

