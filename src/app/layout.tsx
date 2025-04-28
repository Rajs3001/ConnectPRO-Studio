

"use client"; // Required for hooks

import { Inter, Poppins } from 'next/font/google'; // Import Poppins
import { Toaster } from "@/components/ui/toaster"
import Preloader from '@/components/preloader/preloader'; // Import Preloader
import { useState, useEffect } from 'react'; // Import hooks for state management
import { AnimatePresence } from 'framer-motion'; // Import AnimatePresence
import { AuthProvider, useAuth } from '@/hooks/useAuth'; // Import AuthProvider and useAuth
import './globals.css';
import { useRouter, usePathname } from 'next/navigation'; // Import useRouter and usePathname
import ProtectedRoute from '@/components/auth/ProtectedRoute'; // Correct import path


// Configure Inter font (for body text)
const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
});

// Configure Poppins font (for headings, logo)
const poppins = Poppins({
  subsets: ['latin'],
  weight: ['400', '600', '700', '800'], // Include needed weights
  variable: '--font-poppins',
});

// Cannot export metadata from a Client Component
// Metadata should be defined in page.tsx or child server components if needed


// Wrapper component to handle conditional rendering based on auth state
// Simplified: Primarily handles loading state and initial client check. Route protection is delegated.
function AuthWrapper({ children }: { children: React.ReactNode }) {
  const { loading } = useAuth();
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
      setIsClient(true);
  }, []);


  if (loading || !isClient) {
    // While checking auth or on server, show nothing or a minimal loader
    // Preloader handles the initial site load, this handles auth checks
    return null; // Or a minimal loading indicator if needed after preloader
  }

  // Children rendering is now controlled by ProtectedRoute inside this wrapper
  return <>{children}</>;
}


export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // State to control preloader visibility
  const [isLoading, setIsLoading] = useState(true);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true); // Ensure this runs client-side
    // Simulate loading time and then hide the preloader
    const timer = setTimeout(() => {
      console.log("Preloader timeout finished, setting isLoading to false.");
      setIsLoading(false);
    }, 3500); // Adjust timing (e.g., 3500ms = 3.5s) to match animation

    return () => clearTimeout(timer); // Cleanup timer on unmount
  }, []);

  console.log("RootLayout Render:", { isClient, isLoading });


  return (
    <html lang="en" className="dark">
       <head>
         {/* Meta tags managed by Next.js metadata API in pages */}
         {/* Basic meta tags required in head */}
         <meta charSet="utf-8" />
         <meta name="viewport" content="width=device-width, initial-scale=1" />
         <title>ConnectPro - Expert Connections</title> {/* Default title */}
         <meta name="description" content="Connect with verified professionals, gain insights with AI, and engage with a supportive community." /> {/* Default description */}
         {/* Favicon links (optional) - ensure favicon.ico exists in /public */}
          <link rel="icon" href="/favicon.ico" type="image/x-icon" sizes="16x16" />{/* Use default favicon */}
      </head>
      {/* Apply both font variables. Default body font is Inter (sans). Poppins can be applied specifically where needed. */}
      <body className={`${inter.variable} ${poppins.variable} font-sans antialiased bg-background text-foreground`}>
         <AuthProvider> {/* Wrap children with AuthProvider */}
            <AnimatePresence mode="wait">
            {isClient && isLoading ? <Preloader key="preloader" /> : null}
            </AnimatePresence>
            {/* Render children only after loading is complete, wrapped in AuthWrapper */}
             {/* Wrap the main content potentially needing auth */}
            {isClient && !isLoading && (
               <AuthWrapper>
                    <ProtectedRoute> {/* Wrap children needing protection */}
                       <div data-testid="main-content-wrapper"> {/* Wrapper for easier inspection */}
                           {console.log("Rendering main children content within AuthWrapper/ProtectedRoute")}
                           {children}
                       </div>
                    </ProtectedRoute>
                </AuthWrapper>
            )}
             {/* Log if children are not rendered */}
             {(!isClient || isLoading) && console.log("Main children content NOT rendered yet.")}
            <Toaster />
         </AuthProvider>
      </body>
    </html>
  );
}

