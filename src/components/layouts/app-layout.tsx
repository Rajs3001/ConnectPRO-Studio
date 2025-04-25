"use client";

import Link from 'next/link';
import { useRouter } from 'next/navigation';
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
import { LogOut, User, Calendar, MessageSquare, Settings, LayoutDashboard, Search, UserCog } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import React from 'react';

interface AppLayoutProps {
  children: React.ReactNode;
  userType: 'user' | 'professional';
}

export default function AppLayout({ children, userType }: AppLayoutProps) {
  const router = useRouter();
  const { toast } = useToast();

  // TODO: Replace with actual user/professional data from auth context
  const userData = {
    name: userType === 'user' ? 'Alice Student' : 'Dr. Bob Professional',
    initials: userType === 'user' ? 'AS' : 'BP',
    avatarUrl: `https://picsum.photos/seed/${userType}/40/40`
  };

  const handleLogout = () => {
    // TODO: Implement actual logout logic
    console.log('Logging out...');
    toast({
      title: "Logged Out",
      description: "You have been successfully logged out.",
    });
    router.push('/'); // Redirect to homepage after logout
  };

  const commonMenuItems = [
    { href: `/${userType}/dashboard`, label: 'Dashboard', icon: LayoutDashboard },
    { href: `/${userType}/profile`, label: 'Profile Settings', icon: Settings },
  ];

  const userMenuItems = [
    ...commonMenuItems,
    { href: '/user/find-professional', label: 'Find Professionals', icon: Search },
    { href: '/user/appointments', label: 'My Appointments', icon: Calendar },
    { href: '/user/chat', label: 'Chats', icon: MessageSquare },
  ];

  const professionalMenuItems = [
    ...commonMenuItems,
    { href: '/professional/schedule', label: 'Manage Schedule', icon: Calendar },
    { href: '/professional/appointments', label: 'Appointments', icon: UserCog }, // Use a different icon maybe
    { href: '/professional/chat', label: 'Chats', icon: MessageSquare },
  ];

  const menuItems = userType === 'user' ? userMenuItems : professionalMenuItems;


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
            {menuItems.map((item) => (
              <SidebarMenuItem key={item.href}>
                <SidebarMenuButton asChild tooltip={item.label}>
                  <Link href={item.href}>
                    <item.icon />
                    <span>{item.label}</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            ))}
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
            {/* Mobile Trigger */}
           <SidebarTrigger className="sm:hidden"/>
           {/* Optional Header Content (e.g., Breadcrumbs, Page Title) */}
           <div className="flex-1">
              {/* <h1 className="text-xl font-semibold">Page Title</h1> */}
           </div>
           {/* Desktop Trigger */}
            <SidebarTrigger className="hidden sm:flex" />
         </header>
         <main className="flex-1 overflow-auto p-4 sm:px-6 sm:py-0">
            {children}
         </main>
      </SidebarInset>
    </SidebarProvider>
  );
}
