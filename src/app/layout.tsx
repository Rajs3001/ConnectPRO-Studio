
"use client"; // Required for hooks if used, but simplified for now

import type {Metadata} from 'next'; // Keep Metadata type import
import { Inter, Poppins } from 'next/font/google'; // Import Poppins
import { Toaster } from "@/components/ui/toaster"
// import Preloader from '@/components/preloader/preloader'; // Removed Preloader
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
// Metadata should be defined in page.tsx or child server components

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // Removed isLoading and isClient state to simplify and avoid potential hydration issues
  // const [isLoading, setIsLoading] = useState(true);
  // const [isClient, setIsClient] = useState(false);

  // useEffect(() => {
  //   // Ensure this runs only client-side
  //   setIsClient(true);
  // }, []);

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
         {/* Removed static title/meta to avoid conflict with page-level metadata */}
      </head>
      {/* Apply both font variables. Default body font is Inter (sans). Poppins can be applied specifically where needed. */}
      <body className={`${inter.variable} ${poppins.variable} font-sans antialiased bg-background text-foreground`}>
         {/* Render children directly */}
         {children}
         <Toaster />
      </body>
    </html>
  );
}

