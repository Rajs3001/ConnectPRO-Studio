
"use client";

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { useToast } from '@/hooks/use-toast';
import { CodeXml, Image as ImageIconLucid, Link as LinkIconLucid, Send, Text, ArrowLeft, UserCircle, Hash, FileText as FileTextIcon, MessageSquare } from 'lucide-react'; // Added Hash, FileTextIcon, MessageSquare
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import Link from 'next/link';
import { Badge } from '@/components/ui/badge'; // Import Badge

type PostType = 'text' | 'image' | 'code' | 'link';

// Simulate authentication check - Replace with actual auth logic
const useAuthCheck = () => {
    const router = useRouter();
    const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);

    useEffect(() => {
        const checkAuth = async () => {
            await new Promise(resolve => setTimeout(resolve, 100));
            const authStatus = true;
            setIsAuthenticated(authStatus);
            if (!authStatus) {
                console.log("User not authenticated, redirecting to login...");
                router.push('/login/user?redirect=/community/new');
            }
        };
        checkAuth();
    }, [router]);

    return isAuthenticated;
};

// Mock suggestions
const popularHashtags = ['#careeradvice', '#tech', '#interviewtips', '#remotework', '#python'];
const postTemplates = [
    { title: 'Ask for Advice', content: 'Seeking advice on [Your Topic/Challenge]...\n\nBackground: [Provide context]\n\nQuestion: [Your specific question(s)]\n\nAny insights appreciated! #advice #[relevantTag]' },
    { title: 'Share a Resource', content: 'Found this helpful resource for [Topic]:\n\n[Link to resource]\n\nWhy it\'s useful: [Brief explanation]\n\n#resource #[relevantTag]' },
    { title: 'Project Showcase', content: 'Sharing a project I worked on: [Project Title/Link]\n\nKey features/learnings: [Highlight key aspects]\n\nTech stack: [List technologies]\n\n#showcase #[projectTag]' },
];


export default function NewCommunityPostPage() {
    const isAuthenticated = useAuthCheck();
    const { toast } = useToast();
    const router = useRouter();
    const [title, setTitle] = useState('');
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
            tags: tags.split(',').map(tag => tag.trim().replace(/^#/, '')).filter(Boolean), // Remove leading # if present
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
            className: "text-base border-none focus-visible:ring-0 focus-visible:ring-offset-0 p-0 bg-transparent shadow-none h-auto resize-none min-h-[120px]", // Basic textarea look
            'data-testid': `post-content-input-${postType}`
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

     // Add suggested template content to the textarea
     const applyTemplate = (templateContent: string) => {
        setContent(templateContent);
        // Optionally set post type if template implies it, e.g., code template
        // setPostType('text'); // Reset to text or deduce from template
        toast({ title: "Template Applied", description: "Template content added to your post." });
     };

     // Add suggested hashtag to the tags input
     const addHashtag = (tag: string) => {
        const cleanTag = tag.replace(/^#/, ''); // Remove leading #
        setTags(prevTags => {
            const existingTags = prevTags.split(',').map(t => t.trim()).filter(Boolean);
            if (existingTags.includes(cleanTag)) {
                return prevTags; // Avoid duplicates
            }
            return prevTags ? `${prevTags}, ${cleanTag}` : cleanTag;
        });
     };


     // Show loading or require login screen
     if (isAuthenticated === null) {
        return (
            <div className="flex items-center justify-center min-h-screen bg-background" data-testid="auth-loading-screen">
                <p className="text-muted-foreground">Checking authentication...</p>
            </div>
        );
    }
    if (isAuthenticated === false) {
         return (
             <div className="flex items-center justify-center min-h-screen bg-background" data-testid="auth-redirect-screen">
                <p className="text-muted-foreground">Redirecting to login...</p>
             </div>
         );
     }

    return (
       // Removed AppLayout
        <div className="bg-background min-h-screen" data-testid="new-post-page">
           {/* Community Header */}
           <header className="sticky top-0 z-40 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60" data-testid="new-post-header">
                <div className="container mx-auto flex h-16 items-center justify-between px-4 md:px-6">
                     {/* Back Button */}
                     <Button variant="ghost" size="icon" className="text-foreground" onClick={() => router.back()} data-testid="back-button">
                         <ArrowLeft size={20} />
                     </Button>
                     <h1 className="text-lg font-semibold text-primary font-poppins text-glow-primary" data-testid="page-title">
                         Create New Post
                     </h1>
                     {/* Post Button */}
                      <Button type="submit" form="new-post-form" disabled={loading || !content.trim()} className="bg-primary text-primary-foreground hover:bg-primary/90 rounded-full px-5 h-9" data-testid="submit-post-button">
                         {loading ? 'Posting...' : 'Post'}
                     </Button>
                </div>
            </header>

            <main className="container mx-auto py-8 max-w-2xl" data-testid="new-post-main-content">
                 <form id="new-post-form" onSubmit={handleSubmit} data-testid="new-post-form">
                    <Card className="shadow-none border border-border/60 rounded-lg overflow-hidden bg-card" data-testid="new-post-card">
                        {/* Header removed, controls are in main header now */}
                         <CardContent className="p-4 flex gap-3">
                             <Avatar className="h-10 w-10 bg-secondary mt-1 shrink-0" data-testid="user-avatar">
                                <AvatarFallback><UserCircle size={24} className="text-muted-foreground" /></AvatarFallback>
                             </Avatar>
                             <div className="flex-grow space-y-4">
                                {/* Optional Title Input (shown for Code) */}
                                {postType === 'code' && (
                                    <div className="space-y-1" data-testid="post-title-input-container">
                                        <Label htmlFor="title" className="sr-only">Title</Label>
                                        <Input
                                            id="title"
                                            value={title}
                                            onChange={(e) => setTitle(e.target.value)}
                                            placeholder="Title for your code snippet..."
                                            disabled={loading}
                                            required
                                            className="text-lg font-semibold border-none focus-visible:ring-0 focus-visible:ring-offset-0 p-0 bg-transparent h-auto"
                                            data-testid="post-title-input"
                                        />
                                    </div>
                                )}

                                {/* Content Area */}
                                <div className="space-y-1" data-testid="post-content-container">
                                    <Label htmlFor="content" className="sr-only">{getInputPlaceholder()}</Label>
                                    {renderContentInput()}
                                </div>

                                 {/* Tags Input */}
                                <div className="space-y-1" data-testid="post-tags-container">
                                    <Label htmlFor="tags" className="sr-only">Tags</Label>
                                    <Input
                                        id="tags"
                                        value={tags}
                                        onChange={(e) => setTags(e.target.value)}
                                        placeholder="#add #tags (optional, comma-separated)"
                                        disabled={loading}
                                        className="text-sm border-none focus-visible:ring-0 focus-visible:ring-offset-0 p-0 bg-transparent h-auto"
                                        data-testid="post-tags-input"
                                    />
                                </div>

                                 {/* Suggestions Section */}
                                 <div className="space-y-3 pt-2" data-testid="suggestions-section">
                                     {/* Popular Hashtags */}
                                     <div data-testid="popular-tags-section">
                                        <Label className="text-xs font-medium text-muted-foreground flex items-center gap-1 mb-1.5">
                                            <Hash size={14} /> Popular Tags
                                        </Label>
                                        <div className="flex flex-wrap gap-1.5">
                                            {popularHashtags.map(tag => (
                                                <Badge key={tag} variant="secondary" className="cursor-pointer hover:bg-secondary/80 text-xs font-normal" onClick={() => addHashtag(tag)} data-testid={`popular-tag-${tag.replace('#', '')}`}>
                                                    {tag}
                                                </Badge>
                                            ))}
                                        </div>
                                     </div>
                                     {/* Post Templates (only show for text posts maybe?) */}
                                     {postType === 'text' && (
                                        <div data-testid="post-templates-section">
                                            <Label className="text-xs font-medium text-muted-foreground flex items-center gap-1 mb-1.5">
                                                 <FileTextIcon size={14} /> Post Templates
                                            </Label>
                                            <div className="flex flex-wrap gap-1.5">
                                                {postTemplates.map(template => (
                                                    <Button
                                                        key={template.title}
                                                        variant="outline"
                                                        size="sm"
                                                        className="text-xs h-7 px-2"
                                                        onClick={() => applyTemplate(template.content)}
                                                        data-testid={`template-button-${template.title.toLowerCase().replace(/\s+/g, '-')}`}
                                                    >
                                                        {template.title}
                                                    </Button>
                                                ))}
                                            </div>
                                        </div>
                                     )}
                                 </div>

                             </div>
                        </CardContent>

                         {/* Post Type Selector Footer */}
                         <CardFooter className="p-4 border-t border-border/60 flex justify-between items-center" data-testid="post-type-footer">
                             <RadioGroup
                                defaultValue="text"
                                className="flex flex-wrap gap-1"
                                onValueChange={(value: PostType) => setPostType(value)}
                                value={postType}
                                data-testid="post-type-radiogroup"
                              >
                                <Label htmlFor="r-text" className="cursor-pointer p-2 rounded-full hover:bg-blue-500/10 data-[state=checked]:bg-blue-500/10" data-testid="post-type-label-text">
                                    <RadioGroupItem value="text" id="r-text" className="sr-only" data-testid="post-type-radio-text"/>
                                    <Text size={20} className={postType === 'text' ? 'text-blue-500' : 'text-muted-foreground'}/>
                                </Label>
                                <Label htmlFor="r-image" className="cursor-pointer p-2 rounded-full hover:bg-green-500/10 data-[state=checked]:bg-green-500/10" data-testid="post-type-label-image">
                                    <RadioGroupItem value="image" id="r-image" className="sr-only" data-testid="post-type-radio-image"/>
                                    <ImageIconLucid size={20} className={postType === 'image' ? 'text-green-500' : 'text-muted-foreground'}/>
                                </Label>
                                 <Label htmlFor="r-code" className="cursor-pointer p-2 rounded-full hover:bg-purple-500/10 data-[state=checked]:bg-purple-500/10" data-testid="post-type-label-code">
                                    <RadioGroupItem value="code" id="r-code" className="sr-only" data-testid="post-type-radio-code"/>
                                    <CodeXml size={20} className={postType === 'code' ? 'text-purple-500' : 'text-muted-foreground'}/>
                                 </Label>
                                 <Label htmlFor="r-link" className="cursor-pointer p-2 rounded-full hover:bg-orange-500/10 data-[state=checked]:bg-orange-500/10" data-testid="post-type-label-link">
                                     <RadioGroupItem value="link" id="r-link" className="sr-only" data-testid="post-type-radio-link"/>
                                     <LinkIconLucid size={20} className={postType === 'link' ? 'text-orange-500' : 'text-muted-foreground'}/>
                                 </Label>
                                  {/* Video Post Type - Add if supported */}
                                 {/* <Label htmlFor="r-video" className="cursor-pointer p-2 rounded-full hover:bg-red-500/10 data-[state=checked]:bg-red-500/10">
                                     <RadioGroupItem value="video" id="r-video" className="sr-only"/>
                                     <Video size={20} className={postType === 'video' ? 'text-red-500' : 'text-muted-foreground'}/>
                                 </Label> */}
                            </RadioGroup>
                            {/* Character count or other info could go here */}
                         </CardFooter>
                    </Card>
                 </form>
            </main>
        </div>
    );
}


