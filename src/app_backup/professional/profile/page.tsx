"use client";

import React, { useState } from 'react';
import AppLayout from '@/components/layouts/app-layout';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from '@/hooks/use-toast';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

// TODO: Fetch actual professional data
const mockProfessionalData = {
    id: 'prof2',
    name: 'Dr. Bob Johnson',
    email: 'bob.pro@example.com',
    avatarUrl: `https://picsum.photos/seed/professional/100/100`,
    field: 'Data Science',
    description: 'Data scientist skilled in machine learning and statistical analysis. Passionate about mentoring aspiring data professionals.',
    skills: ['Python', 'Machine Learning', 'Data Visualization', 'SQL', 'Statistical Modeling'],
    // Add other relevant fields: experience, hourly rate (if applicable), website, LinkedIn, etc.
    hourlyRate: 100, // Example
    linkedIn: 'https://linkedin.com/in/bobjohnson', // Example
};

// Example fields, should match signup and filtering lists
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

export default function ProfessionalProfilePage() {
    const { toast } = useToast();
    const [loading, setLoading] = useState(false); // For save operations

    // State for profile info
    const [name, setName] = useState(mockProfessionalData.name);
    const [email, setEmail] = useState(mockProfessionalData.email);
    const [field, setField] = useState(mockProfessionalData.field);
    const [description, setDescription] = useState(mockProfessionalData.description);
    const [skills, setSkills] = useState(mockProfessionalData.skills.join(', '));
    const [hourlyRate, setHourlyRate] = useState(mockProfessionalData.hourlyRate?.toString() || '');
    const [linkedIn, setLinkedIn] = useState(mockProfessionalData.linkedIn || '');

    // State for password change
    const [currentPassword, setCurrentPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmNewPassword, setConfirmNewPassword] = useState('');

    const handleProfileUpdate = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        const skillsArray = skills.split(',').map(s => s.trim()).filter(s => s);
        const profileData = { name, email, field, description, skills: skillsArray, hourlyRate: hourlyRate ? parseFloat(hourlyRate) : undefined, linkedIn };
        console.log('Updating professional profile:', profileData);

        // TODO: Implement actual profile update API call
        await new Promise(resolve => setTimeout(resolve, 1000));
        const updateSuccess = true; // Placeholder

        if (updateSuccess) {
            toast({ title: "Profile Updated", description: "Your professional profile has been saved." });
            // Update mock data or refetch
            Object.assign(mockProfessionalData, profileData, { skills: skillsArray }); // Update mock
        } else {
            toast({ variant: "destructive", title: "Update Failed", description: "Could not update profile." });
        }
        setLoading(false);
    };

    const handlePasswordChange = async (e: React.FormEvent) => {
        e.preventDefault();
         if (!currentPassword || !newPassword || !confirmNewPassword) {
             toast({ variant: "destructive", title: "Missing Fields", description: "Please fill all password fields." });
             return;
          }
        if (newPassword !== confirmNewPassword) {
            toast({ variant: "destructive", title: "Password Mismatch", description: "New passwords do not match." });
            return;
        }
        if (newPassword.length < 6) {
             toast({ variant: "destructive", title: "Password Too Short", description: "Password must be at least 6 characters." });
             return;
         }
        setLoading(true);
        console.log('Changing password attempt for professional:', mockProfessionalData.email);

        // TODO: Implement actual password change API call
        await new Promise(resolve => setTimeout(resolve, 1500));
        const changeSuccess = true; // Placeholder

        if (changeSuccess) {
            toast({ title: "Password Changed", description: "Your password has been updated successfully." });
            setCurrentPassword('');
            setNewPassword('');
            setConfirmNewPassword('');
        } else {
            toast({ variant: "destructive", title: "Password Change Failed", description: "Could not change password. Check your current password." });
        }
        setLoading(false);
    };

    return (
        <AppLayout userType="professional">
            <div className="container mx-auto py-8">
                <h1 className="text-3xl font-bold mb-6">Professional Profile & Settings</h1>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {/* Profile Information Card */}
                    <Card className="md:col-span-2 shadow-lg">
                        <CardHeader>
                            <CardTitle>Profile Information</CardTitle>
                            <CardDescription>Keep your professional details up-to-date.</CardDescription>
                        </CardHeader>
                         <form onSubmit={handleProfileUpdate}>
                            <CardContent className="space-y-4">
                                <div className="flex items-center gap-4 mb-6">
                                    <Avatar className="h-16 w-16">
                                        <AvatarImage src={mockProfessionalData.avatarUrl} alt={name} />
                                        <AvatarFallback>{name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                                    </Avatar>
                                     <Button variant="outline" size="sm">Change Avatar</Button> {/* TODO: Implement Avatar Upload */}
                                </div>
                                 <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <Label htmlFor="name">Full Name</Label>
                                        <Input id="name" value={name} onChange={(e) => setName(e.target.value)} disabled={loading} />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="email">Email Address</Label>
                                        <Input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} disabled={loading} />
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
                                    <Label htmlFor="description">Bio / Description</Label>
                                    <Textarea id="description" value={description} onChange={(e) => setDescription(e.target.value)} disabled={loading} rows={4} />
                                </div>
                                 <div className="space-y-2">
                                    <Label htmlFor="skills">Skills (comma-separated)</Label>
                                    <Input id="skills" value={skills} onChange={(e) => setSkills(e.target.value)} disabled={loading} placeholder="e.g., Python, Machine Learning, Mentoring" />
                                </div>
                                 <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                      <div className="space-y-2">
                                         <Label htmlFor="hourlyRate">Hourly Rate ($) (Optional)</Label>
                                         <Input id="hourlyRate" type="number" value={hourlyRate} onChange={(e) => setHourlyRate(e.target.value)} disabled={loading} placeholder="e.g., 100"/>
                                      </div>
                                       <div className="space-y-2">
                                         <Label htmlFor="linkedIn">LinkedIn Profile URL (Optional)</Label>
                                         <Input id="linkedIn" type="url" value={linkedIn} onChange={(e) => setLinkedIn(e.target.value)} disabled={loading} placeholder="https://linkedin.com/in/..."/>
                                      </div>
                                 </div>
                                 {/* Add more professional-specific fields */}
                            </CardContent>
                            <CardFooter>
                                <Button type="submit" disabled={loading}>
                                    {loading ? 'Saving...' : 'Save Profile Changes'}
                                </Button>
                            </CardFooter>
                         </form>
                    </Card>

                    {/* Change Password Card */}
                    <Card className="shadow-lg h-fit"> {/* Use h-fit for potentially shorter card */}
                        <CardHeader>
                            <CardTitle>Change Password</CardTitle>
                            <CardDescription>Update your account password.</CardDescription>
                        </CardHeader>
                         <form onSubmit={handlePasswordChange}>
                            <CardContent className="space-y-4">
                                <div className="space-y-2">
                                    <Label htmlFor="current-password">Current Password</Label>
                                    <Input id="current-password" type="password" value={currentPassword} onChange={(e) => setCurrentPassword(e.target.value)} disabled={loading} required/>
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="new-password">New Password</Label>
                                    <Input id="new-password" type="password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} disabled={loading} required/>
                                </div>
                                 <div className="space-y-2">
                                    <Label htmlFor="confirm-new-password">Confirm New Password</Label>
                                    <Input id="confirm-new-password" type="password" value={confirmNewPassword} onChange={(e) => setConfirmNewPassword(e.target.value)} disabled={loading} required/>
                                </div>
                            </CardContent>
                            <CardFooter>
                                <Button type="submit" variant="secondary" disabled={loading}>
                                     {loading ? 'Updating...' : 'Update Password'}
                                </Button>
                            </CardFooter>
                         </form>
                    </Card>
                </div>
            </div>
        </AppLayout>
    );
}
