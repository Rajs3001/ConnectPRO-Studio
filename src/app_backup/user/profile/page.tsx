"use client";

import React, { useState } from 'react';
import AppLayout from '@/components/layouts/app-layout';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Skeleton } from '@/components/ui/skeleton';

// TODO: Fetch actual user data
const mockUserData = {
    id: 'user1',
    name: 'Alice Student',
    email: 'alice@example.com',
    avatarUrl: `https://picsum.photos/seed/user/100/100`,
    // Add other relevant user fields, e.g., interests, timezone
};

export default function UserProfilePage() {
    const { toast } = useToast();
    const [loading, setLoading] = useState(false); // For save operations
    const [name, setName] = useState(mockUserData.name);
    const [email, setEmail] = useState(mockUserData.email);
    // Password fields are separate for security
    const [currentPassword, setCurrentPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmNewPassword, setConfirmNewPassword] = useState('');

    const handleProfileUpdate = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        console.log('Updating profile:', { name, email }); // Don't log passwords

        // TODO: Implement actual profile update API call (name, email, etc.)
        await new Promise(resolve => setTimeout(resolve, 1000));
        const updateSuccess = true; // Placeholder

        if (updateSuccess) {
            toast({ title: "Profile Updated", description: "Your profile information has been saved." });
            // Update mock data if needed, or refetch from context/API
            mockUserData.name = name;
            mockUserData.email = email;
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
        if (newPassword.length < 6) { // Example validation
             toast({ variant: "destructive", title: "Password Too Short", description: "Password must be at least 6 characters." });
             return;
         }

        setLoading(true);
        console.log('Changing password attempt for email:', mockUserData.email); // Avoid logging passwords

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
        <AppLayout userType="user">
            <div className="container mx-auto py-8">
                <h1 className="text-3xl font-bold mb-6">Profile Settings</h1>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {/* Profile Information Card */}
                    <Card className="md:col-span-2 shadow-lg">
                        <CardHeader>
                            <CardTitle>Account Information</CardTitle>
                            <CardDescription>Update your name and email address.</CardDescription>
                        </CardHeader>
                         <form onSubmit={handleProfileUpdate}>
                            <CardContent className="space-y-4">
                                <div className="flex items-center gap-4 mb-6">
                                    <Avatar className="h-16 w-16">
                                        <AvatarImage src={mockUserData.avatarUrl} alt={name} />
                                        <AvatarFallback>{name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                                    </Avatar>
                                     <Button variant="outline" size="sm">Change Avatar</Button> {/* TODO: Implement Avatar Upload */}
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="name">Full Name</Label>
                                    <Input id="name" value={name} onChange={(e) => setName(e.target.value)} disabled={loading} />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="email">Email Address</Label>
                                    <Input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} disabled={loading} />
                                </div>
                                {/* Add other profile fields here (e.g., interests, timezone) */}
                            </CardContent>
                            <CardFooter>
                                <Button type="submit" disabled={loading}>
                                    {loading ? 'Saving...' : 'Save Profile Changes'}
                                </Button>
                            </CardFooter>
                         </form>
                    </Card>

                    {/* Change Password Card */}
                    <Card className="shadow-lg">
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
