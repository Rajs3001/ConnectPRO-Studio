"use client";

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useParams } from 'next/navigation';
import AppLayout from '@/components/layouts/app-layout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Send, Bot, User } from 'lucide-react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { cn } from '@/lib/utils';
import { suggestProfessionals, SuggestProfessionalsInput } from '@/ai/flows/suggest-professionals';
import { Skeleton } from '@/components/ui/skeleton';
import Link from 'next/link';
import { Badge } from '@/components/ui/badge';

interface Message {
  id: string | number;
  text: string;
  sender: 'user' | 'professional' | 'ai';
  timestamp: Date;
  suggestions?: { id: string; name: string; field: string; description: string; skills: string[] }[];
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
    // TODO: Fetch chat history based on chatId
    console.log(`Loading chat for ID: ${chatId}`);

    // Simulate fetching chat partner details and history
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
        { id: 1, text: "Hello! I'm your AI Counselor. How can I help you explore professional connections today?", sender: 'ai', timestamp: new Date(Date.now() - 60000) },
      ];
    } else if (chatId) {
      // Simulate fetching professional details
       partnerName = `Professional ${chatId}`; // Replace with actual name fetch
       partnerType = 'professional';
       avatar = `https://picsum.photos/seed/${chatId}/40/40`;
       initials = partnerName.split(' ').map(n => n[0]).join('').toUpperCase();
      // Simulate fetching message history for this professional
       initialMessages = [
         { id: 101, text: "Hi! Thanks for reaching out.", sender: 'professional', timestamp: new Date(Date.now() - 120000) },
         { id: 102, text: "I had a question about your field.", sender: 'user', timestamp: new Date(Date.now() - 90000) },
       ];
    } else {
       // Handle case where no chat is selected (e.g., show a list or prompt)
       partnerName = 'Select a Chat';
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
      id: Date.now(), // Temporary ID
      text: newMessage,
      sender: 'user',
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    setNewMessage('');
    setIsLoading(true);

    // Simulate API call to send message
    console.log('Sending message:', userMessage.text, 'to', chatPartner.name);
    await new Promise(resolve => setTimeout(resolve, 500));

    // Get response
    if (chatPartner.type === 'ai') {
       // Prepare conversation history for AI
        const conversationHistory = messages
          .concat(userMessage)
          .map(m => `${m.sender === 'user' ? 'User' : 'AI Counselor'}: ${m.text}`)
          .join('\n');

       const aiInput: SuggestProfessionalsInput = { conversationHistory };

       try {
          // Call the Genkit flow
         const aiResponse = await suggestProfessionals(aiInput);

         const aiMessageText = `Based on our conversation, here are some professionals you might find helpful:`; // Default response if no suggestions
         const aiMessage: Message = {
           id: Date.now() + 1, // Temporary ID
           text: aiMessageText,
           sender: 'ai',
           timestamp: new Date(),
           suggestions: aiResponse.suggestedProfessionals,
         };
         setMessages(prev => [...prev, aiMessage]);

       } catch (error) {
          console.error("AI suggestion error:", error);
          const errorMessage: Message = {
             id: Date.now() + 1,
             text: "Sorry, I encountered an error trying to find suggestions. Could you try rephrasing?",
             sender: 'ai',
             timestamp: new Date(),
           };
          setMessages(prev => [...prev, errorMessage]);
       }


    } else {
      // Simulate professional response
      const professionalResponse: Message = {
        id: Date.now() + 1, // Temporary ID
        text: `Thanks for your message! Let me think about that... (Simulated response)`,
        sender: 'professional',
        timestamp: new Date(),
      };
      await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate delay
      setMessages(prev => [...prev, professionalResponse]);
    }

    setIsLoading(false);
    scrollToBottom();
  };


  return (
    <AppLayout userType="user">
      <div className="flex flex-col h-[calc(100vh-theme(space.28))]"> {/* Adjust height based on layout */}
       {loadingChat ? (
           <Card className="flex-1 flex flex-col">
             <CardHeader className="flex flex-row items-center gap-4 border-b p-4">
               <Skeleton className="h-10 w-10 rounded-full" />
                <Skeleton className="h-5 w-32" />
              </CardHeader>
             <CardContent className="flex-1 p-4 space-y-4">
                <Skeleton className="h-10 w-3/4 rounded-md" />
                <Skeleton className="h-10 w-1/2 rounded-md self-end" />
                <Skeleton className="h-10 w-2/3 rounded-md" />
             </CardContent>
             <CardFooter className="p-4 border-t">
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

            <ScrollArea className="flex-1 p-4" ref={scrollAreaRef}>
              <div className="space-y-4">
                {messages.map((message) => (
                  <div
                    key={message.id}
                    className={cn(
                      "flex items-end gap-2 max-w-[75%]",
                      message.sender === 'user' ? 'ml-auto flex-row-reverse' : 'mr-auto'
                    )}
                  >
                     {message.sender !== 'user' && (
                       <Avatar className="h-8 w-8">
                          <AvatarImage src={chatPartner.avatarUrl} />
                          <AvatarFallback>
                            {chatPartner.type === 'ai' ? <Bot size={16} /> : chatPartner.initials[0]}
                           </AvatarFallback>
                       </Avatar>
                     )}
                    <div
                      className={cn(
                        "rounded-lg px-4 py-2 text-sm shadow",
                        message.sender === 'user'
                          ? 'bg-primary text-primary-foreground'
                          : 'bg-muted text-muted-foreground'
                      )}
                    >
                      <p>{message.text}</p>
                       {message.suggestions && message.suggestions.length > 0 && (
                         <div className="mt-3 pt-3 border-t border-muted-foreground/20 space-y-3">
                           <p className="text-xs font-medium">Suggested Professionals:</p>
                            {message.suggestions.map(pro => (
                             <Card key={pro.id} className="bg-background text-foreground p-3 shadow-sm">
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
                       )}
                      <p className="text-xs opacity-60 mt-1 text-right">
                        {formatTime(message.timestamp)}
                      </p>
                    </div>
                  </div>
                ))}
                {isLoading && (
                  <div className="flex items-end gap-2 max-w-[75%] mr-auto">
                     <Avatar className="h-8 w-8">
                        <AvatarImage src={chatPartner.avatarUrl} />
                        <AvatarFallback>
                           {chatPartner.type === 'ai' ? <Bot size={16} /> : chatPartner.initials[0]}
                        </AvatarFallback>
                     </Avatar>
                     <div className="rounded-lg px-4 py-2 bg-muted">
                       <div className="flex space-x-1">
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
                  disabled={isLoading}
                  className="flex-1"
                />
                <Button type="submit" size="icon" disabled={isLoading || !newMessage.trim()}>
                  <Send className="h-4 w-4" />
                </Button>
              </form>
            </CardFooter>
          </Card>
       ) : (
         <div className="flex-1 flex items-center justify-center">
            <p className="text-muted-foreground">Select a chat or start a new one.</p>
            {/* Optionally show list of recent chats here */}
         </div>
       )}
      </div>
    </AppLayout>
  );
}

function formatTime(date: Date): string {
  return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
}


