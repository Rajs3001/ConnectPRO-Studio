
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
    { href: '/user/chat/ai', label: 'AI Counselor', icon: Bot },
    { href: '/community', label: 'Community', icon: Users }, // Added Community link here
    { href: `/user/profile`, label: 'Profile Settings', icon: Settings },
];

const getProfessionalMenuItems = (): MenuItem[] => [
    { href: `/professional/dashboard`, label: 'Dashboard', icon: LayoutDashboard, exact: true },
    { href: '/professional/schedule', label: 'Manage Schedule', icon: Calendar },
    { href: '/professional/appointments', label: 'Appointments', icon: UserCog },
    { href: '/community', label: 'Community', icon: Users }, // Added Community link here
    // { href: '/professional/chat', label: 'Chats', icon: MessageSquare }, // Keep commented if not implemented
    { href: `/professional/profile`, label: 'Profile \u0026 Settings', icon: Settings },
];


export default function AppLayout({ children, userType }: AppLayoutProps) {
  const router = useRouter();
  const pathname = usePathname(); // Get current path
  const { toast } = useToast();
  const [isClient, setIsClient] = useState(false); // Track client-side rendering
  const { user, loading: authLoading } = useAuth(); // Use the auth hook

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
      avatarUrl: user.photoURL || `https://picsum.photos/seed/${user.uid}/40/40` // Use UID for seed
    };
  }, [userType, user, authLoading]);


  const handleLogout = () => {
    console.log('Logging out...');
    toast({
      title: "Logged Out",
      description: "You have been successfully logged out.",
    });
    // TODO: Implement actual Firebase logout logic via useAuth hook
    // Example: logout(); // Assuming logout function exists in useAuth
    router.push('/');
  };

  // Select menu items based on user type
  const menuItems = userType === 'user' ? getUserMenuItems() : getProfessionalMenuItems();

  // Render null on server or during auth loading to avoid hydration mismatch
  if (!isClient || authLoading) {
    // Optionally show a more sophisticated loading state instead of null
    return null; // Or <AppLoadingSkeleton />;
  }

  // If not loading and no user, redirect (though protected routes should handle this)
  if (!user) {
      // This might be redundant if route protection is handled elsewhere, but good as a fallback
      console.warn("AppLayout rendered without authenticated user. Redirecting.");
      // Avoid immediate redirect during initial render, let route protection handle it.
      // router.push('/login/user'); // Or appropriate login page
      return null; // Prevent rendering layout for non-authed users if protection is elsewhere
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
                   : pathname.startsWith(item.href); // Default to startsWith for non-exact


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
        <SidebarFooter>
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
      <SidebarInset className="bg-background relative"> {/* Ensure main area uses background and is relative for absolute positioning */}
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
