
"use client";

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation'; // Use for redirection
// Removed AppLayout import
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card'; // Adjusted imports
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { useToast } from '@/hooks/use-toast';
import { CodeXml, Image as ImageIconLucid, Link as LinkIconLucid, Send, Text, ArrowLeft, UserCircle } from 'lucide-react'; // Renamed icons
import { Avatar, AvatarFallback } from '@/components/ui/avatar'; // Added Avatar
import Link from 'next/link'; // Import Link

type PostType = 'text' | 'image' | 'code' | 'link';

// Simulate authentication check - Replace with actual auth logic
const useAuthCheck = () => {
    const router = useRouter();
    const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null); // Start as null

    useEffect(() => {
        const checkAuth = async () => {
            await new Promise(resolve => setTimeout(resolve, 100)); // Simulate async check
            const authStatus = true; // Assume user is logged in for now
            setIsAuthenticated(authStatus);
            if (!authStatus) {
                console.log("User not authenticated, redirecting to login...");
                router.push('/login/user?redirect=/community/new'); // Redirect to login if not authenticated
            }
        };
        checkAuth();
    }, [router]);

    return isAuthenticated; // Return the auth status
};

export default function NewCommunityPostPage() {
    const isAuthenticated = useAuthCheck();
    const { toast } = useToast();
    const router = useRouter();
    const [title, setTitle] = useState(''); // Optional title
    const [content, setContent] = useState('');
    const [tags, setTags] = useState('');
    const [postType, setPostType] = useState<PostType>('text');
    const [loading, setLoading] = useState(false);


    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
         if (!content.trim()) {
             let message = "Please add some content for your post.";
             if (postType === 'image' || postType === 'link') message = `Please provide the ${postType} URL.`;
             if (postType === 'code') message = 'Please add your code snippet.';
             toast({ variant: "destructive", title: "Missing Content", description: message });
             return;
         }
          if (postType === 'code' && !title.trim()) {
              toast({ variant: "destructive", title: "Missing Title", description: "Code snippets require a title for context." });
              return;
          }

        setLoading(true);
        const postData = {
            title: title.trim() || `Anonymous ${postType} post`, // Default title if empty
            content,
            type: postType,
            tags: tags.split(',').map(tag => tag.trim()).filter(Boolean),
            // Timestamp, likes, comments will be added server-side
        };
        console.log('Submitting new anonymous post:', postData);

        // TODO: Implement actual API call
        await new Promise(resolve => setTimeout(resolve, 1500));
        const submitSuccess = true;

        if (submitSuccess) {
            toast({ title: "Post Submitted", description: "Your anonymous post has been added to the community." });
            router.push('/community');
        } else {
            toast({ variant: "destructive", title: "Submission Failed", description: "Could not submit your post. Please try again." });
            setLoading(false);
        }
    };

     const getInputPlaceholder = () => {
        switch (postType) {
            case 'text': return "What's happening in your professional journey?";
            case 'image': return 'Enter image URL (e.g., https://...)';
            case 'code': return 'Paste your code snippet here... (Use Markdown for formatting)';
            case 'link': return 'Enter link URL (e.g., https://...)';
            default: return 'Enter content here...';
        }
    };

    const renderContentInput = () => {
        const commonProps = {
            id: "content",
            value: content,
            onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => setContent(e.target.value),
            placeholder: getInputPlaceholder(),
            disabled: loading,
            required: true,
            className: "text-base border-none focus-visible:ring-0 focus-visible:ring-offset-0 p-0 bg-transparent shadow-none h-auto resize-none min-h-[120px]" // Basic textarea look
        };

        if (postType === 'image' || postType === 'link') {
            return <Input type="url" {...commonProps} className={commonProps.className + " min-h-0"} />; // Input for URLs
        }
         if (postType === 'code') {
            return <Textarea {...commonProps} rows={10} className={commonProps.className + " font-mono"} />;
         }
        // Default to Textarea for 'text' type
        return <Textarea {...commonProps} rows={5} />;
    };

     // Show loading or require login screen
     if (isAuthenticated === null) {
        return (
            <div className="flex items-center justify-center min-h-screen bg-background">
                <p className="text-muted-foreground">Checking authentication...</p>
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
       // Removed AppLayout
        <div className="bg-background min-h-screen">
           {/* Community Header */}
           <header className="sticky top-0 z-40 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
                <div className="container mx-auto flex h-16 items-center justify-between px-4 md:px-6">
                     {/* Back Button */}
                     <Button variant="ghost" size="icon" className="text-foreground" onClick={() => router.back()}>
                         <ArrowLeft size={20} />
                     </Button>
                     <h1 className="text-lg font-semibold text-primary font-poppins text-glow-primary">
                         Create New Post
                     </h1>
                     {/* Post Button */}
                      <Button type="submit" form="new-post-form" disabled={loading || !content.trim()} className="bg-primary text-primary-foreground hover:bg-primary/90 rounded-full px-5 h-9">
                         {loading ? 'Posting...' : 'Post'}
                     </Button>
                </div>
            </header>

            <main className="container mx-auto py-8 max-w-2xl">
                 <form id="new-post-form" onSubmit={handleSubmit}>
                    <Card className="shadow-none border border-border/60 rounded-lg overflow-hidden bg-card">
                        {/* Header removed, controls are in main header now */}
                         <CardContent className="p-4 flex gap-3">
                             <Avatar className="h-10 w-10 bg-secondary mt-1 shrink-0">
                                <AvatarFallback><UserCircle size={24} className="text-muted-foreground" /></AvatarFallback>
                             </Avatar>
                             <div className="flex-grow space-y-4">
                                {/* Optional Title Input (shown for Code) */}
                                {postType === 'code' && (
                                    <div className="space-y-1">
                                        <Label htmlFor="title" className="sr-only">Title</Label>
                                        <Input
                                            id="title"
                                            value={title}
                                            onChange={(e) => setTitle(e.target.value)}
                                            placeholder="Title for your code snippet..."
                                            disabled={loading}
                                            required
                                            className="text-lg font-semibold border-none focus-visible:ring-0 focus-visible:ring-offset-0 p-0 bg-transparent h-auto"
                                        />
                                    </div>
                                )}

                                {/* Content Area */}
                                <div className="space-y-1">
                                    <Label htmlFor="content" className="sr-only">{getInputPlaceholder()}</Label>
                                    {renderContentInput()}
                                </div>

                                 {/* Tags Input */}
                                <div className="space-y-1">
                                    <Label htmlFor="tags" className="sr-only">Tags</Label>
                                    <Input
                                        id="tags"
                                        value={tags}
                                        onChange={(e) => setTags(e.target.value)}
                                        placeholder="#add #tags (optional, comma-separated)"
                                        disabled={loading}
                                        className="text-sm border-none focus-visible:ring-0 focus-visible:ring-offset-0 p-0 bg-transparent h-auto"
                                    />
                                </div>
                             </div>
                        </CardContent>

                         {/* Post Type Selector Footer */}
                         <CardFooter className="p-4 border-t border-border/60 flex justify-between items-center">
                             <RadioGroup
                                defaultValue="text"
                                className="flex flex-wrap gap-1"
                                onValueChange={(value: PostType) => setPostType(value)}
                                value={postType}
                              >
                                <Label htmlFor="r-text" className="cursor-pointer p-2 rounded-full hover:bg-blue-500/10 data-[state=checked]:bg-blue-500/10">
                                    <RadioGroupItem value="text" id="r-text" className="sr-only" />
                                    <Text size={20} className={postType === 'text' ? 'text-blue-500' : 'text-muted-foreground'}/>
                                </Label>
                                <Label htmlFor="r-image" className="cursor-pointer p-2 rounded-full hover:bg-green-500/10 data-[state=checked]:bg-green-500/10">
                                    <RadioGroupItem value="image" id="r-image" className="sr-only"/>
                                    <ImageIconLucid size={20} className={postType === 'image' ? 'text-green-500' : 'text-muted-foreground'}/>
                                </Label>
                                 <Label htmlFor="r-code" className="cursor-pointer p-2 rounded-full hover:bg-purple-500/10 data-[state=checked]:bg-purple-500/10">
                                    <RadioGroupItem value="code" id="r-code" className="sr-only"/>
                                    <CodeXml size={20} className={postType === 'code' ? 'text-purple-500' : 'text-muted-foreground'}/>
                                 </Label>
                                 <Label htmlFor="r-link" className="cursor-pointer p-2 rounded-full hover:bg-orange-500/10 data-[state=checked]:bg-orange-500/10">
                                     <RadioGroupItem value="link" id="r-link" className="sr-only"/>
                                     <LinkIconLucid size={20} className={postType === 'link' ? 'text-orange-500' : 'text-muted-foreground'}/>
                                 </Label>
                            </RadioGroup>
                            {/* Character count or other info could go here */}
                         </CardFooter>
                    </Card>
                 </form>
            </main>
        </div>
    );
}
