
"use client";

import React, { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Loader2, Users, MessageSquare, LockKeyhole, Sparkles, ArrowRight } from 'lucide-react';
import SiteLoader from '@/components/shared/site-loader';

const benefits = [
  {
    icon: Users,
    title: "Connect with Peers",
    description: "Share experiences and learn from others navigating similar professional paths.",
  },
  {
    icon: MessageSquare,
    title: "Ask Questions Anonymously",
    description: "Get candid advice and insights on career challenges without revealing your identity.",
  },
   {
     icon: Sparkles, // Placeholder for Insight/Knowledge
     title: "Gain Diverse Perspectives",
     description: "Access a wide range of viewpoints on industry trends, interview tips, and more.",
   },
  {
    icon: LockKeyhole,
    title: "Safe & Supportive Space",
    description: "Engage in discussions within a secure environment focused on mutual growth.",
  },
];

export default function CommunityJoinPage() {
  const { user, loading: authLoading, communityProfileExists, joinCommunity } = useAuth();
  const router = useRouter();
  const [isJoining, setIsJoining] = useState(false);

  // Redirect if already has profile or not logged in (after loading)
  useEffect(() => {
    if (!authLoading) {
        if (!user) {
            console.log("CommunityJoinPage: User not logged in, redirecting to login.");
            router.replace('/login/user?redirect=/community/join');
        } else if (communityProfileExists === true) {
            console.log("CommunityJoinPage: User already has profile, redirecting to /community.");
            router.replace('/community'); // Redirect to the main community feed
        }
        // If communityProfileExists is null or false, stay on this page
    }
  }, [user, authLoading, communityProfileExists, router]);

  const handleJoin = async () => {
    setIsJoining(true);
    try {
      await joinCommunity();
       console.log("Community joined successfully, redirecting...");
      // Redirect is now handled by the useEffect listening to communityProfileExists change
      router.push('/community'); // Explicitly redirect after successful join
    } catch (error: any) {
      console.error("Failed to join community:", error);
      // Show error toast or message to the user
      alert(`Failed to join: ${error.message}`);
    } finally {
      setIsJoining(false);
    }
  };

  // Show loader while checking auth/profile status
  if (authLoading || communityProfileExists === null || (communityProfileExists === true && user) || (!user && !authLoading) ) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-background via-secondary/30 to-background">
        <SiteLoader size="lg" />
      </div>
    );
  }


  // Render the join page content if checks passed (user logged in, no profile yet)
  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-background via-secondary/30 to-background p-4">
      <Card className="w-full max-w-2xl shadow-xl border border-border/60 bg-card/80 backdrop-blur-sm animate-fade-in-up">
        <CardHeader className="text-center">
          <Users className="mx-auto h-12 w-12 text-primary mb-3" />
          <CardTitle className="text-2xl font-bold text-glow-primary">Join the ConnectPro Community</CardTitle>
          <CardDescription className="text-muted-foreground">
            Connect anonymously with peers, share insights, and grow together in a supportive space.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {benefits.map((benefit, index) => (
              <div key={index} className="flex items-start gap-3 p-3 bg-muted/50 rounded-lg border border-border/40">
                <benefit.icon className="h-6 w-6 text-primary mt-1 shrink-0" />
                <div>
                  <h3 className="text-sm font-semibold">{benefit.title}</h3>
                  <p className="text-xs text-muted-foreground">{benefit.description}</p>
                </div>
              </div>
            ))}
          </div>
          <p className="text-xs text-center text-muted-foreground italic px-4">
             Your community profile uses an auto-generated anonymous display name. Your main account details remain private.
          </p>
        </CardContent>
        <CardFooter className="flex justify-center">
          <Button
            size="lg"
            onClick={handleJoin}
            disabled={isJoining}
            className="bg-primary hover:bg-primary/90 text-primary-foreground shadow-glow-primary transition-all hover:scale-105"
          >
            {isJoining ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Joining...
              </>
            ) : (
              <>
                Get Started <ArrowRight className="ml-2 h-4 w-4" />
              </>
            )}
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
