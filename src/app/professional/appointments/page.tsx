"use client";

import React, { useState, useEffect } from 'react';
import AppLayout from '@/components/layouts/app-layout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Calendar, Video, CheckCircle, Clock, User, XCircle } from 'lucide-react'; // Added XCircle
import { format } from 'date-fns';
import Link from 'next/link';
import { Skeleton } from '@/components/ui/skeleton';
import { useToast } from "@/hooks/use-toast";

interface Appointment {
    id: string;
    userId: string; // Assuming user ID is needed
    userName: string;
    userContact?: string; // Optional email/phone
    dateTime: Date;
    status: 'pending' | 'confirmed' | 'completed' | 'cancelled_by_user' | 'cancelled_by_pro';
    type: 'Video Call';
    notes?: string; // Optional notes from user or pro
}

// Mock data function for professional appointments
const fetchProfessionalAppointments = async (): Promise<Appointment[]> => {
    // TODO: Replace with actual API call
    await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate network delay
    const now = new Date();
    return [
        { id: 'apt101', userId: 'user1', userName: 'Alice Student', dateTime: new Date(now.getTime() + 1 * 24 * 60 * 60 * 1000), status: 'confirmed', type: 'Video Call', userContact: 'alice@example.com' }, // Tomorrow
        { id: 'apt102', userId: 'user2', userName: 'Charlie User', dateTime: new Date(now.getTime() + 3 * 24 * 60 * 60 * 1000), status: 'pending', type: 'Video Call' }, // 3 days from now
        { id: 'apt103', userId: 'user1', userName: 'Alice Student', dateTime: new Date(now.getTime() - 2 * 24 * 60 * 60 * 1000), status: 'completed', type: 'Video Call', notes: 'Discussed React hooks.' }, // 2 days ago
        { id: 'apt104', userId: 'user3', userName: 'David Learner', dateTime: new Date(now.getTime() - 5 * 24 * 60 * 60 * 1000), status: 'completed', type: 'Video Call' }, // 5 days ago
        { id: 'apt105', userId: 'user2', userName: 'Charlie User', dateTime: new Date(now.getTime() + 4 * 24 * 60 * 60 * 1000), status: 'cancelled_by_user', type: 'Video Call' }, // 4 days from now, cancelled
    ];
};


export default function ProfessionalAppointmentsPage() {
    const [appointments, setAppointments] = useState<Appointment[]>([]);
    const [loading, setLoading] = useState(true);
    const { toast } = useToast();

    useEffect(() => {
        const loadAppointments = async () => {
            setLoading(true);
            const fetchedAppointments = await fetchProfessionalAppointments();
             // Sort: Pending first, then Confirmed (soonest first), then others (latest first)
            fetchedAppointments.sort((a, b) => {
                 if (a.status === 'pending' && b.status !== 'pending') return -1;
                 if (a.status !== 'pending' && b.status === 'pending') return 1;
                 if (a.status === 'confirmed' && b.status !== 'confirmed') return -1;
                 if (a.status !== 'confirmed' && b.status === 'confirmed') return 1;

                 if (a.status === 'confirmed' && b.status === 'confirmed') {
                     return a.dateTime.getTime() - b.dateTime.getTime(); // Soonest confirmed first
                 }
                 // For completed/cancelled, sort by latest first
                 return b.dateTime.getTime() - a.dateTime.getTime();
            });
            setAppointments(fetchedAppointments);
            setLoading(false);
        };
        loadAppointments();
    }, []);

    const handleConfirm = (id: string) => {
       // TODO: API call to confirm appointment
       console.log(`Confirming appointment ${id}`);
       setAppointments(prev => prev.map(apt => apt.id === id ? {...apt, status: 'confirmed'} : apt));
       toast({ title: "Appointment Confirmed", description: "The user has been notified." });
    }

    const handleCancel = (id: string) => {
        // TODO: API call to cancel appointment
        console.log(`Cancelling appointment ${id}`);
        // Add a confirmation dialog here in a real app
        setAppointments(prev => prev.map(apt => apt.id === id ? {...apt, status: 'cancelled_by_pro'} : apt));
        toast({ variant: "destructive", title: "Appointment Cancelled", description: "The user has been notified." });
     }

    const renderAppointmentCard = (apt: Appointment) => (
        <Card key={apt.id} className="mb-4 shadow hover:shadow-md transition-shadow duration-200">
            <CardHeader className="flex flex-row justify-between items-start pb-2">
                 <div>
                   <CardTitle className="text-lg flex items-center gap-1"><User size={18}/> {apt.userName}</CardTitle>
                   <CardDescription>{apt.userContact || 'No contact info'}</CardDescription>
                 </div>
                  <span className={`text-xs px-2 py-0.5 rounded-full font-medium flex items-center gap-1 ${
                       apt.status === 'pending' ? 'bg-yellow-100 text-yellow-800 animate-pulse' :
                       apt.status === 'confirmed' ? 'bg-blue-100 text-blue-800' :
                       apt.status === 'completed' ? 'bg-green-100 text-green-800' :
                       'bg-red-100 text-red-800' // cancelled by user or pro
                   }`}>
                      {apt.status === 'pending' && <Clock size={12} />}
                      {apt.status === 'confirmed' && <Clock size={12} />}
                      {apt.status === 'completed' && <CheckCircle size={12} />}
                      {(apt.status === 'cancelled_by_user' || apt.status === 'cancelled_by_pro') && <XCircle size={12} />}
                       {apt.status.replace('_', ' ').replace('by pro', '(by You)').replace('by user', '(by User)')
                          .split(' ')
                          .map(word => word.charAt(0).toUpperCase() + word.slice(1))
                          .join(' ')}
                   </span>
            </CardHeader>
            <CardContent className="flex flex-col md:flex-row justify-between md:items-center pt-2 gap-4 md:gap-0">
                <div className="space-y-1">
                   <p className="text-sm flex items-center gap-1"><Calendar size={14} /> {format(apt.dateTime, 'PPP')}</p>
                   <p className="text-sm flex items-center gap-1"><Clock size={14} /> {format(apt.dateTime, 'p')}</p>
                   <p className="text-sm flex items-center gap-1"><Video size={14} /> {apt.type}</p>
                    {apt.notes && <p className="text-sm text-muted-foreground italic pt-1">Notes: {apt.notes}</p>}
                </div>
                 <div className="flex flex-wrap gap-2 justify-end">
                    {apt.status === 'pending' && (
                       <>
                         <Button variant="destructive" size="sm" onClick={() => handleCancel(apt.id)}>Decline</Button>
                         <Button size="sm" onClick={() => handleConfirm(apt.id)}>Confirm</Button>
                       </>
                    )}
                     {apt.status === 'confirmed' && (
                       <>
                         <Button variant="outline" size="sm" onClick={() => handleCancel(apt.id)}>Cancel</Button>
                         <Button size="sm" asChild>
                             <Link href={`/professional/video/${apt.id}`}>Join Call</Link>
                         </Button>
                       </>
                     )}
                    {apt.status === 'completed' && (
                        <Button variant="outline" size="sm">View Details</Button> /* Or Add Notes */
                    )}
                    {(apt.status === 'cancelled_by_user' || apt.status === 'cancelled_by_pro') && (
                        <Button variant="link" size="sm" disabled>Cancelled</Button>
                    )}
                 </div>
            </CardContent>
        </Card>
    );

    const renderSkeletonCard = (key: number) => (
         <Card key={key} className="mb-4 shadow">
             <CardHeader className="flex flex-row justify-between items-start pb-2">
                 <div>
                   <Skeleton className="h-5 w-32 mb-1" />
                   <Skeleton className="h-4 w-40" />
                 </div>
                 <Skeleton className="h-5 w-20 rounded-full" />
             </CardHeader>
             <CardContent className="flex flex-col md:flex-row justify-between md:items-center pt-2 gap-4 md:gap-0">
                 <div className="space-y-1">
                    <Skeleton className="h-4 w-36" />
                    <Skeleton className="h-4 w-20" />
                    <Skeleton className="h-4 w-24" />
                 </div>
                 <div className="flex gap-2 justify-end">
                     <Skeleton className="h-9 w-20 rounded-md" />
                     <Skeleton className="h-9 w-20 rounded-md" />
                 </div>
             </CardContent>
         </Card>
     );

    const pending = appointments.filter(a => a.status === 'pending');
    const upcomingConfirmed = appointments.filter(a => a.status === 'confirmed');
    const pastCancelled = appointments.filter(a => a.status === 'completed' || a.status === 'cancelled_by_user' || a.status === 'cancelled_by_pro');


    return (
        <AppLayout userType="professional">
            <div className="container mx-auto py-8">
                <h1 className="text-3xl font-bold mb-6">Manage Appointments</h1>

                <Tabs defaultValue="pending" className="w-full">
                    <TabsList className="grid w-full grid-cols-3 mb-6">
                        <TabsTrigger value="pending">Pending ({loading ? '...' : pending.length})</TabsTrigger>
                        <TabsTrigger value="upcoming">Upcoming ({loading ? '...' : upcomingConfirmed.length})</TabsTrigger>
                        <TabsTrigger value="history">History</TabsTrigger>
                    </TabsList>

                    <TabsContent value="pending">
                        {loading ? (
                            <div>{[...Array(2)].map((_, i) => renderSkeletonCard(i))}</div>
                        ) : pending.length > 0 ? (
                            pending.map(renderAppointmentCard)
                        ) : (
                            <p className="text-muted-foreground mt-6 text-center">No pending appointment requests.</p>
                        )}
                    </TabsContent>

                    <TabsContent value="upcoming">
                         {loading ? (
                             <div>{[...Array(3)].map((_, i) => renderSkeletonCard(i+2))}</div>
                         ) : upcomingConfirmed.length > 0 ? (
                            upcomingConfirmed.map(renderAppointmentCard)
                        ) : (
                            <p className="text-muted-foreground mt-6 text-center">No upcoming confirmed appointments.</p>
                        )}
                    </TabsContent>

                     <TabsContent value="history">
                         {loading ? (
                             <div>{[...Array(4)].map((_, i) => renderSkeletonCard(i+5))}</div>
                         ) : pastCancelled.length > 0 ? (
                            pastCancelled.map(renderAppointmentCard)
                        ) : (
                            <p className="text-muted-foreground mt-6 text-center">No past or cancelled appointments found.</p>
                        )}
                    </TabsContent>
                </Tabs>
            </div>
        </AppLayout>
    );
}
