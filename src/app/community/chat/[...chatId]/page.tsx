
"use client";

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Send, Bot, User, Users, ChevronLeft } from 'lucide-react'; // Added Users icon
import { ScrollArea } from '@/components/ui/scroll-area';
import { cn } from '@/lib/utils';
import { Skeleton } from '@/components/ui/skeleton';
import Link from 'next/link';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"; // Added Alert


// Interface definitions (can be moved to a types file)
interface Message {
  id: string | number;
  senderId: string; // ID of the sender (user, ai, or another user)
  senderName: string; // Display name of the sender
  senderAvatar?: string; // Avatar URL
  timestamp: Date;
  text: string; // Message content
  isError?: boolean; // Flag for error messages
}

interface ChatPartner {
  id: string; // user ID, group ID, or 'ai'
  name: string;
  type: 'ai' | 'user' | 'group';
  avatarUrl?: string;
  initials: string;
}

// Mock data fetching functions (replace with API calls)
const fetchChatPartnerDetails = async (chatIdSegments: string[]): Promise<ChatPartner | null> => {
    await new Promise(resolve => setTimeout(resolve, 300));
    const type = chatIdSegments[0]; // 'ai', 'dm', 'group'
    const id = chatIdSegments[1];

    if (type === 'ai') {
        return { id: 'ai', name: 'AI Counselor', type: 'ai', avatarUrl: '/ai-avatar.png', initials: 'AI' };
    } else if (type === 'dm' && id) {
        // Fetch user details based on id
        const userName = `User ${id.substring(0, 4)}`; // Mock name
        return { id: id, name: userName, type: 'user', avatarUrl: `https://picsum.photos/seed/${id}/40/40`, initials: userName.split(' ').map(n => n[0]).join('') };
    } else if (type === 'group' && id) {
        // Fetch group details based on id
        const groupName = `Group ${id.substring(0, 3)}`; // Mock name
        return { id: id, name: groupName, type: 'group', initials: groupName.substring(0, 2).toUpperCase() };
    }
    return null;
};

const fetchMessages = async (chatId: string, chatType: 'ai' | 'user' | 'group'): Promise<Message[]> => {
     await new Promise(resolve => setTimeout(resolve, 500));
    if (chatType === 'ai') {
         return [
            { id: 1, senderId: 'ai', senderName: 'AI Counselor', timestamp: new Date(Date.now() - 60000), text: "Welcome! I'm your AI Counselor. How can I assist you today?" },
            { id: 2, senderId: 'currentUser', senderName: 'You', timestamp: new Date(Date.now() - 30000), text: "Hi! I need some career advice." },
            // Add AI response logic here...
         ];
    } else if (chatType === 'user') {
        return [
             { id: 101, senderId: chatId, senderName: `User ${chatId.substring(0,4)}`, timestamp: new Date(Date.now() - 120000), text: "Hey there!" },
             { id: 102, senderId: 'currentUser', senderName: 'You', timestamp: new Date(Date.now() - 90000), text: "Hi! Got your message." },
        ];
    } else if (chatType === 'group') {
         return [
             { id: 201, senderId: 'userA', senderName: 'Alice', timestamp: new Date(Date.now() - 180000), text: "Hey everyone!" },
             { id: 202, senderId: 'userB', senderName: 'Bob', timestamp: new Date(Date.now() - 150000), text: "Hi Alice! Good discussion point." },
             { id: 203, senderId: 'currentUser', senderName: 'You', timestamp: new Date(Date.now() - 60000), text: "What do you all think about the new framework?" },
        ];
    }
    return [];
};

// AI Flow Import (Keep as is or update based on new requirements)
// import { suggestProfessionals, SuggestProfessionalsInput, SuggestProfessionalsOutput } from '@/ai/flows/suggest-professionals';


export default function CommunityChatPage() {
  const params = useParams();
  const router = useRouter();
  const chatIdSegments = params.chatId as string[] || []; // e.g., ['dm', 'user123'] or ['group', 'g1'] or ['ai']
  const scrollAreaRef = useRef<HTMLDivElement>(null);

  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false); // Loading state for sending messages
  const [chatPartner, setChatPartner] = useState<ChatPartner | null>(null);
  const [loadingChat, setLoadingChat] = useState(true);

  const scrollToBottom = useCallback(() => {
     setTimeout(() => {
       const scrollViewport = scrollAreaRef.current?.querySelector('[data-radix-scroll-area-viewport]');
       if (scrollViewport) {
         scrollViewport.scrollTop = scrollViewport.scrollHeight;
       }
     }, 100); // Delay slightly to allow DOM update
   }, []);

  // Fetch chat partner details and initial messages
  useEffect(() => {
    if (chatIdSegments.length === 0) {
        setLoadingChat(false);
        // Maybe redirect to /community/messages or show a placeholder
        router.replace('/community'); // Redirect if no chat ID
        return;
    }

    const loadChat = async () => {
        setLoadingChat(true);
        setMessages([]); // Clear previous messages
        const partnerDetails = await fetchChatPartnerDetails(chatIdSegments);
        setChatPartner(partnerDetails);

        if (partnerDetails) {
            const initialMessages = await fetchMessages(partnerDetails.id, partnerDetails.type);
            setMessages(initialMessages);
        } else {
            // Handle case where chat partner not found
             console.error("Chat partner not found for:", chatIdSegments);
        }
        setLoadingChat(false);
        scrollToBottom();
    }
    loadChat();

  }, [chatIdSegments, scrollToBottom, router]);


  useEffect(() => {
     scrollToBottom();
   }, [messages, scrollToBottom]);


  const handleSendMessage = async (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!newMessage.trim() || isLoading || !chatPartner) return;

    const userMessage: Message = {
      id: Date.now(),
      senderId: 'currentUser', // Replace with actual logged-in user ID
      senderName: 'You',
      text: newMessage,
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    setNewMessage('');
    setIsLoading(true);

    console.log('Sending message:', userMessage.text, 'to', chatPartner.name);
    await new Promise(resolve => setTimeout(resolve, 100)); // UI update delay

    // --- TODO: Implement actual message sending logic ---
    // 1. Send message to backend API (based on chatPartner.type and chatPartner.id)
    // 2. If AI chat, call the AI flow
    // 3. Receive and display response

    if (chatPartner.type === 'ai') {
        // Simulate AI response (replace with actual AI call)
        await new Promise(resolve => setTimeout(resolve, 1200));
         const aiResponse: Message = {
           id: Date.now() + 1,
           senderId: 'ai',
           senderName: 'AI Counselor',
           timestamp: new Date(),
           text: `That's an interesting point about "${userMessage.text.substring(0, 20)}...". Let me think... (Simulated AI response)`,
         };
         setMessages(prev => [...prev, aiResponse]);
      // --- Example AI Call (if using suggestProfessionals flow) ---
      /*
       const conversationHistory = [...messages, userMessage] // Use current state + new message
          .map(m => `${m.senderName}: ${m.text}`)
          .join('\n\n');
       const aiInput: SuggestProfessionalsInput = { conversationHistory };
       try {
         const aiOutput: SuggestProfessionalsOutput = await suggestProfessionals(aiInput);
         const aiMessage: Message = { ... create AI message object from aiOutput ... };
         setMessages(prev => [...prev, aiMessage]);
       } catch (error) { ... handle error ... }
      */

    } else { // DM or Group chat simulation
      await new Promise(resolve => setTimeout(resolve, 800));
      // Simulate receiving the message back or a response from the other user/group
       // In a real app, this would come via WebSocket or polling
       console.log(`Message sent to ${chatPartner.type} ${chatPartner.name}. Waiting for response...`);
       // No automatic response simulation here, wait for real interaction or mock separately.
    }

    setIsLoading(false);
    scrollToBottom();
  };


  return (
     // This page doesn't use AppLayout, it's a focused chat view
      <div className="flex flex-col h-screen bg-background">
       {loadingChat ? (
           <ChatLoadingSkeleton />
       ) : chatPartner ? (
          <Card className="flex-1 flex flex-col shadow-lg overflow-hidden border-none rounded-none">
            {/* Chat Header */}
            <CardHeader className="flex flex-row items-center gap-3 border-b p-3 bg-muted/50 sticky top-0 z-10">
              <Button variant="ghost" size="icon" className="mr-1 h-8 w-8" onClick={() => router.back()}>
                  <ChevronLeft size={20} />
              </Button>
              <Avatar className="h-9 w-9">
                 <AvatarImage src={chatPartner.avatarUrl} />
                 <AvatarFallback>
                    {chatPartner.type === 'ai' ? <Bot size={18} /> :
                     chatPartner.type === 'group' ? <Users size={18} /> :
                     chatPartner.initials}
                  </AvatarFallback>
              </Avatar>
              <CardTitle className="text-base font-medium">{chatPartner.name}</CardTitle>
              {/* Add group members icon or other actions here */}
            </CardHeader>

            {/* Message Area */}
            <ScrollArea className="flex-1 p-4" ref={scrollAreaRef}>
              <div className="space-y-4 pb-4">
                {messages.map((message) => (
                  <div
                    key={message.id}
                    className={cn(
                      "flex items-end gap-2 max-w-[85%]", // Allow slightly wider messages
                       message.senderId === 'currentUser' ? 'ml-auto flex-row-reverse' : 'mr-auto'
                    )}
                  >
                     {message.senderId !== 'currentUser' && (
                       <Avatar className="h-7 w-7 self-start mt-1 shrink-0"> {/* Align avatar top */}
                          <AvatarImage src={message.senderAvatar || chatPartner.avatarUrl} /> {/* Use sender avatar if available */}
                          <AvatarFallback>
                            {message.senderName.substring(0, 1).toUpperCase()}
                           </AvatarFallback>
                       </Avatar>
                     )}
                    <div
                      className={cn(
                        "rounded-lg px-3 py-1.5 text-sm shadow-md break-words", // break-words for long text
                        message.senderId === 'currentUser'
                          ? 'bg-primary text-primary-foreground'
                          : 'bg-muted text-foreground',
                        message.isError ? 'bg-destructive text-destructive-foreground border border-destructive-foreground/20' : ''
                      )}
                    >
                     {/* Display sender name for groups, optional for DMs */}
                      {chatPartner.type === 'group' && message.senderId !== 'currentUser' && (
                          <p className="text-xs font-semibold mb-0.5 opacity-80">{message.senderName}</p>
                      )}
                     <p>{message.text}</p>
                     {message.timestamp && (
                         <p className="text-[10px] opacity-60 mt-1 text-right">
                           {formatTime(message.timestamp)}
                         </p>
                      )}
                    </div>
                  </div>
                ))}
                {isLoading && <TypingIndicator partner={chatPartner} />}
              </div>
            </ScrollArea>

            {/* Input Footer */}
            <CardFooter className="p-3 border-t bg-muted/30">
              <form onSubmit={handleSendMessage} className="flex w-full items-center gap-2">
                <Input
                  placeholder="Type your message..."
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  disabled={isLoading || !chatPartner}
                  className="flex-1 bg-background focus:ring-primary h-9 text-sm"
                  autoComplete="off"
                   onKeyDown={(e) => { if (e.key === 'Enter' && !e.shiftKey) handleSendMessage(e); }}
                />
                <Button type="submit" size="icon" className="h-9 w-9" disabled={isLoading || !newMessage.trim() || !chatPartner} aria-label="Send Message">
                  <Send className="h-4 w-4" />
                </Button>
              </form>
            </CardFooter>
          </Card>
       ) : (
          // Handle case where chat couldn't be loaded
           <div className="flex-1 flex flex-col items-center justify-center p-8 text-center">
              <Button variant="outline" size="sm" className="mb-4" onClick={() => router.back()}>
                  <ChevronLeft className="mr-1 h-4 w-4" /> Back
              </Button>
             <Card className="max-w-md p-6 shadow-lg">
                 <CardTitle className="text-destructive">Chat Not Found</CardTitle>
                 <CardDescription className="mt-2 mb-4">Could not load the requested chat.</CardDescription>
                  <Button asChild variant="secondary">
                    <Link href="/community">Go to Community</Link>
                  </Button>
              </Card>
          </div>
       )}
      </div>
  );
}

// Helper Components
const ChatLoadingSkeleton = () => (
    <div className="flex-1 flex flex-col">
        <CardHeader className="flex flex-row items-center gap-3 border-b p-3 bg-muted/50 sticky top-0 z-10">
            <Skeleton className="h-9 w-9 rounded-full" />
            <Skeleton className="h-5 w-32" />
        </CardHeader>
        <CardContent className="flex-1 p-4 space-y-4 overflow-hidden">
            <Skeleton className="h-10 w-3/4 rounded-md mr-auto" />
            <Skeleton className="ml-auto h-10 w-1/2 rounded-md" />
            <Skeleton className="h-10 w-2/3 rounded-md mr-auto" />
        </CardContent>
        <CardFooter className="p-3 border-t bg-muted/30">
            <Skeleton className="h-9 flex-1 mr-2 rounded-md" />
            <Skeleton className="h-9 w-9 rounded-md" />
        </CardFooter>
    </div>
);

const TypingIndicator: React.FC<{ partner: ChatPartner }> = ({ partner }) => (
    <div className="flex items-end gap-2 max-w-[75%] mr-auto">
        <Avatar className="h-7 w-7 self-start mt-1 shrink-0">
            <AvatarImage src={partner.avatarUrl} />
            <AvatarFallback>
                 {partner.type === 'ai' ? <Bot size={14} /> :
                  partner.type === 'group' ? <Users size={14} /> :
                  partner.initials[0]}
            </AvatarFallback>
        </Avatar>
        <div className="rounded-lg px-3 py-2 bg-muted shadow-md">
            <div className="flex space-x-1">
                <span className="h-1.5 w-1.5 bg-muted-foreground rounded-full animate-bounce [animation-delay:-0.3s]"></span>
                <span className="h-1.5 w-1.5 bg-muted-foreground rounded-full animate-bounce [animation-delay:-0.15s]"></span>
                <span className="h-1.5 w-1.5 bg-muted-foreground rounded-full animate-bounce"></span>
            </div>
        </div>
    </div>
);


// Utility function
function formatTime(date: Date): string {
  return date.toLocaleTimeString([], { hour: 'numeric', minute: '2-digit', hour12: true });
}

