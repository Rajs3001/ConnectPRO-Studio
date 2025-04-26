
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Skeleton } from '@/components/ui/skeleton';
import { Badge } from '@/components/ui/badge';
import Link from 'next/link';
import SiteLoader from '@/components/shared/site-loader'; // Import SiteLoader

// Mock data for direct messages/chats (replace with actual API fetch)
const mockChats = [
  { id: 'dm1', userId: 'u123', userName: 'Jane Doe', lastMessage: 'Sounds good, let me know!', timestamp: new Date(Date.now() - 300000), unreadCount: 2, avatar: 'https://picsum.photos/seed/janedoe/40/40' },
  { id: 'ai', userId: 'ai', userName: 'AI Counselor', lastMessage: 'Here are some resources based on our chat...', timestamp: new Date(Date.now() - 3600000), unreadCount: 0, avatar: '/ai-avatar.png' }, // Use 'ai' as ID
  { id: 'g1', groupId: 'g1', groupName: 'Software Dev Hangout', lastMessage: 'Anyone used the new React update?', timestamp: new Date(Date.now() - 7200000), unreadCount: 5, isGroup: true },
  { id: 'dm3', userId: 'u789', userName: 'Mike Smith', lastMessage: 'Thanks for the help!', timestamp: new Date(Date.now() - 86400000), unreadCount: 0, avatar: 'https://picsum.photos/seed/mikesmith/40/40' },
  { id: 'g2', groupId: 'g2', groupName: 'Aspiring Data Scientists', lastMessage: 'Check out this Kaggle competition.', timestamp: new Date(Date.now() - 172800000), unreadCount: 1, isGroup: true },
];

export default function CommunityMessagesSection() {
  const [loading, setLoading] = React.useState(true); // Simulate loading state initially

  // Simulate loading on initial mount
  React.useEffect(() => {
      const timer = setTimeout(() => setLoading(false), 700); // Simulate fetch time
      return () => clearTimeout(timer);
  }, []);


  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Messages & Group Chats</CardTitle>
          {/* Add search/filter/new message functionality here */}
        </CardHeader>
        <CardContent className="space-y-2 min-h-[200px]"> {/* Added min-height */}
          {loading ? (
             <div className="flex items-center justify-center h-full">
                <SiteLoader size="lg" />
             </div>
          ) : mockChats.length > 0 ? (
            mockChats.sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime()).map(chat => {
              const chatLink = chat.id === 'ai' ? '/community/chat/ai' : (chat.isGroup ? `/community/chat/group/${chat.groupId}` : `/community/chat/dm/${chat.userId}`);
              return (
                <Link key={chat.id} href={chatLink} passHref>
                  <Card className="flex items-center justify-between p-3 hover:bg-muted/50 transition-colors cursor-pointer">
                    <div className="flex items-center gap-3 overflow-hidden">
                      <Avatar className="h-10 w-10 shrink-0">
                         {chat.id !== 'ai' && !chat.isGroup && <AvatarImage src={chat.avatar} alt={chat.userName} />}
                         {chat.id === 'ai' && <AvatarImage src={chat.avatar} alt={chat.userName} />}
                         <AvatarFallback>
                           {chat.isGroup ? chat.groupName?.substring(0, 2).toUpperCase() : chat.userName?.split(' ').map(n => n[0]).join('')}
                         </AvatarFallback>
                      </Avatar>
                      <div className="flex-grow overflow-hidden">
                        <p className="font-semibold text-sm truncate">{chat.isGroup ? chat.groupName : chat.userName}</p>
                        <p className="text-xs text-muted-foreground truncate">{chat.lastMessage}</p>
                      </div>
                    </div>
                    <div className="flex flex-col items-end shrink-0 ml-2">
                        <span className="text-[10px] text-muted-foreground mb-1">
                            {timeAgo(chat.timestamp)}
                        </span>
                      {chat.unreadCount > 0 && (
                        <Badge variant="destructive" className="h-5 px-1.5 text-xs">{chat.unreadCount}</Badge>
                      )}
                    </div>
                  </Card>
                </Link>
              );
            })
          ) : (
            <p className="text-center text-muted-foreground py-4">No messages or group chats yet.</p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

// Skeleton kept for reference, but SiteLoader is used now
const ChatSkeleton = () => (
  <Card className="flex items-center justify-between p-3">
    <div className="flex items-center gap-3">
      <Skeleton className="h-10 w-10 rounded-full" />
      <div className="space-y-1">
        <Skeleton className="h-4 w-24" />
        <Skeleton className="h-3 w-32" />
      </div>
    </div>
    <div className="flex flex-col items-end">
        <Skeleton className="h-3 w-8 mb-1" />
        <Skeleton className="h-5 w-5 rounded-full" />
    </div>
  </Card>
);


// Helper function (can be moved to utils)
const timeAgo = (date: Date): string => {
    const seconds = Math.floor((new Date().getTime() - date.getTime()) / 1000);
    let interval = seconds / 31536000; // years
    if (interval > 1) return Math.floor(interval) + "y";
    interval = seconds / 2592000; // months
    if (interval > 1) return Math.floor(interval) + "mo";
    interval = seconds / 604800; // weeks
    if (interval > 1) return Math.floor(interval) + "w";
    interval = seconds / 86400; // days
    if (interval > 1) return Math.floor(interval) + "d";
    interval = seconds / 3600; // hours
    if (interval > 1) return Math.floor(interval) + "h";
    interval = seconds / 60; // minutes
    if (interval > 1) return Math.floor(interval) + "m";
    return "now";
};
