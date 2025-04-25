
"use client";

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation'; // Added usePathname
import {
  SidebarProvider,
  Sidebar,
  SidebarHeader,
  SidebarContent,
  SidebarFooter,
  SidebarTrigger,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarInset
} from '@/components/ui/sidebar';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { LogOut, User, Calendar, MessageSquare, Settings, LayoutDashboard, Search, UserCog, Bot } from 'lucide-react'; // Added Bot icon
import { useToast } from '@/hooks/use-toast';
import React from 'react';

interface AppLayoutProps {
  children: React.ReactNode;
  userType: 'user' | 'professional';
}

interface MenuItem {
    href: string;
    label: string;
    icon: React.ElementType; // Use React.ElementType for component types
    exact?: boolean; // Optional: for exact path matching
}

// Define menu items for each user type
const getUserMenuItems = (): MenuItem[] => [
    { href: `/user/dashboard`, label: 'Dashboard', icon: LayoutDashboard, exact: true },
    { href: '/user/find-professional', label: 'Find Professionals', icon: Search },
    { href: '/user/appointments', label: 'My Appointments', icon: Calendar },
    { href: '/user/chat', label: 'Chats', icon: MessageSquare },
    { href: '/user/chat/ai', label: 'AI Counselor', icon: Bot }, // Explicit AI chat link
    { href: `/user/profile`, label: 'Profile Settings', icon: Settings },
];

const getProfessionalMenuItems = (): MenuItem[] => [
    { href: `/professional/dashboard`, label: 'Dashboard', icon: LayoutDashboard, exact: true },
    { href: '/professional/schedule', label: 'Manage Schedule', icon: Calendar },
    { href: '/professional/appointments', label: 'Appointments', icon: UserCog },
    // { href: '/professional/chat', label: 'Chats', icon: MessageSquare }, // Assuming professionals might chat too
    { href: `/professional/profile`, label: 'Profile & Settings', icon: Settings }, // Adjusted label slightly
];


export default function AppLayout({ children, userType }: AppLayoutProps) {
  const router = useRouter();
  const pathname = usePathname(); // Get current path
  const { toast } = useToast();

  // TODO: Replace with actual user/professional data from auth context
  const userData = {
    name: userType === 'user' ? 'Alice Student' : 'Dr. Bob Professional',
    initials: userType === 'user' ? 'AS' : 'BP',
    avatarUrl: `https://picsum.photos/seed/${userType}/40/40`
  };

  const handleLogout = () => {
    console.log('Logging out...');
    toast({
      title: "Logged Out",
      description: "You have been successfully logged out.",
    });
    // TODO: Add actual logout logic (clear session/token)
    router.push('/');
  };

  // Select menu items based on user type
  const menuItems = userType === 'user' ? getUserMenuItems() : getProfessionalMenuItems();

  return (
    <SidebarProvider>
      <Sidebar>
        <SidebarHeader>
           <div className="flex items-center gap-3 p-2">
            <Avatar>
               <AvatarImage src={userData.avatarUrl} alt={userData.name} />
               <AvatarFallback>{userData.initials}</AvatarFallback>
             </Avatar>
            <span className="font-semibold text-sidebar-foreground group-data-[collapsible=icon]:hidden">
               {userData.name}
             </span>
           </div>
        </SidebarHeader>
        <SidebarContent>
          <SidebarMenu>
             {menuItems.map((item) => {
                // Determine if the item is active
                const isActive = item.exact
                  ? pathname === item.href
                  : pathname.startsWith(item.href) && (item.href !== `/${userType}/dashboard` || pathname === `/${userType}/dashboard`); // Handle dashboard exact match within startsWith

                // Special handling for chat: make '/user/chat' active if on '/user/chat/*' but not '/user/chat/ai' if AI has its own link
                 let isChatItemActive = isActive;
                 if (item.href === '/user/chat' && userType === 'user') {
                     isChatItemActive = pathname.startsWith('/user/chat') && !pathname.startsWith('/user/chat/ai');
                 }
                 if (item.href === '/user/chat/ai' && userType === 'user') {
                     isChatItemActive = pathname === '/user/chat/ai';
                 }

               return (
                 <SidebarMenuItem key={item.href}>
                   <SidebarMenuButton
                     asChild
                     tooltip={item.label}
                     isActive={isChatItemActive} // Use the determined active state
                   >
                     <Link href={item.href}>
                       <item.icon />
                       <span>{item.label}</span>
                     </Link>
                   </SidebarMenuButton>
                 </SidebarMenuItem>
               );
             })}
          </SidebarMenu>
        </SidebarContent>
        <SidebarFooter>
           <SidebarMenu>
             <SidebarMenuItem>
               <SidebarMenuButton onClick={handleLogout} tooltip="Logout">
                  <LogOut />
                  <span>Logout</span>
               </SidebarMenuButton>
             </SidebarMenuItem>
           </SidebarMenu>
        </SidebarFooter>
      </Sidebar>
      <SidebarInset>
         <header className="sticky top-0 z-30 flex h-14 items-center gap-4 border-b bg-background px-4 sm:static sm:h-auto sm:border-0 sm:bg-transparent sm:px-6 sm:py-4">
           <SidebarTrigger className="sm:hidden"/>
           <div className="flex-1">
              {/* Optional: Dynamically display page title based on pathname */}
           </div>
            <SidebarTrigger className="hidden sm:flex" />
         </header>
         <main className="flex-1 overflow-auto p-4 sm:px-6 sm:py-0">
            {children}
         </main>
      </SidebarInset>
    </SidebarProvider>
  );
}
