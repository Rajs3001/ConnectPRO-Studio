import type {Metadata} from 'next';
import { Inter, Poppins } from 'next/font/google' // Import Poppins
import { Toaster } from "@/components/ui/toaster"
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
    <html lang="en" className="dark">
      <body className={`${inter.variable} ${poppins.variable} font-sans antialiased bg-background text-foreground`}>
        {children}
        <Toaster />
      </body>
    </html>
  );
}
