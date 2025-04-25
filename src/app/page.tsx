import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Briefcase, MessageSquare, Video } from 'lucide-react';

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen">
      <header className="bg-primary text-primary-foreground p-4 shadow-md">
        <div className="container mx-auto flex justify-between items-center">
          <h1 className="text-2xl font-bold">ConnectPro</h1>
          <nav className="space-x-4">
            <Button variant="ghost" asChild>
              <Link href="/login/user">User Login</Link>
            </Button>
            <Button variant="ghost" asChild>
              <Link href="/login/professional">Professional Login</Link>
            </Button>
          </nav>
        </div>
      </header>

      <main className="flex-grow container mx-auto p-8">
        <section className="text-center mb-16">
          <h2 className="text-4xl font-bold mb-4">Connect with Experts in Your Field</h2>
          <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
            Find and connect with professionals for guidance, mentorship, or collaboration through video calls and AI-powered chat.
          </p>
          <Button size="lg" asChild>
            <Link href="/find-professional">Find a Professional</Link>
          </Button>
        </section>

        <section className="grid md:grid-cols-3 gap-8 mb-16">
          <Card>
            <CardHeader>
              <Briefcase className="h-10 w-10 text-primary mb-4" />
              <CardTitle>Expert Professionals</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription>
                Access a diverse network of verified professionals across various fields. Use filters to find the perfect match for your needs.
              </CardDescription>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <Video className="h-10 w-10 text-primary mb-4" />
              <CardTitle>Seamless Video Calls</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription>
                Schedule and conduct real-time video meetings directly within the platform for convenient and effective communication.
              </CardDescription>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <MessageSquare className="h-10 w-10 text-primary mb-4" />
              <CardTitle>AI Counselor Chatbot</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription>
                Get instant guidance and professional suggestions from our AI chatbot, designed to understand your needs and connect you with the right expert.
              </CardDescription>
            </CardContent>
          </Card>
        </section>

        <section className="text-center bg-secondary p-12 rounded-lg">
          <h3 className="text-3xl font-bold mb-4">Ready to Connect?</h3>
          <p className="text-muted-foreground mb-6">
            Join ConnectPro today and take the next step in your professional journey.
          </p>
          <div className="space-x-4">
            <Button variant="default" size="lg" asChild>
              <Link href="/signup/user">Sign Up as User</Link>
            </Button>
             <Button variant="outline" size="lg" asChild>
               <Link href="/signup/professional">Join as Professional</Link>
             </Button>
          </div>
        </section>
      </main>

      <footer className="bg-muted text-muted-foreground p-4 text-center">
        <p>&copy; {new Date().getFullYear()} ConnectPro. All rights reserved.</p>
      </footer>
    </div>
  );
}
