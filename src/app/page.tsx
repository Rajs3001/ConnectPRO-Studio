
"use client"; // Add "use client" if not already present, needed for useEffect/useState

import Link from 'next/link';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowRight, Bot, BrainCircuit, Briefcase, MessageSquare, ShieldCheck, Star, Users, Video, TrendingUp, GraduationCap, Lightbulb, Search, Filter, UserCheck, CodeXml } from 'lucide-react';
import UserReviews from '@/components/landing/user-reviews';
import CommunityPreview from '@/components/landing/community-preview';
import ConnectionAnimation from '@/components/landing/connection-animation';
import { cn } from '@/lib/utils';
import Logo from '@/components/shared/logo'; // Import the shared Logo component
import React from 'react'; // Keep React import
import MatrixBackground from '@/components/landing/matrix-background'; // Keep for reference, but commented out below
import FeedbackModal from '@/components/landing/FeedbackModal'; // Import the new modal
import ConnectingDotsBackground from '@/components/landing/connecting-dots-background'; // Import the new background animation


export default function Home() {

  return (
    <div className="flex flex-col min-h-screen bg-background text-foreground relative isolate overflow-hidden" data-testid="landing-page-container">
       {/* Background Animations - Positioned to cover viewport */}
       {/* <MatrixBackground className="opacity-10 fixed inset-0 -z-20" data-testid="matrix-background"/>  */}
       <ConnectingDotsBackground className="fixed inset-0 -z-20" data-testid="connecting-dots-background"/> {/* Covers full viewport */}


      {/* Header */}
      <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60" data-testid="header">
        <div className="container mx-auto flex h-14 max-w-screen-2xl items-center justify-between px-4 md:px-6">
           <Link href="/" className="flex items-center gap-2 text-xl font-bold text-primary hover:opacity-90 transition-opacity font-poppins" data-testid="header-logo-link">
                <Logo className="h-8 w-8" data-testid="header-logo" /> {/* Adjusted size */}
                <span className="text-glow-primary" data-testid="header-title">ConnectPro</span>
            </Link>
          <nav className="space-x-2 md:space-x-4" data-testid="header-nav">
            <Button variant="ghost" size="sm" className="text-foreground hover:bg-muted transition-colors font-sans" asChild data-testid="user-login-button">
              <Link href="/login/user">User Login</Link>
            </Button>
            <Button variant="outline" size="sm" className="border-primary text-primary hover:bg-primary/10 transition-colors font-sans shadow-glow-primary hover:shadow-none" asChild data-testid="join-pro-button">
              <Link href="/signup/professional">Join as Pro</Link>
            </Button>
          </nav>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-grow relative z-10" data-testid="main-content"> {/* Ensure main content is above background */}
        {/* Hero Section */}
        <section className="relative py-24 md:py-32 lg:py-40 overflow-hidden animate-fade-in" data-testid="hero-section">
          {/* Background Shapes & Logo Backdrop (Removed Connecting Dots from here) */}
          <div className="absolute inset-0 -z-10 overflow-hidden">
             {/* Subtle gradient shapes */}
             <div className="absolute top-0 left-0 w-96 h-96 bg-primary/5 rounded-full blur-3xl opacity-40 animate-[spin_20s_linear_infinite_reverse]"></div>
             <div className="absolute bottom-0 right-0 w-96 h-96 bg-accent/5 rounded-full blur-3xl opacity-40 animate-[spin_25s_linear_infinite]"></div>
             {/* Large Logo Backdrop */}
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none -z-20">
                 <Logo className="w-[300px] h-[300px] md:w-[400px] md:h-[400px] opacity-5 text-primary/50 blur-[2px]" data-testid="hero-logo-backdrop"/> {/* Large, transparent, blurred logo */}
             </div>
          </div>

          <div className="container mx-auto px-4 md:px-6 text-center relative z-10">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold mb-6 text-primary animate-fade-in-up font-poppins text-glow-primary" style={{ animationDelay: '0.2s' }} data-testid="hero-title">
              Elevate Your Journey. Connect with Experts.
            </h1>
            <p className="text-lg md:text-xl text-foreground/90 mb-10 max-w-3xl mx-auto animate-fade-in-up font-sans" style={{ animationDelay: '0.4s' }} data-testid="hero-description"> {/* Changed text color to foreground/90 */}
              Access verified professionals for personalized guidance, leverage intelligent AI insights to navigate your path, and engage with a supportive, anonymous community. Bridge the gap between ambition and achievement with secure video calls and contextual chat support.
            </p>
            <div className="flex flex-col sm:flex-row justify-center items-center gap-4 animate-fade-in-up font-sans" style={{ animationDelay: '0.6s' }} data-testid="hero-cta-buttons">
              <Button size="lg" className="bg-primary text-primary-foreground hover:bg-primary/90 shadow-glow-primary hover:shadow-none transition-all duration-300 transform hover:scale-105" asChild data-testid="find-mentor-button">
                 <Link href="/user/find-professional" className="flex items-center justify-center">
                    Find Your Mentor <ArrowRight className="ml-2 h-5 w-5" />
                 </Link>
              </Button>
               <Button size="lg" variant="outline" className="border-muted-foreground text-muted-foreground hover:border-foreground hover:text-foreground hover:bg-muted/30 transition-all duration-300 transform hover:scale-105" asChild data-testid="explore-community-button">
                 <Link href="/community">Explore Community</Link>
               </Button>
            </div>
          </div>
        </section>

        {/* How It Works Section */}
        {/* Removed bg-background/50 backdrop-blur-sm */}
        <section className="py-16 md:py-24 relative overflow-hidden animate-fade-in-up scroll-mt-20" id="how-it-works" data-testid="how-it-works-section" style={{ animationDelay: '0.3s' }}>
            <div className="container mx-auto px-4 md:px-6 relative z-10"> {/* Added relative positioning */}
                <h2 className="text-3xl md:text-4xl font-bold text-center mb-12 text-primary text-glow-primary font-poppins" data-testid="how-it-works-title">How ConnectPro Works</h2>
                <p className="text-center text-lg text-foreground/80 mb-16 max-w-4xl mx-auto font-sans" data-testid="how-it-works-description"> {/* Adjusted text color */}
                   A simple, streamlined process to connect students and users with experienced professionals, fostering growth and providing clear guidance. Click on the icons to learn more about each step.
                </p>
                <div className="mb-16 md:mb-20" data-testid="connection-animation-container">
                    <ConnectionAnimation />
                </div>

                {/* Detailed Step Descriptions */}
                 <div className="mt-20 space-y-12" data-testid="how-it-works-steps">
                    {/* Step 1: Student */}
                     {/* Adjusted background/border for semi-transparency */}
                     <div id="step-student" className="scroll-mt-20 md:scroll-mt-24 p-6 rounded-lg transition-all duration-300 hover:shadow-glow-primary animate-fade-in-up border border-transparent hover:border-blue-500/30 hover:bg-blue-950/20" style={{ animationDelay: '0.2s' }} data-testid="step-student">
                        <div className="flex items-center gap-4 mb-3">
                            <div className="p-3 bg-blue-500/10 rounded-full border border-blue-500/30">
                                <GraduationCap className="h-8 w-8 text-blue-400" data-testid="step-student-icon" />
                            </div>
                             <h3 className="text-2xl font-semibold text-blue-300 font-poppins" data-testid="step-student-title">Step 1: The User Journey Begins</h3>
                        </div>
                        <p className="text-muted-foreground font-sans ml-1 pl-14 border-l-2 border-blue-500/50" data-testid="step-student-description">
                           Whether you're a student seeking career advice, someone facing a specific challenge, or simply looking for guidance, your journey starts here. Define your goals or questions to make the most of ConnectPro.
                         </p>
                    </div>

                    {/* Step 2: Find & Filter */}
                    {/* Adjusted background/border for semi-transparency */}
                    <div id="step-find" className="scroll-mt-20 md:scroll-mt-24 p-6 rounded-lg transition-all duration-300 hover:shadow-glow-primary animate-fade-in-up border border-transparent hover:border-purple-500/30 hover:bg-purple-950/20" style={{ animationDelay: '0.3s' }} data-testid="step-find">
                        <div className="flex items-center gap-4 mb-3">
                             <div className="p-3 bg-purple-500/10 rounded-full border border-purple-500/30">
                                <Search className="h-8 w-8 text-purple-400" data-testid="step-find-search-icon" />
                             </div>
                             <div className="p-3 bg-orange-500/10 rounded-full border border-orange-500/30 -ml-2">
                               <Filter className="h-8 w-8 text-orange-400" data-testid="step-find-filter-icon" />
                             </div>
                             <h3 className="text-2xl font-semibold text-purple-300 font-poppins" data-testid="step-find-title">Step 2: Discover the Right Expertise</h3>
                        </div>
                         <p className="text-muted-foreground font-sans ml-1 pl-14 border-l-2 border-purple-500/50" data-testid="step-find-description">
                           Utilize our powerful search and filtering tools. Look for professionals based on their field (like Software Engineering, Marketing, etc.), specific skills (e.g., Python, SEO, Leadership), or keywords related to your needs. Narrow down the options to find the perfect match for your query.
                         </p>
                    </div>

                     {/* Step 3: Connect */}
                     {/* Adjusted background/border for semi-transparency */}
                    <div id="step-connect" className="scroll-mt-20 md:scroll-mt-24 p-6 rounded-lg transition-all duration-300 hover:shadow-glow-primary animate-fade-in-up border border-transparent hover:border-yellow-500/30 hover:bg-yellow-950/20" style={{ animationDelay: '0.4s' }} data-testid="step-connect">
                        <div className="flex items-center gap-4 mb-3">
                             <div className="p-3 bg-yellow-500/10 rounded-full border border-yellow-500/30">
                               <MessageSquare className="h-8 w-8 text-yellow-400" data-testid="step-connect-chat-icon" />
                             </div>
                             <div className="p-3 bg-red-500/10 rounded-full border border-red-500/30 -ml-2">
                                <Video className="h-8 w-8 text-red-400" data-testid="step-connect-video-icon" />
                             </div>
                             <h3 className="text-2xl font-semibold text-yellow-300 font-poppins" data-testid="step-connect-title">Step 3: Initiate Contact</h3>
                         </div>
                         <p className="text-muted-foreground font-sans ml-1 pl-14 border-l-2 border-yellow-500/50" data-testid="step-connect-description">
                           Once you've found a potential professional, you have options. Start a conversation via our secure chat to ask initial questions or clarify needs. Alternatively, check their availability and directly schedule a one-on-one video call through our integrated system for a more in-depth discussion.
                         </p>
                     </div>

                     {/* Step 4: Professional Interaction */}
                     {/* Adjusted background/border for semi-transparency */}
                    <div id="step-professional" className="scroll-mt-20 md:scroll-mt-24 p-6 rounded-lg transition-all duration-300 hover:shadow-glow-primary animate-fade-in-up border border-transparent hover:border-indigo-500/30 hover:bg-indigo-950/20" style={{ animationDelay: '0.5s' }} data-testid="step-professional">
                         <div className="flex items-center gap-4 mb-3">
                             <div className="p-3 bg-indigo-500/10 rounded-full border border-indigo-500/30">
                                <UserCheck className="h-8 w-8 text-indigo-400" data-testid="step-professional-icon" />
                             </div>
                             <h3 className="text-2xl font-semibold text-indigo-300 font-poppins" data-testid="step-professional-title">Step 4: Engage & Learn</h3>
                         </div>
                         <p className="text-muted-foreground font-sans ml-1 pl-14 border-l-2 border-indigo-500/50" data-testid="step-professional-description">
                           Engage with the verified professional through chat or video. Get personalized advice, mentorship, and answers to your specific questions. Our AI Counselor can also assist during chats, providing context-aware suggestions and helping formulate questions.
                         </p>
                     </div>

                     {/* Step 5: Growth */}
                     {/* Adjusted background/border for semi-transparency */}
                     <div id="step-growth" className="scroll-mt-20 md:scroll-mt-24 p-6 rounded-lg transition-all duration-300 hover:shadow-glow-accent animate-fade-in-up border border-transparent hover:border-green-500/30 hover:bg-green-950/20" style={{ animationDelay: '0.6s' }} data-testid="step-growth">
                         <div className="flex items-center gap-4 mb-3">
                             <div className="p-3 bg-green-500/10 rounded-full border border-green-500/30">
                                <TrendingUp className="h-8 w-8 text-green-400" data-testid="step-growth-icon" />
                             </div>
                             <h3 className="text-2xl font-semibold text-green-300 font-poppins" data-testid="step-growth-title">Step 5: Apply & Grow</h3>
                         </div>
                         <p className="text-muted-foreground font-sans ml-1 pl-14 border-l-2 border-green-500/50" data-testid="step-growth-description">
                           Apply the insights and strategies gained from your interaction. Leverage the knowledge shared, utilize the AI Counselor for further exploration, and participate in the anonymous community to reinforce learning and connect with peers. This is your path to accelerated growth.
                         </p>
                     </div>
                 </div>
            </div>
        </section>

        {/* Features Section */}
         {/* Removed bg-background/70 backdrop-blur-sm */}
        <section className="py-16 md:py-24 animate-fade-in-up relative z-10" style={{ animationDelay: '0.4s' }} data-testid="features-section"> {/* Added relative z-10 */}
          <div className="container mx-auto px-4 md:px-6">
            <h2 className="text-3xl md:text-4xl font-bold text-center mb-12 text-accent text-glow-accent font-poppins" data-testid="features-title">Why ConnectPro?</h2>
             <p className="text-center text-lg text-foreground/80 mb-16 max-w-4xl mx-auto font-sans" data-testid="features-description"> {/* Adjusted text color */}
               ConnectPro is more than just a platform; it's your dedicated partner in professional growth. We offer a unique blend of human expertise and AI intelligence to empower your journey.
             </p>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8" data-testid="features-grid">
              {/* Feature Card 1 - Use bg-background/80 for slight distinction */}
              <Card className="bg-background/80 border border-border/60 overflow-hidden transform transition-all duration-300 hover:scale-[1.03] hover:shadow-lg hover:shadow-primary/20 group animate-fade-in-up hover:border-primary/50" style={{ animationDelay: '0.4s' }} data-testid="feature-card-expert-network">
                 <CardHeader className="p-6">
                    <div className="p-3 bg-primary/10 rounded-full w-fit mb-4 border border-primary/30 transform group-hover:scale-110 transition-transform duration-300 group-hover:shadow-glow-primary">
                        <Briefcase className="h-8 w-8 text-primary" data-testid="feature-icon-expert-network"/>
                    </div>
                    <CardTitle className="text-xl font-semibold font-poppins">Vetted Expert Network</CardTitle>
                 </CardHeader>
                 <CardContent className="p-6 pt-0">
                    <CardDescription className="font-sans">
                       Access a curated community of top-tier professionals across diverse fields. Our verification process ensures you connect with credible experts for mentorship, strategic advice, or skill development. Find your perfect match easily with advanced filters.
                    </CardDescription>
                 </CardContent>
              </Card>
              {/* Feature Card 2 - Use bg-background/80 */}
              <Card className="bg-background/80 border border-border/60 overflow-hidden transform transition-all duration-300 hover:scale-[1.03] hover:shadow-lg hover:shadow-accent/20 group animate-fade-in-up hover:border-accent/50" style={{ animationDelay: '0.5s' }} data-testid="feature-card-ai-guidance">
                 <CardHeader className="p-6">
                     <div className="p-3 bg-accent/10 rounded-full w-fit mb-4 border border-accent/30 transform group-hover:scale-110 transition-transform duration-300 group-hover:shadow-glow-accent">
                        <BrainCircuit className="h-8 w-8 text-accent" data-testid="feature-icon-ai-guidance"/>
                     </div>
                    <CardTitle className="text-xl font-semibold font-poppins">AI-Powered Guidance</CardTitle>
                 </CardHeader>
                 <CardContent className="p-6 pt-0">
                    <CardDescription className="font-sans">
                       Leverage our sophisticated AI Counselor, trained to understand nuanced career questions and challenges. It analyzes your conversation context, provides initial actionable insights, suggests relevant experts, and helps refine your queries—available 24/7.
                    </CardDescription>
                 </CardContent>
              </Card>
               {/* Feature Card 3 - Use bg-background/80 */}
              <Card className="bg-background/80 border border-border/60 overflow-hidden transform transition-all duration-300 hover:scale-[1.03] hover:shadow-lg hover:shadow-blue-500/20 group animate-fade-in-up hover:border-blue-500/50" style={{ animationDelay: '0.6s' }} data-testid="feature-card-video-sessions">
                 <CardHeader className="p-6">
                    <div className="p-3 bg-blue-500/10 rounded-full w-fit mb-4 border border-blue-500/30 transform group-hover:scale-110 transition-transform duration-300 group-hover:shadow-[0_0_15px_1px_rgba(59,130,246,0.3)]">
                       <Video className="h-8 w-8 text-blue-400" data-testid="feature-icon-video-sessions"/>
                    </div>
                   <CardTitle className="text-xl font-semibold font-poppins">Seamless Video Sessions</CardTitle>
                 </CardHeader>
                 <CardContent className="p-6 pt-0">
                   <CardDescription className="font-sans">
                     Engage in high-quality, secure video consultations directly within the platform. Our integrated scheduling system considers professional availability, making booking effortless. Enjoy end-to-end encryption for confidential and productive interactions.
                   </CardDescription>
                 </CardContent>
              </Card>
               {/* Feature Card 4 - Use bg-background/80 */}
              <Card className="bg-background/80 border border-border/60 overflow-hidden transform transition-all duration-300 hover:scale-[1.03] hover:shadow-lg hover:shadow-green-500/20 group animate-fade-in-up hover:border-green-500/50" style={{ animationDelay: '0.7s' }} data-testid="feature-card-community">
                 <CardHeader className="p-6">
                     <div className="p-3 bg-green-500/10 rounded-full w-fit mb-4 border border-green-500/30 transform group-hover:scale-110 transition-transform duration-300 group-hover:shadow-[0_0_15px_1px_rgba(34,197,94,0.3)]">
                         <Users className="h-8 w-8 text-green-400" data-testid="feature-icon-community"/>
                     </div>
                     <CardTitle className="text-xl font-semibold font-poppins">Supportive Community</CardTitle>
                 </CardHeader>
                 <CardContent className="p-6 pt-0">
                     <CardDescription className="font-sans">
                         Share experiences, ask questions, and connect with peers in a safe, anonymous space. Post text, images, code snippets, and links without revealing your identity. Foster growth through shared knowledge and collective problem-solving.
                     </CardDescription>
                 </CardContent>
               </Card>
                {/* Feature Card 5 - Use bg-background/80 */}
               <Card className="bg-background/80 border border-border/60 overflow-hidden transform transition-all duration-300 hover:scale-[1.03] hover:shadow-lg hover:shadow-yellow-500/20 group animate-fade-in-up hover:border-yellow-500/50" style={{ animationDelay: '0.8s' }} data-testid="feature-card-ai-chat">
                  <CardHeader className="p-6">
                       <div className="p-3 bg-yellow-500/10 rounded-full w-fit mb-4 border border-yellow-500/30 transform group-hover:scale-110 transition-transform duration-300 group-hover:shadow-[0_0_15px_1px_rgba(234,179,8,0.3)]">
                          <MessageSquare className="h-8 w-8 text-yellow-400" data-testid="feature-icon-ai-chat"/>
                       </div>
                     <CardTitle className="text-xl font-semibold font-poppins">Contextual AI Chat</CardTitle>
                  </CardHeader>
                  <CardContent className="p-6 pt-0">
                     <CardDescription className="font-sans">
                       Unlike basic chatbots, our AI Counselor maintains conversation context, providing relevant, human-like responses and recommendations. It supports multiple languages, ensuring natural and effective interaction for a global user base.
                     </CardDescription>
                  </CardContent>
               </Card>
                {/* Feature Card 6 - Use bg-background/80 */}
                <Card className="bg-background/80 border border-border/60 overflow-hidden transform transition-all duration-300 hover:scale-[1.03] hover:shadow-lg hover:shadow-red-500/20 group animate-fade-in-up hover:border-red-500/50" style={{ animationDelay: '0.9s' }} data-testid="feature-card-privacy">
                   <CardHeader className="p-6">
                       <div className="p-3 bg-red-500/10 rounded-full w-fit mb-4 border border-red-500/30 transform group-hover:scale-110 transition-transform duration-300 group-hover:shadow-[0_0_15px_1px_rgba(239,68,68,0.3)]">
                         <ShieldCheck className="h-8 w-8 text-red-400" data-testid="feature-icon-privacy"/>
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

         {/* User Reviews Section */}
         <UserReviews />

         {/* Community Preview Section */}
         <CommunityPreview />

        {/* Call to Action Section */}
        {/* Removed bg-background/50 backdrop-blur-sm */}
        <section className="py-16 md:py-24 text-center relative overflow-hidden animate-fade-in-up" style={{ animationDelay: '0.4s' }} data-testid="cta-section">
             {/* Background Glow */}
             <div className="absolute inset-x-0 bottom-0 h-64 -z-10 bg-gradient-to-t from-primary/10 via-primary/5 to-transparent blur-3xl"></div>

            <div className="container mx-auto px-4 md:px-6 relative z-10">
                <h2 className="text-3xl md:text-4xl font-bold mb-4 text-primary text-glow-primary font-poppins" data-testid="cta-title">Ready to Connect & Grow?</h2>
                <p className="text-lg text-foreground/80 mb-8 max-w-2xl mx-auto font-sans" data-testid="cta-description"> {/* Adjusted text color */}
                  Join ConnectPro today. Unlock personalized expert guidance, leverage cutting-edge AI insights for clearer direction, and participate in a thriving, anonymous community dedicated to mutual support and advancement.
                </p>
                <div className="space-y-4 sm:space-y-0 sm:space-x-4 font-sans" data-testid="cta-buttons">
                  <Button size="lg" className="bg-primary text-primary-foreground hover:bg-primary/90 shadow-glow-primary hover:shadow-none transition-all duration-300 transform hover:scale-105" asChild data-testid="cta-signup-user-button">
                    <Link href="/signup/user">Get Started as User</Link>
                  </Button>
                  <Button size="lg" variant="outline" className="border-primary text-primary hover:bg-primary/10 transition-colors transform hover:scale-105 shadow-glow-primary hover:shadow-none" asChild data-testid="cta-signup-pro-button">
                    <Link href="/signup/professional">Join as a Professional</Link>
                  </Button>
                </div>
            </div>
        </section>
      </main>

       {/* Footer */}
       {/* Removed bg-card/30 */}
       <footer className="border-t border-border/40 text-muted-foreground py-12 relative z-10" data-testid="footer"> {/* Increased padding, Added relative z-10 */}
         <div className="container mx-auto px-4 md:px-6 grid grid-cols-1 md:grid-cols-3 gap-8 items-start">
           {/* Logo and Copyright */}
           <div className="flex flex-col items-center md:items-start gap-4" data-testid="footer-logo-copyright">
             <div className="flex items-center gap-2">
                 <Logo className="h-8 w-8" data-testid="footer-logo"/> {/* Adjusted size */}
                 <span className="text-lg font-semibold text-foreground font-poppins" data-testid="footer-title">ConnectPro</span>
             </div>
             <p className="text-sm font-sans text-center md:text-left" data-testid="footer-copyright">&copy; {new Date().getFullYear()} ConnectPro. All rights reserved.</p>
           </div>

           {/* Navigation Links */}
           <nav className="flex flex-col items-center md:items-start gap-2 text-sm font-sans" data-testid="footer-nav">
             <h4 className="font-semibold text-foreground mb-2">Quick Links</h4>
             <Link href="/privacy" className="hover:text-foreground transition-colors hover:underline" data-testid="footer-link-privacy">Privacy Policy</Link>
             <Link href="/terms" className="hover:text-foreground transition-colors hover:underline" data-testid="footer-link-terms">Terms of Service</Link>
             <Link href="/contact" className="hover:text-foreground transition-colors hover:underline" data-testid="footer-link-contact">Contact Us</Link>
             <Link href="/community" className="hover:text-foreground transition-colors hover:underline" data-testid="footer-link-community">Community</Link>
           </nav>

           {/* Developer Message & Feedback */}
           <div className="flex flex-col items-center md:items-start text-center md:text-left gap-4" data-testid="footer-developer-message">
             <h4 className="font-semibold text-foreground mb-1">Message from the Developer</h4>
             <p className="text-xs font-sans leading-relaxed">
               Connect PRO is a Free Open Source project, this whole site is Single handedly developed and maintained by developer Rajdeep Saha. So some possible feature breakdown and optimisation issues maybe there, Please consider leaving your Review, it will help us a lot to improve the user experience.
             </p>
             {/* Feedback Button - Triggers the Modal */}
             <FeedbackModal />
           </div>
         </div>
       </footer>
    </div>
  );
}




