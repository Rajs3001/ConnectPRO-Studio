"use client";

import Link from 'next/link';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from '@/hooks/useAuth';

// Example fields, replace with actual professional fields
const professionalFields = [
  "Software Engineering",
  "Data Science",
  "Product Management",
  "UX/UI Design",
  "Marketing",
  "Finance",
  "Healthcare",
  "Education",
  "Legal",
  "Other",
];

export default function ProfessionalSignupPage() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [field, setField] = useState('');
  const [description, setDescription] = useState('');
  const [skills, setSkills] = useState(''); // Comma-separated
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const { toast } = useToast();
  const { signupWithEmail } = useAuth();

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      toast({
        variant: "destructive",
        title: "Signup Failed",
        description: "Passwords do not match.",
      });
      return;
    }
     if (!field) {
       toast({
         variant: "destructive",
         title: "Signup Failed",
         description: "Please select your field of expertise.",
       });
       return;
     }
    setLoading(true);
    try {
      await signupWithEmail(name, email, password);
      toast({
        title: "Signup Successful",
        description: "Professional account created! Redirecting to login...",
      });
      router.push('/login/professional');
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Signup Failed",
        description: error.message || "Could not create professional account. Please try again.",
      });
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-secondary py-12">
      <Card className="w-full max-w-lg shadow-lg">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-bold">Join as a Professional</CardTitle>
          <CardDescription>Share your expertise and connect with users on ConnectPro.</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSignup} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="name">Full Name</Label>
                <Input
                  id="name"
                  type="text"
                  placeholder="Dr. Jane Smith"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  disabled={loading}
                />
              </div>
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
            </div>

             <div className="space-y-2">
                <Label htmlFor="field">Field of Expertise</Label>
                <Select onValueChange={setField} value={field} disabled={loading}>
                  <SelectTrigger id="field">
                    <SelectValue placeholder="Select your field" />
                  </SelectTrigger>
                  <SelectContent>
                    {professionalFields.map((f) => (
                      <SelectItem key={f} value={f}>{f}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

            <div className="space-y-2">
              <Label htmlFor="description">Brief Description / Bio</Label>
              <Textarea
                id="description"
                placeholder="Tell users about your background and expertise..."
                required
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                disabled={loading}
                rows={3}
              />
            </div>

             <div className="space-y-2">
              <Label htmlFor="skills">Skills (comma-separated)</Label>
              <Input
                id="skills"
                type="text"
                placeholder="e.g., Web Development, Mentoring, Career Advice"
                required
                value={skills}
                onChange={(e) => setSkills(e.target.value)}
                disabled={loading}
              />
            </div>


            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
              <div className="space-y-2">
                <Label htmlFor="confirm-password">Confirm Password</Label>
                <Input
                  id="confirm-password"
                  type="password"
                  placeholder="••••••••"
                  required
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  disabled={loading}
                />
              </div>
            </div>

            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? 'Creating Account...' : 'Create Professional Account'}
            </Button>
          </form>
        </CardContent>
        <CardFooter className="flex flex-col items-center space-y-2">
          <p className="text-sm text-muted-foreground">
            Already have a professional account?{' '}
            <Link href="/login/professional" passHref>
               <Button variant="link" className="text-sm p-0 h-auto">Log In</Button>
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
