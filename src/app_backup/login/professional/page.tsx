"use client";

import Link from 'next/link';
import { useState, useEffect } from 'react'; // Added useEffect
import { useRouter, useSearchParams } from 'next/navigation'; // Added useSearchParams
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from '@/hooks/useAuth'; // Import useAuth
import { Loader2, Chrome } from 'lucide-react'; // Import Loader2 and Chrome icon

export default function ProfessionalLoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();
  const { toast } = useToast();
  const { loginWithEmail, loginWithGoogle, user, loading: authLoading } = useAuth(); // Use auth functions

  const redirectPath = searchParams.get('redirect') || '/professional/dashboard';

  // Redirect if professional user is already logged in
  // NOTE: This assumes professionals use the same auth system. You might need
  // additional logic here if professionals have separate roles/checks.
  useEffect(() => {
    if (!authLoading && user) {
      console.log("Professional already logged in, redirecting to:", redirectPath);
      // TODO: Add check here to ensure the logged-in user IS a professional
      // before redirecting to the professional dashboard.
      // For now, we assume any logged-in user might be a professional.
      router.replace(redirectPath);
    }
  }, [user, authLoading, router, redirectPath]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await loginWithEmail(email, password);
      toast({
        title: "Login Successful",
        description: "Redirecting to your professional dashboard...",
      });
      // Redirect handled by useEffect
    } catch (error: any) {
      console.error("Professional email login failed:", error);
      toast({
        variant: "destructive",
        title: "Login Failed",
        description: error.message || "Invalid email or password. Please try again.",
      });
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    setGoogleLoading(true);
    try {
      await loginWithGoogle();
      toast({
        title: "Google Sign-In Successful",
        description: "Redirecting...",
      });
      // Redirect handled by useEffect
    } catch (error: any) {
      console.error("Professional Google login failed:", error);
      toast({
        variant: "destructive",
        title: "Google Sign-In Failed",
        description: error.message || "Could not sign in with Google. Please try again.",
      });
      setGoogleLoading(false);
    }
  };

  // Show loading indicator while checking auth state
  if (authLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-secondary">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  // Prevent rendering login form if user becomes authenticated
  if (user) {
     return (
       <div className="flex items-center justify-center min-h-screen bg-secondary">
         <Loader2 className="h-8 w-8 animate-spin text-primary" />
         <p className="ml-2 text-muted-foreground">Redirecting...</p>
       </div>
     );
   }

  return (
    <div className="flex items-center justify-center min-h-screen bg-secondary">
      <Card className="w-full max-w-md shadow-lg">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-bold">Professional Login</CardTitle>
          <CardDescription>Manage your profile and appointments.</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleLogin} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="pro@example.com"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={loading || googleLoading}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                placeholder="••••••••"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={loading || googleLoading}
              />
            </div>
            <Button type="submit" className="w-full" disabled={loading || googleLoading}>
              {loading ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Logging in...</> : 'Log In'}
            </Button>
          </form>
           <div className="mt-4 relative">
              <div className="absolute inset-0 flex items-center">
                 <span className="w-full border-t" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                 <span className="bg-background px-2 text-muted-foreground">
                 Or continue with
                 </span>
              </div>
           </div>
           <div className="mt-4 flex justify-center">
              <Button variant="outline" onClick={handleGoogleLogin} disabled={loading || googleLoading} className="w-full">
                {googleLoading ? (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                ) : (
                  <Chrome className="mr-2 h-4 w-4" />
                )}
                 Google
              </Button>
           </div>
        </CardContent>
        <CardFooter className="flex flex-col items-center space-y-2">
          <Link href="/forgot-password" passHref>
             <Button variant="link" className="text-sm p-0 h-auto">Forgot password?</Button>
          </Link>
          <p className="text-sm text-muted-foreground">
            Not yet a professional on ConnectPro?{' '}
            <Link href="/signup/professional" passHref>
               <Button variant="link" className="text-sm p-0 h-auto">Join Now</Button>
            </Link>
          </p>
           <Link href="/" passHref>
               <Button variant="outline" className="mt-4">Back to Home</Button>
           </Link>
        </CardFooter>
      </Card>
    </div>
  );
}
