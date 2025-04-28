
"use client";

import Link from 'next/link';
import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from '@/hooks/useAuth';
import { Loader2, Chrome } from 'lucide-react'; // Import Chrome for Google icon

export default function UserLoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();
  const { toast } = useToast();
  const { loginWithEmail, loginWithGoogle, user, loading: authLoading } = useAuth();

  const redirectPath = searchParams.get('redirect') || '/user/dashboard';

  useEffect(() => {
    if (!authLoading && user) {
       console.log("User already logged in, redirecting to:", redirectPath);
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
        description: "Redirecting...",
      });
      // Redirect is handled by useEffect
    } catch (error: any) {
      console.error("Email login failed:", error);
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
      // Redirect is handled by useEffect
    } catch (error: any) {
      console.error("Google login failed:", error);
      toast({
        variant: "destructive",
        title: "Google Sign-In Failed",
        description: error.message || "Could not sign in with Google. Please try again.",
      });
      setGoogleLoading(false);
    }
  };

  if (authLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-secondary">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (user) {
     return (
       <div className="flex items-center justify-center min-h-screen bg-secondary">
         <Loader2 className="h-8 w-8 animate-spin text-primary" />
         <p className="ml-2 text-muted-foreground">Redirecting...</p>
       </div>
     );
   }

  return (
    <div className="flex items-center justify-center min-h-screen bg-secondary" data-testid="user-login-page">
      <Card className="w-full max-w-md shadow-lg" data-testid="login-card">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-bold" data-testid="login-title">User Login</CardTitle>
          <CardDescription data-testid="login-description">Welcome back! Access your ConnectPro account.</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleLogin} className="space-y-4" data-testid="login-form">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="you@example.com"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={loading || googleLoading}
                data-testid="email-input"
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
                data-testid="password-input"
              />
            </div>
            <Button type="submit" className="w-full" disabled={loading || googleLoading} data-testid="login-submit-button">
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
                  <Chrome className="mr-2 h-4 w-4" /> // Using Chrome icon for Google
                )}
                 Google
              </Button>
           </div>
        </CardContent>
        <CardFooter className="flex flex-col items-center space-y-2" data-testid="login-footer">
          <Link href="/forgot-password" passHref>
             <Button variant="link" className="text-sm p-0 h-auto" data-testid="forgot-password-link">Forgot password?</Button>
          </Link>
          <p className="text-sm text-muted-foreground" data-testid="signup-prompt">
            Don't have an account?{' '}
            <Link href="/signup/user" passHref>
               <Button variant="link" className="text-sm p-0 h-auto" data-testid="signup-link">Sign Up</Button>
            </Link>
          </p>
           <Link href="/" passHref>
               <Button variant="outline" className="mt-4" data-testid="back-home-button">Back to Home</Button>
           </Link>
        </CardFooter>
      </Card>
    </div>
  );
}
