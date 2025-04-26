
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
import { LogOut, User, Calendar, MessageSquare, Settings, LayoutDashboard, Search, UserCog, Bot, Users, CodeXml } from 'lucide-react'; // Added Bot, Users icons
import { useToast } from '@/hooks/use-toast';
import React, { useEffect, useState } from 'react'; // Import useEffect and useState
import { cn } from '@/lib/utils'; // Import cn
import Logo from '@/components/shared/logo'; // Import the shared Logo component

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
    { href: '/user/chat/ai', label: 'AI Counselor', icon: Bot },
    // { href: '/community', label: 'Community', icon: Users }, // Removed Community Link
    { href: `/user/profile`, label: 'Profile Settings', icon: Settings },
];

const getProfessionalMenuItems = (): MenuItem[] => [
    { href: `/professional/dashboard`, label: 'Dashboard', icon: LayoutDashboard, exact: true },
    { href: '/professional/schedule', label: 'Manage Schedule', icon: Calendar },
    { href: '/professional/appointments', label: 'Appointments', icon: UserCog },
    // { href: '/community', label: 'Community', icon: Users }, // Removed Community Link
    // { href: '/professional/chat', label: 'Chats', icon: MessageSquare }, // Keep commented if not implemented
    { href: `/professional/profile`, label: 'Profile & Settings', icon: Settings },
];


export default function AppLayout({ children, userType }: AppLayoutProps) {
  const router = useRouter();
  const pathname = usePathname(); // Get current path
  const { toast } = useToast();
  const [isClient, setIsClient] = useState(false); // Track client-side rendering

  useEffect(() => {
    setIsClient(true); // Set to true once component mounts
  }, []);


  // TODO: Replace with actual user/professional data from auth context
  // Simulating user data based on type
  const userData = React.useMemo(() => ({
    name: userType === 'user' ? 'Alice Student' : 'Dr. Bob Professional',
    initials: userType === 'user' ? 'AS' : 'DB', // Initials for fallback
    avatarUrl: `https://picsum.photos/seed/${userType === 'user' ? 'user' : 'pro'}/40/40` // Different seeds
  }), [userType]);


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

  // Render null on server to avoid hydration mismatch for user data
  if (!isClient) {
    return null;
  }

  return (
    // Use SidebarProvider for context
    <SidebarProvider>
       {/* Sidebar definition - uses theme variables from globals.css */}
      <Sidebar className="border-r border-border/60 bg-card"> {/* Use card bg for sidebar */}
        <SidebarHeader>
           <div className="flex items-center gap-3 p-4"> {/* Increased padding */}
            <Avatar className="h-9 w-9"> {/* Slightly smaller avatar */}
               <AvatarImage src={userData.avatarUrl} alt={userData.name} />
               <AvatarFallback>{userData.initials}</AvatarFallback>
             </Avatar>
            <span className="font-semibold text-foreground group-data-[collapsible=icon]:hidden"> {/* Use foreground color */}
               {userData.name}
             </span>
           </div>
        </SidebarHeader>
        <SidebarContent>
          <SidebarMenu>
             {menuItems.map((item) => {
                 // Determine active state based on path matching
                 const isActive = item.exact
                   ? pathname === item.href
                   : pathname.startsWith(item.href) && (item.href !== `/${userType}/dashboard` || pathname === `/${userType}/dashboard`) && item.href !== '/user/chat'; // Ensure dashboard matches exactly, avoid matching base chat url if sub-chats exist

                 // Special handling for chat parent and AI chat item
                  let finalIsActive = isActive;
                  if (userType === 'user') {
                     if (item.href === '/user/chat' && pathname.startsWith('/user/chat/') && !pathname.startsWith('/user/chat/ai')) {
                         finalIsActive = true; // Activate base 'Chats' if in a specific user/pro chat
                     } else if (item.href === '/user/chat/ai' && pathname === '/user/chat/ai') {
                          finalIsActive = true; // Activate 'AI Counselor' specifically
                     } else if (item.href === '/user/chat' && pathname === '/user/chat/ai') {
                         finalIsActive = false; // Deactivate base 'Chats' if on AI chat page
                     }
                  }


               return (
                 <SidebarMenuItem key={item.href}>
                   <SidebarMenuButton
                     asChild
                     tooltip={item.label}
                     isActive={finalIsActive} // Use the refined active state
                     className={cn(
                       'hover:bg-muted/80', // Subtle hover
                       finalIsActive && 'bg-primary/10 text-primary font-semibold' // Active state style
                     )}
                   >
                     <Link href={item.href}>
                       <item.icon className={cn(finalIsActive && 'text-primary')} />
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
               <SidebarMenuButton onClick={handleLogout} tooltip="Logout" className="hover:bg-destructive/10 hover:text-destructive">
                  <LogOut />
                  <span>Logout</span>
               </SidebarMenuButton>
             </SidebarMenuItem>
           </SidebarMenu>
        </SidebarFooter>
      </Sidebar>

      {/* Main content area within SidebarInset */}
      <SidebarInset className="bg-background relative"> {/* Ensure main area uses background and is relative for absolute positioning */}
         {/* Subtle Logo Backdrop */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none -z-10 overflow-hidden">
            <Logo className="w-[40vw] h-[40vw] md:w-[30vw] md:h-[30vw] lg:w-[25vw] lg:h-[25vw] opacity-5 text-primary/50 blur-[3px]" />
        </div>

         {/* Top header bar */}
         <header className="sticky top-0 z-30 flex h-14 items-center gap-4 border-b border-border/60 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 px-4 sm:px-6">
           <SidebarTrigger className="sm:hidden text-foreground"/> {/* Trigger for mobile */}
           <div className="flex-1">
              {/* Optional: Breadcrumbs or Page Title */}
           </div>
            <SidebarTrigger className="hidden sm:flex text-foreground" /> {/* Trigger for desktop */}
         </header>
         {/* The actual page content */}
         <main className="flex-1 overflow-auto p-4 sm:p-6 lg:p-8">
            {children}
         </main>
      </SidebarInset>
    </SidebarProvider>
  );
}
