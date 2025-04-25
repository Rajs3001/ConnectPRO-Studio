"use client";

import Link from 'next/link';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";

export default function ProfessionalLoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const { toast } = useToast();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    // TODO: Implement actual authentication logic here
    console.log('Professional Login Attempt:', { email, password });

    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500));

    // Placeholder success state
    const loginSuccess = true; // Replace with actual auth check

    if (loginSuccess) {
      toast({
        title: "Login Successful",
        description: "Redirecting to your professional dashboard...",
      });
       router.push('/professional/dashboard'); // Redirect to professional dashboard
    } else {
      toast({
        variant: "destructive",
        title: "Login Failed",
        description: "Invalid email or password. Please try again.",
      });
      setLoading(false);
    }
  };

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
                disabled={loading}
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
              />
            </div>
            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? 'Logging in...' : 'Log In'}
            </Button>
          </form>
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
