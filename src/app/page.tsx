import Link from 'next/link';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowRight, Bot, BrainCircuit, Briefcase, MessageSquare, ShieldCheck, Star, Users, Video, TrendingUp, GraduationCap, Lightbulb } from 'lucide-react';
import UserReviews from '@/components/landing/user-reviews';
import CommunityPreview from '@/components/landing/community-preview';
import ConnectionAnimation from '@/components/landing/connection-animation'; // Import the new animation component
import { cn } from '@/lib/utils'; // Import cn for conditional classes


// Simple, minimalistic logo using initials C and P
const Logo = () => (
    <svg width="32" height="32" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg" className="text-primary">
      <path d="M60,15 A35,35 0 0 0 60,85 A15,15 0 0 0 60,65 A15,15 0 0 1 60,35 A35,35 0 0 0 60,15 Z" fill="currentColor" />
      <path d="M40,15 A35,35 0 1 1 40,85 L40,65 A15,15 0 1 0 40,35 L40,15 Z" fill="currentColor" opacity="0.7"/>
    </svg>
);


// Animated background nodes component (Keep this as background enhancement)
const AnimatedBackground = () => {
    const nodeCount = 20; // Number of nodes
    const nodes = Array.from({ length: nodeCount }, (_, i) => {
        const size = Math.random() * 3 + 2; // size between 2px and 5px
        const delay = Math.random() * 5; // animation delay up to 5s
        const duration = Math.random() * 5 + 5; // animation duration between 5s and 10s
        const position = {
            top: `${Math.random() * 100}%`,
            left: `${Math.random() * 100}%`,
        };
        const animationName = Math.random() > 0.5 ? 'animate-float' : 'animate-pulse-subtle';
        const colorClass = Math.random() > 0.5 ? 'bg-primary/40' : 'bg-accent/40'; // Use theme colors with opacity

        return (
            <div
                key={i}
                className={cn(
                    'absolute rounded-full opacity-70',
                     animationName,
                     colorClass
                 )}
                style={{
                    width: `${size}px`,
                    height: `${size}px`,
                    top: position.top,
                    left: position.left,
                    animationDelay: `${delay}s`,
                    animationDuration: `${duration}s`,
                }}
            />
        );
    });

    return <>{nodes}</>;
};


export default function Home() {
  return (
    <div className="flex flex-col min-h-screen bg-background text-foreground">
      {/* Header */}
      <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container mx-auto flex h-14 max-w-screen-2xl items-center justify-between px-4 md:px-6">
           <Link href="/" className="flex items-center gap-2 text-xl font-bold text-primary hover:opacity-90 transition-opacity font-poppins">
                <Logo />
                <span>ConnectPro</span>
            </Link>
          <nav className="space-x-2 md:space-x-4">
            <Button variant="ghost" size="sm" className="text-foreground hover:bg-muted transition-colors font-sans" asChild>
              <Link href="/login/user">User Login</Link>
            </Button>
            <Button variant="outline" size="sm" className="border-primary text-primary hover:bg-primary/10 transition-colors font-sans" asChild>
              <Link href="/signup/professional">Join as Pro</Link>
            </Button>
          </nav>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-grow">
        {/* Hero Section */}
        <section className="relative py-24 md:py-32 lg:py-40 overflow-hidden animate-fade-in">
          {/* Background Animation & Subtle Shapes */}
          <div className="absolute inset-0 -z-10 overflow-hidden">
             {/* Subtle gradient shapes */}
             <div className="absolute top-0 left-0 w-96 h-96 bg-primary/5 rounded-full blur-3xl opacity-40 animate-[spin_20s_linear_infinite_reverse]"></div>
             <div className="absolute bottom-0 right-0 w-96 h-96 bg-accent/5 rounded-full blur-3xl opacity-40 animate-[spin_25s_linear_infinite]"></div>
             {/* Animated Nodes */}
              <div className="absolute inset-0">
                  <AnimatedBackground />
              </div>
          </div>

          <div className="container mx-auto px-4 md:px-6 text-center relative z-10">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold mb-6 text-primary animate-fade-in-up font-poppins" style={{ animationDelay: '0.2s' }}>
              Elevate Your Journey. Connect with Experts.
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground mb-10 max-w-3xl mx-auto animate-fade-in-up font-sans" style={{ animationDelay: '0.4s' }}>
              Access verified professionals for personalized guidance, leverage intelligent AI insights to navigate your path, and engage with a supportive, anonymous community. Bridge the gap between ambition and achievement with secure video calls and contextual chat support.
            </p>
            <div className="flex flex-col sm:flex-row justify-center items-center gap-4 animate-fade-in-up font-sans" style={{ animationDelay: '0.6s' }}>
              <Button size="lg" className="bg-primary text-primary-foreground hover:bg-primary/90 shadow-lg hover:shadow-primary/40 transition-all duration-300 transform hover:scale-105" asChild>
                <Link href="/user/find-professional">Find Your Mentor <ArrowRight className="ml-2 h-5 w-5" /></Link>
              </Button>
               <Button size="lg" variant="outline" className="border-muted-foreground text-muted-foreground hover:border-foreground hover:text-foreground hover:bg-muted/30 transition-all duration-300 transform hover:scale-105" asChild>
                 <Link href="/community">Explore Community</Link>
               </Button>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="py-16 md:py-24 bg-card/30 animate-fade-in-up" style={{ animationDelay: '0.3s' }}>
          <div className="container mx-auto px-4 md:px-6">
            <h2 className="text-3xl md:text-4xl font-bold text-center mb-12 text-accent font-poppins">Why ConnectPro?</h2>
             <p className="text-center text-lg text-muted-foreground mb-16 max-w-4xl mx-auto font-sans">
               ConnectPro is more than just a platform; it's your dedicated partner in professional growth. We offer a unique blend of human expertise and AI intelligence to empower your journey.
             </p>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {/* Feature Card 1 */}
              <Card className="bg-card border border-border/60 overflow-hidden transform transition-all duration-300 hover:scale-[1.03] hover:shadow-lg hover:shadow-primary/10 group animate-fade-in-up" style={{ animationDelay: '0.4s' }}>
                 <CardHeader className="p-6">
                    <div className="p-3 bg-primary/20 rounded-full w-fit mb-4 border border-primary/50 transform group-hover:scale-110 transition-transform duration-300">
                        <Briefcase className="h-8 w-8 text-primary" />
                    </div>
                    <CardTitle className="text-xl font-semibold font-poppins">Vetted Expert Network</CardTitle>
                 </CardHeader>
                 <CardContent className="p-6 pt-0">
                    <CardDescription className="font-sans">
                       Access a curated community of top-tier professionals across diverse fields. Our verification process ensures you connect with credible experts for mentorship, strategic advice, or skill development. Find your perfect match easily with advanced filters.
                    </CardDescription>
                 </CardContent>
              </Card>
              {/* Feature Card 2 */}
              <Card className="bg-card border border-border/60 overflow-hidden transform transition-all duration-300 hover:scale-[1.03] hover:shadow-lg hover:shadow-accent/10 group animate-fade-in-up" style={{ animationDelay: '0.5s' }}>
                 <CardHeader className="p-6">
                     <div className="p-3 bg-accent/20 rounded-full w-fit mb-4 border border-accent/50 transform group-hover:scale-110 transition-transform duration-300">
                        <BrainCircuit className="h-8 w-8 text-accent" />
                     </div>
                    <CardTitle className="text-xl font-semibold font-poppins">AI-Powered Guidance</CardTitle>
                 </CardHeader>
                 <CardContent className="p-6 pt-0">
                    <CardDescription className="font-sans">
                       Leverage our sophisticated AI Counselor, trained to understand nuanced career questions and challenges. It analyzes your conversation context, provides initial actionable insights, suggests relevant experts, and helps refine your queries—available 24/7.
                    </CardDescription>
                 </CardContent>
              </Card>
               {/* Feature Card 3 */}
              <Card className="bg-card border border-border/60 overflow-hidden transform transition-all duration-300 hover:scale-[1.03] hover:shadow-lg hover:shadow-blue-500/10 group animate-fade-in-up" style={{ animationDelay: '0.6s' }}>
                 <CardHeader className="p-6">
                    <div className="p-3 bg-blue-500/20 rounded-full w-fit mb-4 border border-blue-500/50 transform group-hover:scale-110 transition-transform duration-300">
                       <Video className="h-8 w-8 text-blue-400" />
                    </div>
                   <CardTitle className="text-xl font-semibold font-poppins">Seamless Video Sessions</CardTitle>
                 </CardHeader>
                 <CardContent className="p-6 pt-0">
                   <CardDescription className="font-sans">
                     Engage in high-quality, secure video consultations directly within the platform. Our integrated scheduling system considers professional availability, making booking effortless. Enjoy end-to-end encryption for confidential and productive interactions.
                   </CardDescription>
                 </CardContent>
              </Card>
               {/* Feature Card 4 */}
              <Card className="bg-card border border-border/60 overflow-hidden transform transition-all duration-300 hover:scale-[1.03] hover:shadow-lg hover:shadow-green-500/10 group animate-fade-in-up" style={{ animationDelay: '0.7s' }}>
                 <CardHeader className="p-6">
                     <div className="p-3 bg-green-500/20 rounded-full w-fit mb-4 border border-green-500/50 transform group-hover:scale-110 transition-transform duration-300">
                         <Users className="h-8 w-8 text-green-400" />
                     </div>
                     <CardTitle className="text-xl font-semibold font-poppins">Supportive Community</CardTitle>
                 </CardHeader>
                 <CardContent className="p-6 pt-0">
                     <CardDescription className="font-sans">
                         Share experiences, ask questions, and connect with peers in a safe, anonymous space. Post text, images, code snippets, and links without revealing your identity. Foster growth through shared knowledge and collective problem-solving.
                     </CardDescription>
                 </CardContent>
               </Card>
                {/* Feature Card 5 */}
               <Card className="bg-card border border-border/60 overflow-hidden transform transition-all duration-300 hover:scale-[1.03] hover:shadow-lg hover:shadow-yellow-500/10 group animate-fade-in-up" style={{ animationDelay: '0.8s' }}>
                  <CardHeader className="p-6">
                       <div className="p-3 bg-yellow-500/20 rounded-full w-fit mb-4 border border-yellow-500/50 transform group-hover:scale-110 transition-transform duration-300">
                          <MessageSquare className="h-8 w-8 text-yellow-400" />
                       </div>
                     <CardTitle className="text-xl font-semibold font-poppins">Contextual AI Chat</CardTitle>
                  </CardHeader>
                  <CardContent className="p-6 pt-0">
                     <CardDescription className="font-sans">
                       Unlike basic chatbots, our AI Counselor maintains conversation context, providing relevant, human-like responses and recommendations. It supports multiple languages, ensuring natural and effective interaction for a global user base.
                     </CardDescription>
                  </CardContent>
               </Card>
                {/* Feature Card 6 */}
                <Card className="bg-card border border-border/60 overflow-hidden transform transition-all duration-300 hover:scale-[1.03] hover:shadow-lg hover:shadow-red-500/10 group animate-fade-in-up" style={{ animationDelay: '0.9s' }}>
                   <CardHeader className="p-6">
                       <div className="p-3 bg-red-500/20 rounded-full w-fit mb-4 border border-red-500/50 transform group-hover:scale-110 transition-transform duration-300">
                         <ShieldCheck className="h-8 w-8 text-red-400" />
                       </div>
                      <CardTitle className="text-xl font-semibold font-poppins">Privacy & Security First</CardTitle>
                   </CardHeader>
                   <CardContent className="p-6 pt-0">
                      <CardDescription className="font-sans">
                         Your privacy is paramount. ConnectPro employs robust security measures, including secure data handling, encrypted communications (video and chat), and an optional anonymous community space. Focus on your growth with complete peace of mind.
                      </CardDescription>
                   </CardContent>
                </Card>
            </div>
          </div>
        </section>

        {/* How It Works Section */}
        <section className="py-16 md:py-24 relative overflow-hidden">
            <div className="container mx-auto px-4 md:px-6">
                <h2 className="text-3xl md:text-4xl font-bold text-center mb-12 text-primary font-poppins">How ConnectPro Works</h2>
                <p className="text-center text-lg text-muted-foreground mb-16 max-w-4xl mx-auto font-sans">
                    A simple, streamlined process to connect students with experienced professionals and accelerate their career growth.
                </p>
                <ConnectionAnimation />
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-16 text-center">
                    <div className="animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
                        <div className="p-4 bg-accent/20 rounded-full w-fit mx-auto mb-4 border border-accent/50">
                            <GraduationCap className="h-8 w-8 text-accent" />
                        </div>
                        <h3 className="text-xl font-semibold mb-2 font-poppins">1. Explore & Connect</h3>
                        <p className="text-muted-foreground font-sans">Students browse profiles, filter by expertise, and initiate connections via chat or schedule video calls.</p>
                    </div>
                     <div className="animate-fade-in-up" style={{ animationDelay: '0.4s' }}>
                         <div className="p-4 bg-primary/20 rounded-full w-fit mx-auto mb-4 border border-primary/50">
                            <Lightbulb className="h-8 w-8 text-primary" />
                        </div>
                        <h3 className="text-xl font-semibold mb-2 font-poppins">2. Gain Insights</h3>
                        <p className="text-muted-foreground font-sans">Engage with professionals for personalized advice, mentorship, or use the AI Counselor for instant guidance and suggestions.</p>
                    </div>
                     <div className="animate-fade-in-up" style={{ animationDelay: '0.6s' }}>
                         <div className="p-4 bg-green-500/20 rounded-full w-fit mx-auto mb-4 border border-green-500/50">
                            <TrendingUp className="h-8 w-8 text-green-500" />
                        </div>
                        <h3 className="text-xl font-semibold mb-2 font-poppins">3. Accelerate Growth</h3>
                        <p className="text-muted-foreground font-sans">Apply learned strategies, leverage community support, and build a network to confidently advance your career path.</p>
                    </div>
                </div>
            </div>
        </section>


         {/* User Reviews Section */}
         <UserReviews />

         {/* Community Preview Section */}
         <CommunityPreview />

        {/* Call to Action Section */}
        <section className="py-16 md:py-24 text-center relative overflow-hidden animate-fade-in-up" style={{ animationDelay: '0.4s' }}>
             {/* Background Glow */}
             <div className="absolute inset-x-0 bottom-0 h-64 -z-10 bg-primary/5 blur-3xl"></div>

            <div className="container mx-auto px-4 md:px-6 relative z-10">
                <h2 className="text-3xl md:text-4xl font-bold mb-4 text-primary font-poppins">Ready to Connect & Grow?</h2>
                <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto font-sans">
                  Join ConnectPro today. Unlock personalized expert guidance, leverage cutting-edge AI insights for clearer direction, and participate in a thriving, anonymous community dedicated to mutual support and advancement.
                </p>
                <div className="space-y-4 sm:space-y-0 sm:space-x-4 font-sans">
                  <Button size="lg" className="bg-primary text-primary-foreground hover:bg-primary/90 shadow-lg hover:shadow-primary/40 transition-all duration-300 transform hover:scale-105" asChild>
                    <Link href="/signup/user">Get Started as User</Link>
                  </Button>
                  <Button size="lg" variant="outline" className="border-primary text-primary hover:bg-primary/10 transition-colors transform hover:scale-105" asChild>
                    <Link href="/signup/professional">Join as a Professional</Link>
                  </Button>
                </div>
            </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t border-border/40 bg-card/30 text-muted-foreground">
        <div className="container mx-auto px-4 md:px-6 py-8 text-center sm:text-left sm:flex sm:justify-between sm:items-center">
           <div className="flex items-center justify-center sm:justify-start gap-2 mb-4 sm:mb-0">
             <Logo />
             <p className="text-sm font-sans">&copy; {new Date().getFullYear()} ConnectPro. All rights reserved.</p>
           </div>
           <nav className="mt-4 sm:mt-0 space-x-4 text-sm font-sans">
              <Link href="/privacy" className="hover:text-foreground transition-colors hover:underline">Privacy Policy</Link>
              <Link href="/terms" className="hover:text-foreground transition-colors hover:underline">Terms of Service</Link>
              <Link href="/contact" className="hover:text-foreground transition-colors hover:underline">Contact Us</Link>
           </nav>
        </div>
      </footer>
    </div>
  );
}
