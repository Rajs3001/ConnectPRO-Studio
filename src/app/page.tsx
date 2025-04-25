import Link from 'next/link';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowRight, Bot, BrainCircuit, Briefcase, MessageSquare, ShieldCheck, Star, Users, Video } from 'lucide-react';
import UserReviews from '@/components/landing/user-reviews';
import CommunityPreview from '@/components/landing/community-preview';

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen bg-background text-foreground">
      {/* Header */}
      <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container mx-auto flex h-14 max-w-screen-2xl items-center justify-between px-4 md:px-6">
          <Link href="/" className="text-xl font-bold text-primary hover:opacity-90 transition-opacity">ConnectPro</Link>
          <nav className="space-x-2 md:space-x-4">
            <Button variant="ghost" size="sm" className="text-foreground hover:bg-muted" asChild>
              <Link href="/login/user">User Login</Link>
            </Button>
            <Button variant="outline" size="sm" className="border-primary text-primary hover:bg-primary/10" asChild>
              <Link href="/signup/professional">Join as Pro</Link>
            </Button>
          </nav>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-grow">
        {/* Hero Section */}
        <section className="relative py-24 md:py-32 lg:py-40 overflow-hidden">
          {/* Background Abstract Shapes (Subtle) */}
          <div className="absolute inset-0 -z-10 overflow-hidden">
             <div className="absolute top-0 left-0 w-96 h-96 bg-primary/10 rounded-full blur-3xl opacity-30"></div>
             <div className="absolute bottom-0 right-0 w-96 h-96 bg-accent/10 rounded-full blur-3xl opacity-30"></div>
          </div>

          <div className="container mx-auto px-4 md:px-6 text-center relative z-10">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold mb-6 text-primary">
              Elevate Your Journey. Connect with Experts.
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground mb-10 max-w-3xl mx-auto">
              Access verified professionals, intelligent AI guidance, and a supportive community. Bridge the gap between ambition and achievement with secure video calls and insightful chat support.
            </p>
            <div className="flex flex-col sm:flex-row justify-center items-center gap-4">
              <Button size="lg" className="bg-primary text-primary-foreground hover:bg-primary/90 shadow-lg hover:shadow-primary/40 transition-all duration-300" asChild>
                <Link href="/user/find-professional">Find Your Mentor <ArrowRight className="ml-2 h-5 w-5" /></Link>
              </Button>
               <Button size="lg" variant="outline" className="border-muted-foreground text-muted-foreground hover:border-foreground hover:text-foreground transition-colors" asChild>
                 <Link href="/community">Explore Community</Link>
               </Button>
            </div>
             {/* Optional: Placeholder image/graphic */}
             {/* <Image
               src="https://picsum.photos/seed/hero-graphic/800/400"
               alt="Abstract connection graphic"
               width={800}
               height={400}
               className="w-full max-w-3xl mx-auto mt-12 rounded-lg opacity-80 object-cover aspect-[2/1]"
               priority
             /> */}
          </div>
        </section>

        {/* Features Section */}
        <section className="py-16 md:py-24 bg-secondary/10"> {/* Slightly different background */}
          <div className="container mx-auto px-4 md:px-6">
            <h2 className="text-3xl md:text-4xl font-bold text-center mb-12 text-accent">Why ConnectPro?</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {/* Feature Card 1 */}
              <Card className="bg-card border border-border/60 overflow-hidden transform hover:scale-[1.03] transition-transform duration-300"> {/* Simpler hover */}
                 <CardHeader className="p-6">
                    <div className="p-3 bg-primary/20 rounded-full w-fit mb-4 border border-primary/50">
                        <Briefcase className="h-8 w-8 text-primary" />
                    </div>
                    <CardTitle className="text-xl font-semibold">Vetted Expert Network</CardTitle>
                 </CardHeader>
                 <CardContent className="p-6 pt-0">
                    <CardDescription>
                       Access a curated community of top-tier professionals across diverse fields. Our verification ensures quality connections for mentorship, advice, or collaboration. Find your perfect match easily.
                    </CardDescription>
                 </CardContent>
              </Card>
              {/* Feature Card 2 */}
              <Card className="bg-card border border-border/60 overflow-hidden transform hover:scale-[1.03] transition-transform duration-300">
                 <CardHeader className="p-6">
                     <div className="p-3 bg-accent/20 rounded-full w-fit mb-4 border border-accent/50">
                        <BrainCircuit className="h-8 w-8 text-accent" />
                     </div>
                    <CardTitle className="text-xl font-semibold">AI-Powered Guidance</CardTitle>
                 </CardHeader>
                 <CardContent className="p-6 pt-0">
                    <CardDescription>
                       Leverage our sophisticated AI Counselor. It understands your conversation context, analyzes needs, suggests relevant experts, and provides initial actionable insights—24/7.
                    </CardDescription>
                 </CardContent>
              </Card>
               {/* Feature Card 3 */}
              <Card className="bg-card border border-border/60 overflow-hidden transform hover:scale-[1.03] transition-transform duration-300">
                 <CardHeader className="p-6">
                    <div className="p-3 bg-blue-500/20 rounded-full w-fit mb-4 border border-blue-500/50">
                       <Video className="h-8 w-8 text-blue-400" />
                    </div>
                   <CardTitle className="text-xl font-semibold">Secure Video Sessions</CardTitle>
                 </CardHeader>
                 <CardContent className="p-6 pt-0">
                   <CardDescription>
                     Engage in seamless, high-quality video consultations directly on our platform. Enjoy end-to-end encryption for confidential and productive face-to-face interactions.
                   </CardDescription>
                 </CardContent>
              </Card>
               {/* Feature Card 4 */}
              <Card className="bg-card border border-border/60 overflow-hidden transform hover:scale-[1.03] transition-transform duration-300">
                 <CardHeader className="p-6">
                     <div className="p-3 bg-green-500/20 rounded-full w-fit mb-4 border border-green-500/50">
                         <Users className="h-8 w-8 text-green-400" />
                     </div>
                     <CardTitle className="text-xl font-semibold">Anonymous Community</CardTitle>
                 </CardHeader>
                 <CardContent className="p-6 pt-0">
                     <CardDescription>
                         Share experiences, ask questions, and connect with peers in a safe, anonymous space. Post text, images, code, and more without revealing your identity. Foster growth through shared knowledge.
                     </CardDescription>
                 </CardContent>
               </Card>
                {/* Feature Card 5 */}
               <Card className="bg-card border border-border/60 overflow-hidden transform hover:scale-[1.03] transition-transform duration-300">
                  <CardHeader className="p-6">
                       <div className="p-3 bg-yellow-500/20 rounded-full w-fit mb-4 border border-yellow-500/50">
                          <MessageSquare className="h-8 w-8 text-yellow-400" />
                       </div>
                     <CardTitle className="text-xl font-semibold">Contextual Chat</CardTitle>
                  </CardHeader>
                  <CardContent className="p-6 pt-0">
                     <CardDescription>
                       Our AI understands the entire conversation thread, providing relevant, human-like responses and recommendations. Supports multiple languages for natural interaction.
                     </CardDescription>
                  </CardContent>
               </Card>
                {/* Feature Card 6 */}
                <Card className="bg-card border border-border/60 overflow-hidden transform hover:scale-[1.03] transition-transform duration-300">
                   <CardHeader className="p-6">
                       <div className="p-3 bg-red-500/20 rounded-full w-fit mb-4 border border-red-500/50">
                         <ShieldCheck className="h-8 w-8 text-red-400" />
                       </div>
                      <CardTitle className="text-xl font-semibold">Privacy & Security</CardTitle>
                   </CardHeader>
                   <CardContent className="p-6 pt-0">
                      <CardDescription>
                         Your privacy is paramount. Benefit from secure data handling, encrypted communications, and an anonymous community option. Focus on growth with peace of mind.
                      </CardDescription>
                   </CardContent>
                </Card>
            </div>
          </div>
        </section>

         {/* User Reviews Section */}
         <UserReviews />

         {/* Community Preview Section */}
         <CommunityPreview />

        {/* Call to Action Section */}
        <section className="py-16 md:py-24 text-center relative overflow-hidden">
             {/* Background Glow */}
             <div className="absolute inset-x-0 bottom-0 h-64 -z-10 bg-primary/5 blur-3xl"></div>

            <div className="container mx-auto px-4 md:px-6 relative z-10">
                <h2 className="text-3xl md:text-4xl font-bold mb-4 text-primary">Ready to Connect & Grow?</h2>
                <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
                  Join ConnectPro today. Unlock expert guidance, leverage AI insights, and participate in a thriving, anonymous community.
                </p>
                <div className="space-y-4 sm:space-y-0 sm:space-x-4">
                  <Button size="lg" className="bg-primary text-primary-foreground hover:bg-primary/90 shadow-lg hover:shadow-primary/40 transition-all duration-300" asChild>
                    <Link href="/signup/user">Get Started as User</Link>
                  </Button>
                  <Button size="lg" variant="outline" className="border-primary text-primary hover:bg-primary/10" asChild>
                    <Link href="/signup/professional">Join as a Professional</Link>
                  </Button>
                </div>
            </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t border-border/40 bg-secondary/30 text-muted-foreground">
        <div className="container mx-auto px-4 md:px-6 py-8 text-center sm:text-left sm:flex sm:justify-between sm:items-center">
           <p className="text-sm">&copy; {new Date().getFullYear()} ConnectPro. All rights reserved.</p>
           <nav className="mt-4 sm:mt-0 space-x-4 text-sm">
              <Link href="/privacy" className="hover:text-foreground transition-colors">Privacy Policy</Link>
              <Link href="/terms" className="hover:text-foreground transition-colors">Terms of Service</Link>
              {/* Add other footer links */}
           </nav>
        </div>
      </footer>
    </div>
  );
}
