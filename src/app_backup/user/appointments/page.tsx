"use client";

import React, { useState, useEffect } from 'react';
import AppLayout from '@/components/layouts/app-layout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Calendar, Video, CheckCircle, Clock, XCircle } from 'lucide-react';
import { format } from 'date-fns';
import Link from 'next/link';
import { Skeleton } from '@/components/ui/skeleton';

interface Appointment {
    id: string;
    professionalId: string;
    professionalName: string;
    professionalField: string;
    dateTime: Date;
    status: 'upcoming' | 'completed' | 'cancelled';
    type: 'Video Call'; // Assuming only video calls for now
}

// Mock data function
const fetchUserAppointments = async (): Promise<Appointment[]> => {
    // TODO: Replace with actual API call
    await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate network delay
    const now = new Date();
    return [
        { id: 'apt1', professionalId: '1', professionalName: 'Alice Smith', professionalField: 'Software Engineering', dateTime: new Date(now.getTime() + 2 * 24 * 60 * 60 * 1000), status: 'upcoming', type: 'Video Call' }, // 2 days from now
        { id: 'apt2', professionalId: '2', professionalName: 'Bob Johnson', professionalField: 'Data Science', dateTime: new Date(now.getTime() + 5 * 24 * 60 * 60 * 1000), status: 'upcoming', type: 'Video Call' }, // 5 days from now
        { id: 'apt3', professionalId: '1', professionalName: 'Alice Smith', professionalField: 'Software Engineering', dateTime: new Date(now.getTime() - 3 * 24 * 60 * 60 * 1000), status: 'completed', type: 'Video Call' }, // 3 days ago
        { id: 'apt4', professionalId: '2', professionalName: 'Bob Johnson', professionalField: 'Data Science', dateTime: new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000), status: 'completed', type: 'Video Call' }, // 7 days ago
        { id: 'apt5', professionalId: '1', professionalName: 'Alice Smith', professionalField: 'Software Engineering', dateTime: new Date(now.getTime() + 1 * 24 * 60 * 60 * 1000), status: 'cancelled', type: 'Video Call' }, // tomorrow, cancelled
    ];
};


export default function UserAppointmentsPage() {
    const [appointments, setAppointments] = useState<Appointment[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const loadAppointments = async () => {
            setLoading(true);
            const fetchedAppointments = await fetchUserAppointments();
            // Sort appointments within each status category by date
            fetchedAppointments.sort((a, b) => {
                 if (a.status === 'upcoming' && b.status !== 'upcoming') return -1;
                 if (a.status !== 'upcoming' && b.status === 'upcoming') return 1;
                 if (a.status === 'completed' && b.status === 'cancelled') return -1;
                 if (a.status === 'cancelled' && b.status === 'completed') return 1;
                 // Within the same status, sort by date (upcoming: soonest first, others: latest first)
                 return a.status === 'upcoming' ? a.dateTime.getTime() - b.dateTime.getTime() : b.dateTime.getTime() - a.dateTime.getTime();
            });
            setAppointments(fetchedAppointments);
            setLoading(false);
        };
        loadAppointments();
    }, []);

    const renderAppointmentCard = (apt: Appointment) => (
        <Card key={apt.id} className="mb-4 shadow hover:shadow-md transition-shadow duration-200">
            <CardHeader className="flex flex-row justify-between items-start pb-2">
                 <div>
                   <CardTitle className="text-lg">{apt.professionalName}</CardTitle>
                   <CardDescription>{apt.professionalField}</CardDescription>
                 </div>
                 <span className={`text-xs px-2 py-0.5 rounded-full font-medium flex items-center gap-1 ${
                     apt.status === 'upcoming' ? 'bg-blue-100 text-blue-800' :
                     apt.status === 'completed' ? 'bg-green-100 text-green-800' :
                     'bg-red-100 text-red-800'
                 }`}>
                    {apt.status === 'upcoming' && <Clock size={12} />}
                    {apt.status === 'completed' && <CheckCircle size={12} />}
                    {apt.status === 'cancelled' && <XCircle size={12} />}
                     {apt.status.charAt(0).toUpperCase() + apt.status.slice(1)}
                 </span>
            </CardHeader>
            <CardContent className="flex justify-between items-center pt-2">
                <div>
                   <p className="text-sm flex items-center gap-1"><Calendar size={14} /> {format(apt.dateTime, 'PPP')}</p>
                   <p className="text-sm flex items-center gap-1"><Clock size={14} /> {format(apt.dateTime, 'p')}</p>
                   <p className="text-sm flex items-center gap-1"><Video size={14} /> {apt.type}</p>
                </div>
                {apt.status === 'upcoming' && (
                     <div className="flex gap-2">
                        <Button variant="outline" size="sm">Reschedule</Button> {/* Add functionality */}
                        <Button variant="destructive" size="sm">Cancel</Button> {/* Add functionality */}
                        <Button size="sm" asChild>
                           <Link href={`/user/video/${apt.id}`}>Join Call</Link> {/* Link to video call */}
                        </Button>
                     </div>
                 )}
                 {apt.status === 'completed' && (
                      <Button variant="outline" size="sm">View Details</Button> /* Or Rate Session */
                 )}
                  {apt.status === 'cancelled' && (
                      <Button variant="link" size="sm" disabled>Cancelled</Button>
                 )}
            </CardContent>
        </Card>
    );

     const renderSkeletonCard = (key: number) => (
         <Card key={key} className="mb-4 shadow">
             <CardHeader className="flex flex-row justify-between items-start pb-2">
                 <div>
                   <Skeleton className="h-5 w-32 mb-1" />
                   <Skeleton className="h-4 w-24" />
                 </div>
                 <Skeleton className="h-5 w-20 rounded-full" />
             </CardHeader>
             <CardContent className="flex justify-between items-center pt-2">
                 <div className="space-y-1">
                    <Skeleton className="h-4 w-36" />
                    <Skeleton className="h-4 w-20" />
                    <Skeleton className="h-4 w-24" />
                 </div>
                 <Skeleton className="h-9 w-24 rounded-md" />
             </CardContent>
         </Card>
     );

    const upcoming = appointments.filter(a => a.status === 'upcoming');
    const past = appointments.filter(a => a.status === 'completed' || a.status === 'cancelled');

    return (
        <AppLayout userType="user">
            <div className="container mx-auto py-8">
                <h1 className="text-3xl font-bold mb-6">My Appointments</h1>

                <Tabs defaultValue="upcoming" className="w-full">
                    <TabsList className="grid w-full grid-cols-2 md:w-[400px] mb-6">
                        <TabsTrigger value="upcoming">Upcoming</TabsTrigger>
                        <TabsTrigger value="past">Past & Cancelled</TabsTrigger>
                    </TabsList>
                    <TabsContent value="upcoming">
                        {loading ? (
                            <div>{[...Array(3)].map((_, i) => renderSkeletonCard(i))}</div>
                        ) : upcoming.length > 0 ? (
                            upcoming.map(renderAppointmentCard)
                        ) : (
                            <p className="text-muted-foreground mt-6 text-center">No upcoming appointments scheduled.</p>
                        )}
                    </TabsContent>
                    <TabsContent value="past">
                         {loading ? (
                             <div>{[...Array(3)].map((_, i) => renderSkeletonCard(i+3))}</div>
                         ) : past.length > 0 ? (
                            past.map(renderAppointmentCard)
                        ) : (
                            <p className="text-muted-foreground mt-6 text-center">No past or cancelled appointments found.</p>
                        )}
                    </TabsContent>
                </Tabs>
            </div>
        </AppLayout>
    );
}
