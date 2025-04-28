
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
import { useAuth } from '@/hooks/useAuth'; // Import useAuth hook
import SiteLoader from '../shared/site-loader'; // Import SiteLoader

interface AppLayoutProps {
  children: React.ReactNode;
  userType: 'user' | 'professional';
}

interface MenuItem {
    href: string;
    label: string;
    icon: React.ElementType; // Use React.ElementType for component types
    exact?: boolean; // Optional: for exact path matching
    isCommunity?: boolean; // Flag for community link
}

// Define menu items for each user type
const getUserMenuItems = (communityProfileExists: boolean | null): MenuItem[] => [
    { href: `/user/dashboard`, label: 'Dashboard', icon: LayoutDashboard, exact: true },
    { href: '/user/find-professional', label: 'Find Professionals', icon: Search },
    { href: '/user/appointments', label: 'My Appointments', icon: Calendar },
    { href: '/user/chat/ai', label: 'AI Counselor', icon: Bot },
    { href: communityProfileExists ? '/community' : '/community/join', label: 'Community', icon: Users, isCommunity: true }, // Dynamic Community link
    { href: `/user/profile`, label: 'Profile Settings', icon: Settings },
];

const getProfessionalMenuItems = (communityProfileExists: boolean | null): MenuItem[] => [
    { href: `/professional/dashboard`, label: 'Dashboard', icon: LayoutDashboard, exact: true },
    { href: '/professional/schedule', label: 'Manage Schedule', icon: Calendar },
    { href: '/professional/appointments', label: 'Appointments', icon: UserCog },
    { href: communityProfileExists ? '/community' : '/community/join', label: 'Community', icon: Users, isCommunity: true }, // Dynamic Community link
    // { href: '/professional/chat', label: 'Chats', icon: MessageSquare }, // Keep commented if not implemented
    { href: `/professional/profile`, label: 'Profile \u0026 Settings', icon: Settings },
];


export default function AppLayout({ children, userType }: AppLayoutProps) {
  const router = useRouter();
  const pathname = usePathname(); // Get current path
  const { toast } = useToast();
  const [isClient, setIsClient] = useState(false); // Track client-side rendering
  const { user, loading: authLoading, logout, communityProfileExists } = useAuth(); // Use the auth hook

  useEffect(() => {
    setIsClient(true); // Set to true once component mounts
  }, []);

  // Simulating user data based on type and auth state
  const userData = React.useMemo(() => {
    if (authLoading || !user) {
      return { name: 'Loading...', initials: '...', avatarUrl: '' };
    }
    // TODO: Fetch more specific profile details (name, avatar) based on user.uid
    return {
      name: user.displayName || (userType === 'user' ? 'User' : 'Professional'),
      initials: user.displayName ? user.displayName.split(' ').map(n => n[0]).join('') : (userType === 'user' ? 'U' : 'P'),
      avatarUrl: user.photoURL || `https://api.dicebear.com/8.x/initials/svg?seed=${user.uid}` // Use initials avatar API
    };
  }, [userType, user, authLoading]);


  const handleLogout = async () => { // Make async
    console.log('Logging out...');
    try {
        await logout(); // Call logout from useAuth
        toast({
          title: "Logged Out",
          description: "You have been successfully logged out.",
        });
        router.push('/'); // Redirect after successful logout
    } catch (error) {
        console.error("Logout failed:", error);
        toast({
          title: "Logout Failed",
          description: "Could not log you out. Please try again.",
          variant: "destructive",
        });
    }
  };

  // Select menu items based on user type and community status
  const menuItems = userType === 'user'
    ? getUserMenuItems(communityProfileExists)
    : getProfessionalMenuItems(communityProfileExists);

  // Render a loader while auth is loading
  if (authLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-background">
        <SiteLoader size="lg" />
      </div>
    );
  }

  // If not loading and no user, maybe render null or redirect (handled by ProtectedRoute usually)
  if (!user) {
      console.warn("AppLayout rendered without authenticated user. ProtectedRoute should handle redirect.");
      // Return null or a minimal message, as ProtectedRoute will redirect.
      return null;
  }

  return (
    // Use SidebarProvider for context
    <SidebarProvider>
       {/* Sidebar definition - uses theme variables from globals.css */}
      <Sidebar className="border-r border-border/60 bg-card" data-testid="app-sidebar"> {/* Use card bg for sidebar */}
        <SidebarHeader data-testid="sidebar-header">
           <div className="flex items-center gap-3 p-4"> {/* Increased padding */}
            <Avatar className="h-9 w-9" data-testid="user-avatar"> {/* Slightly smaller avatar */}
               <AvatarImage src={userData.avatarUrl} alt={userData.name} />
               <AvatarFallback data-testid="user-avatar-fallback">{userData.initials}</AvatarFallback>
             </Avatar>
            <span className="font-semibold text-foreground group-data-[collapsible=icon]:hidden" data-testid="user-name-sidebar"> {/* Use foreground color */}
               {userData.name}
             </span>
           </div>
        </SidebarHeader>
        <SidebarContent data-testid="sidebar-content">
          <SidebarMenu>
             {menuItems.map((item) => {
                 // Determine active state based on path matching
                 // Handle community link specially: active if path *starts* with /community
                 const isActive = item.isCommunity
                   ? pathname.startsWith('/community')
                   : (item.exact ? pathname === item.href : pathname.startsWith(item.href));


               return (
                 <SidebarMenuItem key={item.href} data-testid={`sidebar-item-${item.label.toLowerCase().replace(/\s+/g, '-')}`}>
                   <SidebarMenuButton
                     asChild
                     tooltip={item.label}
                     isActive={isActive} // Use the active state
                     className={cn(
                       'hover:bg-muted/80', // Subtle hover
                       isActive && 'bg-primary/10 text-primary font-semibold' // Active state style
                     )}
                   >
                     <Link href={item.href}>
                       <item.icon className={cn(isActive && 'text-primary')} />
                       <span>{item.label}</span>
                     </Link>
                   </SidebarMenuButton>
                 </SidebarMenuItem>
               );
             })}
          </SidebarMenu>
        </SidebarContent>
        <SidebarFooter data-testid="sidebar-footer">
           <SidebarMenu>
             <SidebarMenuItem data-testid="sidebar-item-logout">
               <SidebarMenuButton onClick={handleLogout} tooltip="Logout" className="hover:bg-destructive/10 hover:text-destructive">
                  <LogOut />
                  <span>Logout</span>
               </SidebarMenuButton>
             </SidebarMenuItem>
           </SidebarMenu>
        </SidebarFooter>
      </Sidebar>

      {/* Main content area within SidebarInset */}
      <SidebarInset className="bg-background relative" data-testid="main-content-inset"> {/* Ensure main area uses background and is relative for absolute positioning */}
         {/* Subtle Logo Backdrop */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none -z-10 overflow-hidden" data-testid="logo-backdrop-container">
            <Logo className="w-[40vw] h-[40vw] md:w-[30vw] md:h-[30vw] lg:w-[25vw] lg:h-[25vw] opacity-5 text-primary/50 blur-[3px]" data-testid="logo-backdrop"/>
        </div>

         {/* Top header bar */}
         <header className="sticky top-0 z-30 flex h-14 items-center gap-4 border-b border-border/60 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 px-4 sm:px-6" data-testid="app-header">
           <SidebarTrigger className="sm:hidden text-foreground" data-testid="sidebar-trigger-mobile"/> {/* Trigger for mobile */}
           <div className="flex-1">
              {/* Optional: Breadcrumbs or Page Title */}
           </div>
            <SidebarTrigger className="hidden sm:flex text-foreground" data-testid="sidebar-trigger-desktop"/> {/* Trigger for desktop */}
         </header>
         {/* The actual page content */}
         <main className="flex-1 overflow-auto p-4 sm:p-6 lg:p-8" data-testid="main-content-area">
            {children}
         </main>
      </SidebarInset>
    </SidebarProvider>
  );
}
