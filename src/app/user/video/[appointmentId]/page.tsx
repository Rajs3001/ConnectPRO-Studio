"use client";

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import AppLayout from '@/components/layouts/app-layout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { Video, VideoOff, Mic, MicOff, PhoneOff, ChevronLeft } from 'lucide-react';

// TODO: Replace with actual appointment fetching logic
interface MockAppointment {
    id: string;
    professionalName: string;
    startTime: Date;
}

const getMockAppointment = async (id: string): Promise<MockAppointment | null> => {
    await new Promise(resolve => setTimeout(resolve, 500)); // Simulate fetch
    if (id === 'apt1') return { id: 'apt1', professionalName: 'Alice Smith', startTime: new Date(Date.now() + 2 * 60 * 1000) }; // Starts in 2 mins
    if (id === 'apt101') return { id: 'apt101', professionalName: 'You (Professional View)', startTime: new Date(Date.now() + 2 * 60 * 1000) }; // Starts in 2 mins
    return null;
};

export default function VideoCallPage() {
    const params = useParams();
    const router = useRouter();
    const appointmentId = params.appointmentId as string;

    const [appointment, setAppointment] = useState<MockAppointment | null>(null);
    const [loading, setLoading] = useState(true);
    const [isVideoOn, setIsVideoOn] = useState(true);
    const [isMicOn, setIsMicOn] = useState(true);
    const [callStatus, setCallStatus] = useState<'connecting' | 'connected' | 'ended'>('connecting');

    useEffect(() => {
        const fetchAppointment = async () => {
            setLoading(true);
            const fetchedApt = await getMockAppointment(appointmentId);
            setAppointment(fetchedApt);
            setLoading(false);
             // Simulate connection attempt
             if (fetchedApt) {
                 setTimeout(() => setCallStatus('connected'), 2000);
             }
        };
        fetchAppointment();
    }, [appointmentId]);

     const handleEndCall = () => {
         setCallStatus('ended');
         // TODO: Add actual call ending logic (API call, cleanup)
         console.log('Ending call for appointment:', appointmentId);
         // Redirect after a short delay
         setTimeout(() => {
             // Redirect based on who ended the call (or just go back)
             router.back(); // Or router.push('/user/appointments');
         }, 1500);
     };

    if (loading) {
        return (
            <AppLayout userType="user"> {/* Adjust userType if needed */}
                <div className="container mx-auto py-8 flex flex-col items-center justify-center h-[calc(100vh-theme(space.28))]">
                    <Skeleton className="h-8 w-48 mb-4" />
                    <Skeleton className="h-[400px] w-full max-w-2xl mb-4 rounded-lg" />
                    <Skeleton className="h-12 w-64 rounded-lg" />
                </div>
            </AppLayout>
        );
    }

    if (!appointment) {
        return (
             <AppLayout userType="user"> {/* Adjust userType if needed */}
                 <div className="container mx-auto py-8 text-center">
                      <Button variant="outline" size="sm" className="mb-4" onClick={() => router.back()}>
                          <ChevronLeft className="mr-1 h-4 w-4" /> Back
                      </Button>
                     <h1 className="text-2xl font-bold text-destructive">Appointment Not Found</h1>
                     <p className="text-muted-foreground">Could not load details for this video call.</p>
                 </div>
            </AppLayout>
        );
    }

    return (
        <AppLayout userType="user"> {/* Adjust userType if needed */}
            <div className="container mx-auto py-8 flex flex-col items-center h-[calc(100vh-theme(space.28))]">
                <h1 className="text-2xl font-bold mb-2">Video Call with {appointment.professionalName}</h1>
                <p className="text-sm text-muted-foreground mb-4">Status: <span className={callStatus === 'connected' ? 'text-green-600' : 'text-yellow-600'}>{callStatus.charAt(0).toUpperCase() + callStatus.slice(1)}</span></p>

                {/* Placeholder for Video Streams */}
                <div className="relative w-full max-w-4xl aspect-video bg-muted rounded-lg shadow-inner flex items-center justify-center text-muted-foreground overflow-hidden mb-6">
                     {callStatus === 'connecting' && <p>Connecting...</p>}
                     {callStatus === 'connected' && (
                         <>
                            {/* Main Video (Remote) - Placeholder */}
                            <div className="w-full h-full bg-neutral-700 flex items-center justify-center">
                                Remote Video Placeholder
                            </div>
                            {/* Self Video (Local) - Placeholder */}
                            <div className="absolute bottom-4 right-4 w-1/4 aspect-video bg-neutral-800 border-2 border-muted rounded-md flex items-center justify-center text-xs">
                                {isVideoOn ? 'Your Video' : 'Video Off'}
                             </div>
                         </>
                     )}
                     {callStatus === 'ended' && <p>Call Ended</p>}
                </div>


                {/* Call Controls */}
                 {callStatus !== 'ended' && (
                    <div className="flex items-center gap-4 p-4 bg-background border rounded-lg shadow-md">
                        <Button
                            variant={isMicOn ? "outline" : "destructive"}
                            size="icon"
                            onClick={() => setIsMicOn(!isMicOn)}
                            aria-label={isMicOn ? "Mute Microphone" : "Unmute Microphone"}
                        >
                            {isMicOn ? <Mic /> : <MicOff />}
                        </Button>
                        <Button
                            variant={isVideoOn ? "outline" : "destructive"}
                            size="icon"
                            onClick={() => setIsVideoOn(!isVideoOn)}
                            aria-label={isVideoOn ? "Turn Off Camera" : "Turn On Camera"}
                        >
                             {isVideoOn ? <Video /> : <VideoOff />}
                        </Button>
                        <Button
                            variant="destructive"
                            size="icon"
                            onClick={handleEndCall}
                            aria-label="End Call"
                        >
                            <PhoneOff />
                        </Button>
                    </div>
                 )}
                  {callStatus === 'ended' && (
                      <p className="text-muted-foreground">Redirecting shortly...</p>
                  )}
            </div>
        </AppLayout>
    );
}
