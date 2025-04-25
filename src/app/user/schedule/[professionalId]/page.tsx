"use client";

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Calendar } from "@/components/ui/calendar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { getAvailableTimeSlots, TimeSlot } from '@/services/scheduling';
import { getProfessionals, Professional } from '@/services/professional'; // Assuming a function to get single professional
import { format } from 'date-fns';
import AppLayout from '@/components/layouts/app-layout';
import { useToast } from "@/hooks/use-toast";
import { Skeleton } from '@/components/ui/skeleton';
import { ChevronLeft } from 'lucide-react';

export default function ScheduleAppointmentPage() {
  const params = useParams();
  const router = useRouter();
  const { toast } = useToast();
  const professionalId = params.professionalId as string;

  const [professional, setProfessional] = useState<Professional | null>(null);
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());
  const [availableSlots, setAvailableSlots] = useState<TimeSlot[]>([]);
  const [selectedSlot, setSelectedSlot] = useState<TimeSlot | null>(null);
  const [loadingProfessional, setLoadingProfessional] = useState(true);
  const [loadingSlots, setLoadingSlots] = useState(false);
  const [booking, setBooking] = useState(false);

  useEffect(() => {
    const fetchProfessionalDetails = async () => {
      if (!professionalId) return;
      setLoadingProfessional(true);
      try {
        // In a real app, you'd fetch a single professional by ID
        // Simulating this by filtering the list
        const allPros = await getProfessionals({});
        const pro = allPros.find(p => p.id === professionalId);
        setProfessional(pro || null);
      } catch (error) {
        console.error("Failed to fetch professional details:", error);
        toast({ variant: "destructive", title: "Error", description: "Could not load professional details." });
      } finally {
        setLoadingProfessional(false);
      }
    };
    fetchProfessionalDetails();
  }, [professionalId, toast]);

  useEffect(() => {
    const fetchSlots = async () => {
      if (!selectedDate || !professionalId) return;
      setLoadingSlots(true);
      setSelectedSlot(null); // Reset selected slot when date changes
      try {
        const dateString = format(selectedDate, 'yyyy-MM-dd');
        const slots = await getAvailableTimeSlots(professionalId, dateString);
        setAvailableSlots(slots);
      } catch (error) {
        console.error("Failed to fetch time slots:", error);
        toast({ variant: "destructive", title: "Error", description: "Could not load available slots." });
        setAvailableSlots([]);
      } finally {
        setLoadingSlots(false);
      }
    };
    fetchSlots();
  }, [selectedDate, professionalId, toast]);

  const handleBooking = async () => {
    if (!selectedSlot || !selectedDate || !professional) return;
    setBooking(true);
    console.log('Booking appointment:', {
      professionalId: professional.id,
      professionalName: professional.name,
      date: format(selectedDate, 'yyyy-MM-dd'),
      startTime: selectedSlot.startTime,
      endTime: selectedSlot.endTime,
    });

    // TODO: Implement actual booking API call
    await new Promise(resolve => setTimeout(resolve, 1500));

    // Placeholder success
    const bookingSuccess = true;

    if (bookingSuccess) {
      toast({
        title: "Appointment Booked!",
        description: `Scheduled video call with ${professional.name} on ${format(selectedDate, 'PPP')} at ${selectedSlot.startTime}.`,
      });
      router.push('/user/appointments'); // Redirect to appointments page
    } else {
      toast({
        variant: "destructive",
        title: "Booking Failed",
        description: "Could not book the appointment. Please try again.",
      });
      setBooking(false);
    }
  };

  return (
    <AppLayout userType="user">
      <div className="container mx-auto py-8">
         <Button variant="outline" size="sm" className="mb-4" onClick={() => router.back()}>
            <ChevronLeft className="mr-1 h-4 w-4" /> Back to Professionals
         </Button>

        {loadingProfessional ? (
           <Card className="mb-8 shadow">
              <CardHeader><Skeleton className="h-6 w-3/4" /></CardHeader>
              <CardContent><Skeleton className="h-4 w-1/2" /></CardContent>
           </Card>
        ) : professional ? (
          <Card className="mb-8 shadow-lg">
            <CardHeader>
              <CardTitle className="text-2xl">Schedule a Video Call with {professional.name}</CardTitle>
              <CardDescription>{professional.field} - {professional.description}</CardDescription>
            </CardHeader>
          </Card>
        ) : (
          <Card className="mb-8 shadow">
            <CardHeader>
              <CardTitle className="text-destructive">Professional Not Found</CardTitle>
              <CardDescription>The requested professional could not be loaded.</CardDescription>
            </CardHeader>
           </Card>
        )}

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="md:col-span-1">
            <Card className="shadow">
              <CardHeader>
                <CardTitle>Select a Date</CardTitle>
              </CardHeader>
              <CardContent className="flex justify-center">
                <Calendar
                  mode="single"
                  selected={selectedDate}
                  onSelect={setSelectedDate}
                  disabled={(date) => date < new Date(new Date().setHours(0,0,0,0))} // Disable past dates
                  initialFocus
                />
              </CardContent>
            </Card>
          </div>

          <div className="md:col-span-2">
            <Card className="shadow">
              <CardHeader>
                <CardTitle>Available Time Slots</CardTitle>
                <CardDescription>
                  {selectedDate ? `Showing slots for ${format(selectedDate, 'PPP')}` : 'Select a date to see available slots'}
                </CardDescription>
              </CardHeader>
              <CardContent>
                {loadingSlots ? (
                   <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                      {[...Array(6)].map((_, i) => <Skeleton key={i} className="h-10 w-full rounded-md" />)}
                   </div>
                ) : availableSlots.length > 0 ? (
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                    {availableSlots.map((slot) => (
                      <Button
                        key={slot.startTime}
                        variant={selectedSlot === slot ? 'default' : 'outline'}
                        onClick={() => setSelectedSlot(slot)}
                        disabled={booking}
                        className="transition-colors duration-200"
                      >
                        {slot.startTime} - {slot.endTime}
                      </Button>
                    ))}
                  </div>
                ) : (
                  <p className="text-muted-foreground">
                    No available slots for this date. Please select another date.
                  </p>
                )}

                {selectedSlot && selectedDate && professional && (
                  <div className="mt-8 pt-6 border-t">
                    <h3 className="text-lg font-semibold mb-2">Confirm Booking</h3>
                    <p className="mb-4">
                      You are booking a video call with <span className="font-medium">{professional.name}</span> on{' '}
                      <span className="font-medium">{format(selectedDate, 'PPP')}</span> at{' '}
                      <span className="font-medium">{selectedSlot.startTime}</span>.
                    </p>
                    <Button
                      onClick={handleBooking}
                      disabled={!selectedSlot || booking}
                      size="lg"
                      className="w-full sm:w-auto"
                    >
                      {booking ? 'Booking...' : 'Confirm Appointment'}
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}


