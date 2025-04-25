import Link from 'next/link';
import Image from 'next/image'; // Import next/image
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Briefcase, MessageSquare, Video, TrendingUp, ShieldCheck, Users } from 'lucide-react'; // Added more icons

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen bg-background text-foreground">
      <header className="bg-primary text-primary-foreground p-4 shadow-md sticky top-0 z-50">
        <div className="container mx-auto flex justify-between items-center">
          <Link href="/" className="text-2xl font-bold hover:opacity-90 transition-opacity">ConnectPro</Link>
          <nav className="space-x-2 md:space-x-4">
            <Button variant="ghost" className="text-primary-foreground hover:bg-primary/80" asChild>
              <Link href="/login/user">User Login</Link>
            </Button>
            <Button variant="secondary" className="hover:opacity-90" asChild>
              <Link href="/signup/professional">Join as Pro</Link>
            </Button>
          </nav>
        </div>
      </header>

      <main className="flex-grow container mx-auto p-6 md:p-12">
        <section className="text-center mb-16 md:mb-24 animate-fade-in">
           <Image
              src="https://picsum.photos/seed/hero/1200/400" // Hero image placeholder
              alt="Connecting professionals"
              width={1200}
              height={400}
              className="w-full max-w-4xl mx-auto rounded-lg shadow-xl mb-8 object-cover aspect-[3/1]"
              priority // Load hero image first
           />
          <h2 className="text-4xl md:text-5xl font-bold mb-4 text-primary">Unlock Your Potential with Expert Guidance</h2>
          <p className="text-lg text-muted-foreground mb-8 max-w-3xl mx-auto">
            ConnectPro bridges the gap between ambition and achievement. Find verified professionals for personalized mentorship, strategic advice, or collaborative projects through secure video calls and intelligent AI chat support.
          </p>
          <Button size="lg" className="bg-accent text-accent-foreground hover:bg-accent/90" asChild>
            <Link href="/user/find-professional">Discover Your Mentor</Link>
          </Button>
        </section>

        <section className="mb-16 md:mb-24">
           <h3 className="text-3xl font-bold text-center mb-12">Why Choose ConnectPro?</h3>
           <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {/* Card 1: Expert Network */}
              <Card className="shadow-lg hover:shadow-xl transition-all duration-300 ease-in-out transform hover:-translate-y-1 animate-slide-up [animation-delay:0.1s]">
                 <CardHeader>
                    <div className="flex justify-center mb-4">
                     <Image src="https://picsum.photos/seed/experts/300/200" alt="Expert Network" width={300} height={200} className="rounded-t-lg object-cover w-full h-32"/>
                    </div>
                   <Briefcase className="h-10 w-10 text-primary mx-auto mb-2" />
                   <CardTitle className="text-center">Vast Expert Network</CardTitle>
                 </CardHeader>
                 <CardContent>
                   <CardDescription className="text-center">
                     Explore a curated community of verified professionals spanning diverse industries. Our rigorous vetting process ensures you connect with top-tier experts ready to share their knowledge. Use advanced filters to pinpoint the perfect mentor for your specific goals.
                   </CardDescription>
                 </CardContent>
              </Card>

             {/* Card 2: Video Calls */}
              <Card className="shadow-lg hover:shadow-xl transition-all duration-300 ease-in-out transform hover:-translate-y-1 animate-slide-up [animation-delay:0.2s]">
                 <CardHeader>
                     <div className="flex justify-center mb-4">
                     <Image src="https://picsum.photos/seed/video/300/200" alt="Video Calls" width={300} height={200} className="rounded-t-lg object-cover w-full h-32"/>
                    </div>
                   <Video className="h-10 w-10 text-primary mx-auto mb-2" />
                   <CardTitle className="text-center">Seamless Video Sessions</CardTitle>
                 </CardHeader>
                 <CardContent>
                   <CardDescription className="text-center">
                     Engage in high-quality, real-time video consultations directly on our secure platform. Schedule meetings effortlessly and benefit from face-to-face interaction, fostering deeper connections and more effective learning.
                   </CardDescription>
                 </CardContent>
              </Card>

              {/* Card 3: AI Counselor */}
              <Card className="shadow-lg hover:shadow-xl transition-all duration-300 ease-in-out transform hover:-translate-y-1 animate-slide-up [animation-delay:0.3s]">
                 <CardHeader>
                    <div className="flex justify-center mb-4">
                     <Image src="https://picsum.photos/seed/ai/300/200" alt="AI Chatbot" width={300} height={200} className="rounded-t-lg object-cover w-full h-32"/>
                    </div>
                   <MessageSquare className="h-10 w-10 text-primary mx-auto mb-2" />
                   <CardTitle className="text-center">Intelligent AI Guidance</CardTitle>
                 </CardHeader>
                 <CardContent>
                   <CardDescription className="text-center">
                     Leverage our advanced AI Counselor for instant insights and personalized recommendations. It analyzes your needs, understands context from your conversations, and suggests the most relevant professionals or resources, available 24/7.
                   </CardDescription>
                 </CardContent>
              </Card>

              {/* Added Card 4: Growth */}
               <Card className="shadow-lg hover:shadow-xl transition-all duration-300 ease-in-out transform hover:-translate-y-1 animate-slide-up [animation-delay:0.4s]">
                 <CardHeader>
                     <div className="flex justify-center mb-4">
                       <Image src="https://picsum.photos/seed/growth/300/200" alt="Professional Growth" width={300} height={200} className="rounded-t-lg object-cover w-full h-32"/>
                     </div>
                   <TrendingUp className="h-10 w-10 text-primary mx-auto mb-2" />
                   <CardTitle className="text-center">Accelerate Your Growth</CardTitle>
                 </CardHeader>
                 <CardContent>
                   <CardDescription className="text-center">
                     Whether you're navigating a career change, mastering a new skill, or scaling your business, ConnectPro provides the targeted support you need to overcome obstacles and achieve your professional milestones faster.
                   </CardDescription>
                 </CardContent>
               </Card>

               {/* Added Card 5: Secure */}
                <Card className="shadow-lg hover:shadow-xl transition-all duration-300 ease-in-out transform hover:-translate-y-1 animate-slide-up [animation-delay:0.5s]">
                  <CardHeader>
                     <div className="flex justify-center mb-4">
                       <Image src="https://picsum.photos/seed/secure/300/200" alt="Secure Platform" width={300} height={200} className="rounded-t-lg object-cover w-full h-32"/>
                     </div>
                    <ShieldCheck className="h-10 w-10 text-primary mx-auto mb-2" />
                    <CardTitle className="text-center">Secure & Confidential</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <CardDescription className="text-center">
                      Your privacy is paramount. Communicate and share information with confidence on our platform, featuring end-to-end encryption for video calls and secure data handling practices. Focus on your goals, knowing your interactions are protected.
                    </CardDescription>
                  </CardContent>
                </Card>

                {/* Added Card 6: Community */}
                 <Card className="shadow-lg hover:shadow-xl transition-all duration-300 ease-in-out transform hover:-translate-y-1 animate-slide-up [animation-delay:0.6s]">
                   <CardHeader>
                     <div className="flex justify-center mb-4">
                       <Image src="https://picsum.photos/seed/community/300/200" alt="Community" width={300} height={200} className="rounded-t-lg object-cover w-full h-32"/>
                     </div>
                     <Users className="h-10 w-10 text-primary mx-auto mb-2" />
                     <CardTitle className="text-center">Supportive Community</CardTitle>
                   </CardHeader>
                   <CardContent>
                     <CardDescription className="text-center">
                       Join a network of like-minded individuals and seasoned experts. Beyond one-on-one sessions, benefit from a community atmosphere focused on mutual growth, shared insights, and collaborative opportunities.
                     </CardDescription>
                   </CardContent>
                 </Card>
            </div>
        </section>


        <section className="text-center bg-gradient-to-r from-primary via-blue-600 to-accent p-12 rounded-lg shadow-xl animate-fade-in">
          <h3 className="text-3xl font-bold mb-4 text-primary-foreground">Ready to Elevate Your Career?</h3>
          <p className="text-primary-foreground/90 mb-8 max-w-2xl mx-auto">
            Stop searching, start connecting. Join ConnectPro today and unlock a world of professional guidance tailored just for you.
          </p>
          <div className="space-y-4 md:space-y-0 md:space-x-4">
            <Button variant="secondary" size="lg" className="hover:opacity-95" asChild>
              <Link href="/signup/user">Sign Up as User</Link>
            </Button>
             <Button variant="outline" size="lg" className="bg-transparent border-primary-foreground text-primary-foreground hover:bg-primary-foreground hover:text-primary" asChild>
               <Link href="/signup/professional">Join as Professional</Link>
             </Button>
          </div>
        </section>
      </main>

      <footer className="bg-muted text-muted-foreground p-6 text-center mt-12">
        <p>&copy; {new Date().getFullYear()} ConnectPro. All rights reserved.</p>
         <nav className="mt-2 space-x-4 text-sm">
            <Link href="/privacy" className="hover:text-foreground">Privacy Policy</Link>
            <Link href="/terms" className="hover:text-foreground">Terms of Service</Link>
         </nav>
      </footer>
    </div>
  );
}
