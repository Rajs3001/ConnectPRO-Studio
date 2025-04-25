import type {Metadata} from 'next';
import { Inter } from 'next/font/google' // Using Inter font like osmo.supply
import { Toaster } from "@/components/ui/toaster"
import './globals.css';

// Configure Inter font
const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter', // Optional: if you need to reference it via variable
});

export const metadata: Metadata = {
  title: 'ConnectPro - Expert Connections', // Updated title
  description: 'Connect with verified professionals, gain insights with AI, and engage with a supportive community.', // Updated description
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark"> {/* Ensure dark class is always present */}
      <body className={`${inter.className} antialiased bg-background text-foreground`}>
        {children}
        <Toaster />
      </body>
    </html>
  );
}
