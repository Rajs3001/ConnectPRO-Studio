
"use client";

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import AppLayout from '@/components/layouts/app-layout';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Skeleton } from '@/components/ui/skeleton';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { ArrowLeft, Code, ImageIcon, LinkIcon, MessageCircle, Send, Text } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import ReactMarkdown from 'react-markdown'; // For rendering markdown/code
import remarkGfm from 'remark-gfm'; // GitHub Flavored Markdown
import { Label } from '@/components/ui/label'; // Import Label
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"; // Added Alert

// Mock data (replace with actual API fetching)
interface CommunityPost {
    id: string;
    type: 'text' | 'image' | 'code' | 'link';
    title: string;
    content: string; // Full content
    tags?: string[];
    timestamp: Date;
    commentCount: number;
}

interface Comment {
    id: string;
    // authorId: string; // We don't show author
    content: string;
    timestamp: Date;
}

const fetchPostDetails = async (postId: string): Promise<CommunityPost | null> => {
    await new Promise(resolve => setTimeout(resolve, 700));
     const posts: Record<string, CommunityPost> = {
        'p1': { id: 'p1', type: 'text', title: 'Navigating Career Change in Tech?', content: 'Feeling stuck in my current role. Anyone successfully transitioned from non-tech to a dev role? Looking for advice and resources on building a portfolio and networking. Any bootcamps worth it?', tags: ['career', 'tech', 'advice', 'portfolio'], timestamp: new Date(Date.now() - 3600000), commentCount: 15 },
        'p2': { id: 'p2', type: 'code', title: 'Python Script for Data Cleaning', content: '```python\nimport pandas as pd\n\ndef clean_csv(filepath):\n    df = pd.read_csv(filepath)\n    # Example: Drop rows with missing values\n    df.dropna(inplace=True)\n    # Example: Convert column to numeric\n    df[\'numeric_col\'] = pd.to_numeric(df[\'numeric_col\'], errors=\'coerce\')\n    print("Cleaned DataFrame head:")\n    print(df.head())\n    return df\n\n# Usage:\n# clean_csv(\'your_data.csv\')\n```\nSharing a small script I wrote for cleaning CSV files using Pandas. Hope it helps someone!', tags: ['python', 'data-science', 'code', 'pandas'], timestamp: new Date(Date.now() - 7200000), commentCount: 8 },
        'p3': { id: 'p3', type: 'image', title: 'My Remote Work Setup Inspiration', content: 'https://picsum.photos/seed/setup/800/600', tags: ['remote-work', 'setup', 'inspiration', 'home-office'], timestamp: new Date(Date.now() - 10800000), commentCount: 22 },
        'p4': { id: 'p4', type: 'link', title: 'Useful Free Resource for Learning Docker', content: 'https://docs.docker.com/get-started/', tags: ['docker', 'devops', 'learning', 'resource', 'free'], timestamp: new Date(Date.now() - 14400000), commentCount: 5 },
        'p5': { id: 'p5', type: 'text', title: 'Best Practices for API Design?', content: 'What are some key principles you follow when designing RESTful APIs? Looking for different perspectives on versioning, authentication, error handling, and documentation.', tags: ['api', 'design', 'best-practices', 'backend', 'rest'], timestamp: new Date(Date.now() - 18000000), commentCount: 30 },
     };
    return posts[postId] || null;
};

const fetchPostComments = async (postId: string): Promise<Comment[]> => {
    await new Promise(resolve => setTimeout(resolve, 500));
    // Generate dummy comments based on postId
    const commentBase = `Comment on post ${postId}`;
    const count = Math.floor(Math.random() * 10) + 1; // 1-10 comments
    return Array.from({ length: count }, (_, i) => ({
        id: `c${postId}-${i + 1}`,
        content: `${commentBase} - response number ${i + 1}. Lorem ipsum dolor sit amet, consectetur adipiscing elit.`,
        timestamp: new Date(Date.now() - (i + 1) * 60000 * (Math.random() * 30 + 5)), // 5-35 mins ago interval
    })).sort((a, b) => a.timestamp.getTime() - b.timestamp.getTime()); // Sort oldest first
};

const postComment = async (postId: string, content: string): Promise<Comment> => {
     await new Promise(resolve => setTimeout(resolve, 800));
     console.log(`Posting comment to ${postId}: ${content}`);
     // Simulate successful post
     return {
         id: `c${postId}-new-${Date.now()}`,
         content: content,
         timestamp: new Date(),
     };
 };


const typeIcons = {
    text: Text,
    image: ImageIcon,
    code: Code,
    link: LinkIcon,
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
                setComments(postComments);
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
             setComments(prev => [...prev, postedComment]); // Add to list optimistically
             setNewComment(''); // Clear input
             toast({ title: "Comment Posted", description: "Your anonymous comment has been added." });
             // Optionally update comment count on post object if state managed here
             // setPost(prev => prev ? { ...prev, commentCount: prev.commentCount + 1 } : null);
         } catch (error) {
              console.error("Failed to post comment:", error);
              toast({ variant: "destructive", title: "Error", description: "Could not post your comment." });
         } finally {
              setPostingComment(false);
         }
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


    return (
        <AppLayout userType="user"> {/* Or professional */}
            <div className="container mx-auto py-8 max-w-4xl">
                <Button variant="outline" size="sm" className="mb-6" onClick={() => router.back()}>
                    <ArrowLeft className="mr-2 h-4 w-4" /> Back to Community
                </Button>

                {/* Post Details */}
                {loadingPost ? (
                    <PostDetailsSkeleton />
                ) : post ? (
                    <Card className="mb-8 shadow-lg border border-border/60 overflow-hidden"> {/* Removed glassmorphic */}
                        <CardHeader className="p-5 md:p-6">
                             <div className="flex items-center gap-3 mb-3">
                                <Avatar className="h-9 w-9 bg-secondary">
                                    <AvatarFallback>?</AvatarFallback> {/* Anonymous */}
                                </Avatar>
                                <div className='flex-grow'>
                                    <CardTitle className="text-xl md:text-2xl font-bold">{post.title}</CardTitle>
                                    <p className="text-xs text-muted-foreground mt-1">
                                        Posted anonymously {timeAgo(post.timestamp)}
                                    </p>
                                </div>
                                <Badge variant="secondary" className="capitalize text-xs shrink-0">
                                     {React.createElement(typeIcons[post.type] || Text, { className: "h-4 w-4 mr-1" })}
                                     {post.type}
                                </Badge>
                            </div>
                        </CardHeader>
                        <CardContent className="p-5 md:p-6 prose prose-sm md:prose-base dark:prose-invert max-w-none prose-pre:bg-muted prose-pre:p-4 prose-pre:rounded-md prose-img:rounded-md prose-img:max-w-full prose-a:text-primary hover:prose-a:underline">
                            {post.type === 'image' ? (
                                <img src={post.content} alt={post.title} className="rounded-md border border-border/40 max-h-96 object-contain mx-auto" />
                            ) : post.type === 'link' ? (
                                <div>
                                    <p>Shared link:</p>
                                    <a href={post.content} target="_blank" rel="noopener noreferrer" className="font-medium break-all">{post.content}</a>
                                </div>
                            ) : post.type === 'code' ? (
                                <ReactMarkdown remarkPlugins={[remarkGfm]}>{post.content}</ReactMarkdown>
                            ) : (
                                <ReactMarkdown remarkPlugins={[remarkGfm]}>{post.content}</ReactMarkdown>
                            )}
                        </CardContent>
                         <CardFooter className="p-5 md:p-6 bg-card/50 border-t border-border/40 flex flex-wrap gap-2 items-center justify-between">
                             <div className="flex flex-wrap gap-1">
                                 {post.tags?.map(tag => (
                                     <Badge key={tag} variant="secondary" className="text-xs">#{tag}</Badge>
                                 ))}
                             </div>
                             <div className="flex items-center gap-1 text-sm text-muted-foreground">
                                  <MessageCircle className="h-4 w-4" />
                                  <span>{comments.length} Comments</span> {/* Use actual comments length */}
                              </div>
                         </CardFooter>
                    </Card>
                ) : (
                    <Card className="text-center py-12 bg-card border border-border/60"> {/* Removed glassmorphic */}
                        <CardContent>
                            <p className="text-destructive">Post not found.</p>
                        </CardContent>
                    </Card>
                )}

                {/* Comments Section */}
                 <div className="mt-10">
                      <h2 className="text-2xl font-semibold mb-6 text-accent">Comments ({comments.length})</h2> {/* Removed gradient-text-accent */}

                      {/* Add Comment Form */}
                      <Card className="mb-8 border border-border/60"> {/* Removed glassmorphic */}
                         <form onSubmit={handlePostComment}>
                             <CardContent className="p-4">
                                 <Label htmlFor="new-comment" className="sr-only">Add a comment</Label>
                                 <Textarea
                                     id="new-comment"
                                     rows={3}
                                     placeholder="Add your anonymous comment..."
                                     value={newComment}
                                     onChange={(e) => setNewComment(e.target.value)}
                                     disabled={postingComment || loadingPost || !post}
                                     required
                                     className="mb-3 bg-background/80 focus:bg-background"
                                 />
                                 <div className="flex justify-end">
                                      <Button type="submit" disabled={postingComment || !newComment.trim()} className="bg-primary text-primary-foreground hover:bg-primary/90">
                                          {postingComment ? 'Posting...' : <><Send className="mr-2 h-4 w-4" /> Post Comment</>}
                                      </Button>
                                  </div>
                             </CardContent>
                         </form>
                      </Card>

                      {/* Comments List */}
                      <div className="space-y-6">
                          {loadingComments ? (
                              [...Array(3)].map((_, i) => <CommentSkeleton key={i} />)
                          ) : comments.length > 0 ? (
                              comments.map(comment => <CommentCard key={comment.id} comment={comment} timeAgo={timeAgo} />)
                          ) : (
                              <p className="text-muted-foreground text-center py-6">No comments yet. Be the first to comment!</p>
                          )}
                      </div>
                  </div>
            </div>
        </AppLayout>
    );
}


// Single Comment Card
const CommentCard: React.FC<{ comment: Comment; timeAgo: (date: Date) => string }> = ({ comment, timeAgo }) => (
     <div className="flex gap-3">
         <Avatar className="h-8 w-8 bg-secondary mt-1 shrink-0">
             <AvatarFallback>?</AvatarFallback> {/* Anonymous */}
         </Avatar>
         <Card className="flex-grow border border-border/60 shadow-sm"> {/* Removed glassmorphic */}
             <CardContent className="p-3 text-sm">
                  <ReactMarkdown remarkPlugins={[remarkGfm]} className="prose prose-sm dark:prose-invert max-w-none">
                      {comment.content}
                  </ReactMarkdown>
                 <p className="text-xs text-muted-foreground mt-2 text-right">
                     {timeAgo(comment.timestamp)}
                 </p>
             </CardContent>
         </Card>
     </div>
 );


// Skeleton Loaders
const PostDetailsSkeleton = () => (
    <Card className="mb-8 shadow-lg border border-border/60 overflow-hidden"> {/* Removed glassmorphic */}
        <CardHeader className="p-5 md:p-6">
            <div className="flex items-center gap-3 mb-3">
                 <Skeleton className="h-9 w-9 rounded-full bg-muted/50" />
                 <div className="flex-grow space-y-2">
                     <Skeleton className="h-6 w-3/4 bg-muted/50" />
                     <Skeleton className="h-3 w-1/4 bg-muted/50" />
                 </div>
                 <Skeleton className="h-6 w-16 rounded-md bg-muted/50" />
             </div>
        </CardHeader>
        <CardContent className="p-5 md:p-6 space-y-3">
            <Skeleton className="h-4 w-full bg-muted/50" />
            <Skeleton className="h-4 w-full bg-muted/50" />
            <Skeleton className="h-4 w-5/6 bg-muted/50" />
        </CardContent>
        <CardFooter className="p-5 md:p-6 bg-card/50 border-t border-border/40 flex justify-between items-center">
            <div className="flex gap-2">
                 <Skeleton className="h-5 w-16 rounded-full bg-muted/50" />
                 <Skeleton className="h-5 w-20 rounded-full bg-muted/50" />
            </div>
            <Skeleton className="h-4 w-24 bg-muted/50" />
        </CardFooter>
    </Card>
);

const CommentSkeleton = () => (
    <div className="flex gap-3">
        <Skeleton className="h-8 w-8 rounded-full bg-muted/50 mt-1 shrink-0" />
        <div className="flex-grow space-y-2 rounded-md border border-border/60 p-3 bg-card/30">
            <Skeleton className="h-3 w-full bg-muted/50" />
            <Skeleton className="h-3 w-5/6 bg-muted/50" />
            <Skeleton className="h-2 w-1/4 bg-muted/50 ml-auto mt-1" />
        </div>
    </div>
);

