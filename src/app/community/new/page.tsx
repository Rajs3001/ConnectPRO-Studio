
"use client";

import React, { useState } from 'react';
import AppLayout from '@/components/layouts/app-layout';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { useToast } from '@/hooks/use-toast';
import { useRouter } from 'next/navigation';
import { Code, ImageIcon, LinkIcon, Text, Send } from 'lucide-react';

type PostType = 'text' | 'image' | 'code' | 'link';

export default function NewCommunityPostPage() {
    const { toast } = useToast();
    const router = useRouter();
    const [title, setTitle] = useState('');
    const [content, setContent] = useState(''); // Main content (text, code, image URL, link URL)
    const [tags, setTags] = useState(''); // Comma-separated tags
    const [postType, setPostType] = useState<PostType>('text');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!title.trim()) {
            toast({ variant: "destructive", title: "Missing Title", description: "Please provide a title for your post." });
            return;
        }
         if (!content.trim()) {
             let message = "Please add some content for your post.";
             if (postType === 'image' || postType === 'link') message = `Please provide the ${postType} URL.`;
             if (postType === 'code') message = 'Please add your code snippet.';
             toast({ variant: "destructive", title: "Missing Content", description: message });
             return;
         }

        setLoading(true);
        const postData = {
            title,
            content,
            type: postType,
            tags: tags.split(',').map(tag => tag.trim()).filter(Boolean),
            // Timestamp will be added server-side
        };
        console.log('Submitting new anonymous post:', postData);

        // TODO: Implement actual API call to save the post anonymously
        await new Promise(resolve => setTimeout(resolve, 1500));
        const submitSuccess = true; // Placeholder

        if (submitSuccess) {
            toast({ title: "Post Submitted", description: "Your anonymous post has been added to the community." });
            router.push('/community'); // Redirect back to the community feed
        } else {
            toast({ variant: "destructive", title: "Submission Failed", description: "Could not submit your post. Please try again." });
            setLoading(false);
        }
    };

    const getInputLabel = () => {
        switch (postType) {
            case 'text': return 'Post Content';
            case 'image': return 'Image URL';
            case 'code': return 'Code Snippet';
            case 'link': return 'Link URL';
            default: return 'Content';
        }
    };
     const getInputPlaceholder = () => {
        switch (postType) {
            case 'text': return 'Write your thoughts, questions, or experiences...';
            case 'image': return 'https://example.com/image.jpg';
            case 'code': return '```javascript\nconsole.log("Hello, world!");\n```';
            case 'link': return 'https://example.com/resource';
            default: return 'Enter content here...';
        }
    };

    const renderContentInput = () => {
        if (postType === 'image' || postType === 'link') {
            return (
                <Input
                    id="content"
                    type="url"
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    placeholder={getInputPlaceholder()}
                    disabled={loading}
                    required
                />
            );
        }
         if (postType === 'code') {
            return (
                <Textarea
                    id="content"
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    placeholder={getInputPlaceholder()}
                    disabled={loading}
                    required
                    rows={10}
                    className="font-mono text-sm" // Use monospace font for code
                />
            );
         }
        // Default to Textarea for 'text' type
        return (
            <Textarea
                id="content"
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder={getInputPlaceholder()}
                disabled={loading}
                required
                rows={8}
            />
        );
    };

    return (
        <AppLayout userType="user"> {/* Or professional */}
            <div className="container mx-auto py-8 max-w-3xl">
                <h1 className="text-3xl font-bold mb-6 gradient-text-primary">Create New Community Post</h1>
                <Card className="shadow-lg glassmorphic border border-border/60">
                     <form onSubmit={handleSubmit}>
                        <CardHeader>
                            <CardTitle>New Anonymous Post</CardTitle>
                            <CardDescription>Share your thoughts, questions, or resources with the community. Your identity will remain anonymous.</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-6">
                             <div className="space-y-2">
                                <Label htmlFor="title">Post Title</Label>
                                <Input
                                    id="title"
                                    value={title}
                                    onChange={(e) => setTitle(e.target.value)}
                                    placeholder="A clear and concise title"
                                    disabled={loading}
                                    required
                                />
                            </div>

                             <div className="space-y-3">
                                <Label>Post Type</Label>
                                <RadioGroup
                                    defaultValue="text"
                                    className="flex flex-wrap gap-4"
                                    onValueChange={(value: PostType) => setPostType(value)}
                                    value={postType}
                                >
                                     <div className="flex items-center space-x-2">
                                       <RadioGroupItem value="text" id="r-text" />
                                       <Label htmlFor="r-text" className="flex items-center gap-1 cursor-pointer"><Text size={16}/> Text</Label>
                                     </div>
                                     <div className="flex items-center space-x-2">
                                       <RadioGroupItem value="image" id="r-image" />
                                       <Label htmlFor="r-image" className="flex items-center gap-1 cursor-pointer"><ImageIcon size={16}/> Image URL</Label>
                                     </div>
                                     <div className="flex items-center space-x-2">
                                       <RadioGroupItem value="code" id="r-code" />
                                       <Label htmlFor="r-code" className="flex items-center gap-1 cursor-pointer"><Code size={16}/> Code Snippet</Label>
                                     </div>
                                     <div className="flex items-center space-x-2">
                                       <RadioGroupItem value="link" id="r-link" />
                                       <Label htmlFor="r-link" className="flex items-center gap-1 cursor-pointer"><LinkIcon size={16}/> Link URL</Label>
                                     </div>
                                </RadioGroup>
                             </div>

                            <div className="space-y-2">
                                <Label htmlFor="content">{getInputLabel()}</Label>
                                {renderContentInput()}
                                {postType === 'code' && <p className="text-xs text-muted-foreground">Use markdown syntax for code blocks (e.g., ```js ... ```).</p>}
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="tags">Tags (comma-separated, optional)</Label>
                                <Input
                                    id="tags"
                                    value={tags}
                                    onChange={(e) => setTags(e.target.value)}
                                    placeholder="e.g., career-advice, javascript, remote-work"
                                    disabled={loading}
                                />
                            </div>
                        </CardContent>
                        <CardFooter>
                            <Button type="submit" disabled={loading} className="bg-primary text-primary-foreground hover:bg-primary/90">
                                {loading ? 'Submitting...' : <><Send className="mr-2 h-4 w-4" /> Submit Post Anonymously</>}
                            </Button>
                        </CardFooter>
                     </form>
                </Card>
            </div>
        </AppLayout>
    );
}
