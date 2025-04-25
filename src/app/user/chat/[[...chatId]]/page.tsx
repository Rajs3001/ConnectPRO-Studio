
"use client";

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useParams } from 'next/navigation';
import AppLayout from '@/components/layouts/app-layout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Send, Bot, User, BrainCircuit, Lightbulb, Users, HelpCircle } from 'lucide-react'; // Added more icons
import { ScrollArea } from '@/components/ui/scroll-area';
import { cn } from '@/lib/utils';
import { suggestProfessionals, SuggestProfessionalsInput, SuggestProfessionalsOutput } from '@/ai/flows/suggest-professionals'; // Updated import
import { Skeleton } from '@/components/ui/skeleton';
import Link from 'next/link';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"; // Added Alert

interface Message {
  id: string | number;
  sender: 'user' | 'professional' | 'ai';
  timestamp: Date;
  // AI specific fields - used when sender is 'ai'
  text?: string; // Optional: Fallback or simple text response
  analysis?: string;
  initialGuidance?: string;
  suggestions?: SuggestProfessionalsOutput['suggestedProfessionals'];
  followUpQuestion?: string;
  isError?: boolean; // Flag for error messages
}

export default function UserChatPage() {
  const params = useParams();
  const chatId = params.chatId?.[0]; // Can be 'ai' or a professional ID
  const scrollAreaRef = useRef<HTMLDivElement>(null);

  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [chatPartner, setChatPartner] = useState<{ name: string; type: 'ai' | 'professional', avatarUrl: string, initials: string } | null>(null);
  const [loadingChat, setLoadingChat] = useState(true);

  const scrollToBottom = useCallback(() => {
     setTimeout(() => {
       const scrollViewport = scrollAreaRef.current?.querySelector('[data-radix-scroll-area-viewport]');
       if (scrollViewport) {
         scrollViewport.scrollTop = scrollViewport.scrollHeight;
       }
     }, 100); // Delay slightly to allow DOM update
   }, []);

  useEffect(() => {
    setLoadingChat(true);
    console.log(`Loading chat for ID: ${chatId}`);

    let partnerName = 'Loading...';
    let partnerType: 'ai' | 'professional' = 'professional';
    let avatar = '';
    let initials = '';
    let initialMessages: Message[] = [];

    if (chatId === 'ai') {
      partnerName = 'AI Counselor';
      partnerType = 'ai';
      avatar = '/ai-avatar.png'; // Placeholder path
      initials = 'AI';
      initialMessages = [
        {
           id: 1,
           sender: 'ai',
           timestamp: new Date(Date.now() - 60000),
           analysis: "Welcome! I'm your AI Counselor.",
           initialGuidance: "I'm here to help you analyze your situation, explore options, and connect with relevant professionals if needed.",
           followUpQuestion: "What's on your mind today? How can I assist you in your professional journey?"
         },
      ];
    } else if (chatId) {
       partnerName = `Professional ${chatId}`;
       partnerType = 'professional';
       avatar = `https://picsum.photos/seed/${chatId}/40/40`;
       initials = partnerName.split(' ').map(n => n[0]).join('').toUpperCase();
       initialMessages = [
         { id: 101, text: "Hi! Thanks for reaching out.", sender: 'professional', timestamp: new Date(Date.now() - 120000) },
         { id: 102, text: "I had a question about your field.", sender: 'user', timestamp: new Date(Date.now() - 90000) },
       ];
    } else {
       partnerName = 'Select a Chat';
       initialMessages = []; // No messages if no chat selected
    }

    setChatPartner({ name: partnerName, type: partnerType, avatarUrl: avatar, initials });
    setMessages(initialMessages);
    setLoadingChat(false);
    scrollToBottom();

  }, [chatId, scrollToBottom]);


  useEffect(() => {
     scrollToBottom();
   }, [messages, scrollToBottom]);


  const handleSendMessage = async (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!newMessage.trim() || isLoading || !chatPartner) return;

    const userMessage: Message = {
      id: Date.now(),
      text: newMessage,
      sender: 'user',
      timestamp: new Date(),
    };

    const currentMessages = [...messages, userMessage];
    setMessages(currentMessages);
    setNewMessage('');
    setIsLoading(true);

    console.log('Sending message:', userMessage.text, 'to', chatPartner.name);
    await new Promise(resolve => setTimeout(resolve, 100)); // Tiny delay for UI update

    if (chatPartner.type === 'ai') {
       const conversationHistory = currentMessages
          .map(m => {
              if (m.sender === 'user') return `User: ${m.text}`;
              if (m.sender === 'ai') {
                 // Reconstruct AI message for history
                 let aiText = '';
                 if (m.analysis) aiText += `Analysis: ${m.analysis}\n`;
                 if (m.initialGuidance) aiText += `Guidance: ${m.initialGuidance}\n`;
                 if (m.followUpQuestion) aiText += `Question: ${m.followUpQuestion}`;
                 if (!aiText && m.text) aiText = m.text; // Fallback to simple text
                 return `AI Counselor: ${aiText.trim()}`;
              }
              return ''; // Should not happen for AI chat
          })
          .filter(Boolean) // Remove empty strings
          .join('\n\n'); // Use double newline for better separation

       // Rough language detection (replace with a proper library if needed)
       const userLanguage = navigator.language.split('-')[0] || 'en';

       const aiInput: SuggestProfessionalsInput = {
         conversationHistory,
         userLanguage,
       };

       try {
         const aiResponse: SuggestProfessionalsOutput = await suggestProfessionals(aiInput);

         const aiMessage: Message = {
           id: Date.now() + 1,
           sender: 'ai',
           timestamp: new Date(),
           analysis: aiResponse.analysis,
           initialGuidance: aiResponse.initialGuidance,
           suggestions: aiResponse.suggestedProfessionals,
           followUpQuestion: aiResponse.followUpQuestion,
         };
         setMessages(prev => [...prev, aiMessage]);

       } catch (error) {
          console.error("AI suggestion error:", error);
          const errorMessage: Message = {
             id: Date.now() + 1,
             sender: 'ai',
             timestamp: new Date(),
             text: "Sorry, I encountered an error trying to process that. Could you try rephrasing, or perhaps try again in a moment?",
             isError: true,
           };
          setMessages(prev => [...prev, errorMessage]);
       }


    } else { // Professional chat simulation
      const professionalResponse: Message = {
        id: Date.now() + 1,
        text: `Thanks for your message! Let me think about that... (Simulated response from ${chatPartner.name})`,
        sender: 'professional',
        timestamp: new Date(),
      };
      await new Promise(resolve => setTimeout(resolve, 1000));
      setMessages(prev => [...prev, professionalResponse]);
    }

    setIsLoading(false);
    scrollToBottom();
  };

   // Helper to render AI message content
   const renderAiMessage = (message: Message) => (
     <div className="space-y-3">
        {message.isError && message.text && (
           <Alert variant="destructive">
             <AlertTitle>Error</AlertTitle>
             <AlertDescription>{message.text}</AlertDescription>
           </Alert>
        )}
       {message.analysis && (
         <div className="border-l-4 border-blue-500 pl-3">
           <p className="text-sm font-medium flex items-center gap-1.5 mb-1"><BrainCircuit size={14}/> Analysis:</p>
           <p className="text-sm">{message.analysis}</p>
         </div>
       )}
       {message.initialGuidance && (
         <div className="border-l-4 border-green-500 pl-3">
           <p className="text-sm font-medium flex items-center gap-1.5 mb-1"><Lightbulb size={14}/> Guidance:</p>
           <p className="text-sm">{message.initialGuidance}</p>
         </div>
       )}
       {message.suggestions && message.suggestions.length > 0 && (
         <div className="mt-3 pt-3 border-t border-muted-foreground/20 space-y-3">
           <p className="text-sm font-medium flex items-center gap-1.5"><Users size={14} /> Suggested Professionals:</p>
           <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
             {message.suggestions.map(pro => (
               <Card key={pro.id} className="bg-background text-foreground p-3 shadow-sm transition-shadow hover:shadow-md">
                 <p className="font-semibold text-sm">{pro.name}</p>
                 <p className="text-xs text-muted-foreground mb-1">{pro.field}</p>
                 <p className="text-xs mb-2">{pro.description.substring(0, 80)}...</p>
                 <div className="flex flex-wrap gap-1 mb-2">
                   {pro.skills.slice(0, 3).map(skill => <Badge key={skill} variant="secondary" className="text-xs">{skill}</Badge>)}
                 </div>
                 <Button variant="link" size="sm" className="h-auto p-0 text-primary text-xs" asChild>
                   <Link href={`/user/schedule/${pro.id}`}>View Profile & Schedule</Link>
                 </Button>
               </Card>
             ))}
           </div>
         </div>
       )}
       {message.followUpQuestion && (
          <div className="border-l-4 border-purple-500 pl-3">
            <p className="text-sm font-medium flex items-center gap-1.5 mb-1"><HelpCircle size={14} /> Question:</p>
            <p className="text-sm italic">{message.followUpQuestion}</p>
          </div>
       )}
       {/* Fallback for simple text messages if AI doesn't return structured data */}
       {!message.analysis && !message.initialGuidance && !message.followUpQuestion && message.text && !message.isError && (
          <p>{message.text}</p>
       )}
     </div>
   );


  return (
    <AppLayout userType="user">
      <div className="flex flex-col h-[calc(100vh-theme(space.28))]"> {/* Adjust height based on layout */}
       {loadingChat ? (
           <Card className="flex-1 flex flex-col">
             <CardHeader className="flex flex-row items-center gap-4 border-b p-4 bg-muted/50">
               <Skeleton className="h-10 w-10 rounded-full" />
                <Skeleton className="h-5 w-32" />
              </CardHeader>
             <CardContent className="flex-1 p-4 space-y-4 overflow-hidden">
                <Skeleton className="h-10 w-3/4 rounded-md" />
                <Skeleton className="ml-auto h-10 w-1/2 rounded-md" />
                <Skeleton className="h-10 w-2/3 rounded-md" />
             </CardContent>
             <CardFooter className="p-4 border-t bg-muted/30">
                 <Skeleton className="h-10 flex-1 mr-2 rounded-md" />
                 <Skeleton className="h-10 w-16 rounded-md" />
              </CardFooter>
           </Card>
       ) : chatId && chatPartner ? (
          <Card className="flex-1 flex flex-col shadow-lg overflow-hidden">
            <CardHeader className="flex flex-row items-center gap-4 border-b p-4 bg-muted/50">
              <Avatar>
                 <AvatarImage src={chatPartner.avatarUrl} />
                 <AvatarFallback>
                    {chatPartner.type === 'ai' ? <Bot size={20} /> : chatPartner.initials}
                  </AvatarFallback>
              </Avatar>
              <CardTitle className="text-lg font-medium">{chatPartner.name}</CardTitle>
            </CardHeader>

            <ScrollArea className="flex-1 p-4 bg-background" ref={scrollAreaRef}>
              <div className="space-y-4 pb-4">
                {messages.map((message) => (
                  <div
                    key={message.id}
                    className={cn(
                      "flex items-end gap-2 max-w-[85%]", // Allow slightly wider messages
                      message.sender === 'user' ? 'ml-auto flex-row-reverse' : 'mr-auto'
                    )}
                  >
                     {message.sender !== 'user' && (
                       <Avatar className="h-8 w-8 self-start mt-1"> {/* Align avatar top */}
                          <AvatarImage src={chatPartner.avatarUrl} />
                          <AvatarFallback>
                            {chatPartner.type === 'ai' ? <Bot size={16} /> : chatPartner.initials[0]}
                           </AvatarFallback>
                       </Avatar>
                     )}
                    <div
                      className={cn(
                        "rounded-lg px-4 py-2 text-sm shadow-md", // Slightly more prominent shadow
                        message.sender === 'user'
                          ? 'bg-primary text-primary-foreground'
                          : 'bg-muted text-foreground', // Use foreground for AI/pro text on muted bg
                        message.isError ? 'bg-destructive text-destructive-foreground border border-destructive-foreground/20' : ''
                      )}
                    >
                     {message.sender === 'ai' ? renderAiMessage(message) : <p>{message.text}</p>}
                     {message.timestamp && (
                         <p className="text-xs opacity-60 mt-1.5 text-right">
                           {formatTime(message.timestamp)}
                         </p>
                      )}
                    </div>
                  </div>
                ))}
                {isLoading && (
                  <div className="flex items-end gap-2 max-w-[75%] mr-auto">
                     <Avatar className="h-8 w-8 self-start mt-1">
                        <AvatarImage src={chatPartner.avatarUrl} />
                        <AvatarFallback>
                           {chatPartner.type === 'ai' ? <Bot size={16} /> : chatPartner.initials[0]}
                        </AvatarFallback>
                     </Avatar>
                     <div className="rounded-lg px-4 py-3 bg-muted shadow-md"> {/* Adjusted padding */}
                       <div className="flex space-x-1.5"> {/* Adjusted spacing */}
                          <span className="h-2 w-2 bg-muted-foreground rounded-full animate-bounce [animation-delay:-0.3s]"></span>
                          <span className="h-2 w-2 bg-muted-foreground rounded-full animate-bounce [animation-delay:-0.15s]"></span>
                          <span className="h-2 w-2 bg-muted-foreground rounded-full animate-bounce"></span>
                       </div>
                     </div>
                  </div>
                )}
              </div>
            </ScrollArea>

            <CardFooter className="p-4 border-t bg-muted/30">
              <form onSubmit={handleSendMessage} className="flex w-full items-center gap-2">
                <Input
                  placeholder="Type your message..."
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  disabled={isLoading || !chatPartner}
                  className="flex-1 bg-background focus:ring-accent" // Ensure input is visible on dark bg
                  autoComplete="off"
                   onKeyDown={(e) => { if (e.key === 'Enter' && !e.shiftKey) handleSendMessage(e); }}
                />
                <Button type="submit" size="icon" disabled={isLoading || !newMessage.trim() || !chatPartner} aria-label="Send Message">
                  <Send className="h-4 w-4" />
                </Button>
              </form>
            </CardFooter>
          </Card>
       ) : (
         <div className="flex-1 flex items-center justify-center p-8 text-center">
            <Card className="max-w-md p-6 shadow-lg">
                <CardTitle>Start a Conversation</CardTitle>
                <CardDescription className="mt-2 mb-4">Select a previous chat from the sidebar or start a new one with our AI Counselor.</CardDescription>
                 <Button asChild>
                   <Link href="/user/chat/ai">Chat with AI Counselor</Link>
                 </Button>
             </Card>
         </div>
       )}
      </div>
    </AppLayout>
  );
}

function formatTime(date: Date): string {
  return date.toLocaleTimeString([], { hour: 'numeric', minute: '2-digit', hour12: true });
}
