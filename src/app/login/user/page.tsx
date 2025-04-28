
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
import { Loader2 } from 'lucide-react'; // Import Loader2

export default function UserLoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const searchParams = useSearchParams(); // Get query parameters
  const { toast } = useToast();
  const { loginWithEmail, user, loading: authLoading } = useAuth(); // Use email login from useAuth

  const redirectPath = searchParams.get('redirect') || '/user/dashboard'; // Get redirect path or default

  // Redirect if user is already logged in
  useEffect(() => {
    if (!authLoading && user) {
       console.log("User already logged in, redirecting to:", redirectPath);
       router.replace(redirectPath);
    }
  }, [user, authLoading, router, redirectPath]);


  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    console.log('User Login Attempt:', { email }); // Avoid logging password

    try {
      await loginWithEmail(email, password); // Use the login function from context
      toast({
        title: "Login Successful",
        description: "Redirecting...",
      });
       // Redirect logic is now handled by the useEffect hook listening to user state change
       // router.push(redirectPath); // Remove direct push here
    } catch (error: any) {
      console.error("Login failed:", error);
      toast({
        variant: "destructive",
        title: "Login Failed",
        description: error.message || "Invalid email or password. Please try again.",
      });
      setLoading(false); // Keep loading false on error
    }
     // setLoading(false) will be handled implicitly when auth state changes or on error
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
                disabled={loading}
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
                disabled={loading}
                data-testid="password-input"
              />
            </div>
            <Button type="submit" className="w-full" disabled={loading} data-testid="login-submit-button">
              {loading ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Logging in...</> : 'Log In'}
            </Button>
          </form>
           {/* Add alternative login methods if needed, e.g., Google Sign-In */}
           {/*
           <div className="mt-4 text-center text-sm">
              Or log in with
           </div>
           <div className="mt-2 flex justify-center">
              <Button variant="outline" onClick={loginWithGoogle} disabled={loading}>
                 Google
              </Button>
           </div>
           */}
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
