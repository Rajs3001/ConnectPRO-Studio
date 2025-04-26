
"use client"; // Required for hooks

import type {Metadata} from 'next'; // Keep Metadata type import
import { Inter, Poppins } from 'next/font/google'; // Import Poppins
import { Toaster } from "@/components/ui/toaster"
import Preloader from '@/components/preloader/preloader'; // Import Preloader
import { useState, useEffect } from 'react'; // Import hooks for state management
import { AnimatePresence } from 'framer-motion'; // Import AnimatePresence
import './globals.css';

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
      setIsLoading(false);
    }, 3500); // Adjust timing (e.g., 3500ms = 3.5s) to match animation

    return () => clearTimeout(timer); // Cleanup timer on unmount
  }, []);


  return (
    <html lang="en" className="dark"> {/* Ensure dark class is always present */}
       <head>
         {/* Meta tags managed by Next.js metadata API in pages */}
         {/* Basic meta tags required in head */}
         <meta charSet="utf-8" />
         <meta name="viewport" content="width=device-width, initial-scale=1" />
         <title>ConnectPro - Expert Connections</title> {/* Default title */}
         <meta name="description" content="Connect with verified professionals, gain insights with AI, and engage with a supportive community." /> {/* Default description */}
         {/* Favicon links (optional) - ensure favicon.ico exists in /public */}
         {/* <link rel="icon" href="/favicon.ico" sizes="any" /> */}
      </head>
      {/* Apply both font variables. Default body font is Inter (sans). Poppins can be applied specifically where needed. */}
      <body className={`${inter.variable} ${poppins.variable} font-sans antialiased bg-background text-foreground`}>
         <AnimatePresence mode="wait">
           {isClient && isLoading ? <Preloader key="preloader" /> : null}
         </AnimatePresence>
         {/* Render children only after loading is complete */}
         {isClient && !isLoading && children}
         <Toaster />
      </body>
    </html>
  );
}
