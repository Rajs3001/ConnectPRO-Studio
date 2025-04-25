
"use client"; // Required for useState and useEffect

import type {Metadata} from 'next'; // Keep Metadata type import
import { Inter, Poppins } from 'next/font/google'; // Import Poppins
import { Toaster } from "@/components/ui/toaster"
import Preloader from '@/components/preloader/preloader'; // Import Preloader
import { useState, useEffect } from 'react';
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
// Move metadata to child Server Components (like page.tsx) or manage dynamically if needed.

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
   const [isLoading, setIsLoading] = useState(true);
   const [isClient, setIsClient] = useState(false);

   useEffect(() => {
     // Ensure this runs only client-side
     setIsClient(true);
   }, []);

  return (
    <html lang="en" className="dark"> {/* Ensure dark class is always present */}
      <head>
         {/* Title and meta tags can be added here or managed by Next.js metadata API in pages */}
         <title>ConnectPro - Expert Connections</title>
         <meta name="description" content="Connect with verified professionals, gain insights with AI, and engage with a supportive community." />
         {/* Add viewport meta tag for responsiveness */}
         <meta name="viewport" content="width=device-width, initial-scale=1" />
         {/* Favicon links (optional) */}
         {/* <link rel="icon" href="/favicon.ico" sizes="any" /> */}
      </head>
      {/* Apply both font variables. Default body font is Inter (sans). Poppins can be applied specifically where needed. */}
      <body className={`${inter.variable} ${poppins.variable} font-sans antialiased bg-background text-foreground`}>
         {isClient ? ( // Only render preloader/content logic on the client
           isLoading ? (
             <Preloader onComplete={() => setIsLoading(false)} />
           ) : (
             <>
               {children}
               <Toaster />
             </>
           )
         ) : (
           // Basic SSR fallback or placeholder (optional, could be empty)
           // This helps avoid hydration issues related to the loading state check
            <div className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-background overflow-hidden">
                {/* Minimal placeholder, maybe just the logo */}
            </div>
         )}
      </body>
    </html>
  );
}
