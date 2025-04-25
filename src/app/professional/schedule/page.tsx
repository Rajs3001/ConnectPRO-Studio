"use client";

import React, { useState, useEffect } from 'react';
import AppLayout from '@/components/layouts/app-layout';
import { Calendar } from "@/components/ui/calendar";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { format, startOfWeek, endOfWeek, eachDayOfInterval, addDays, setHours, setMinutes } from 'date-fns';
import { TimeSlot } from '@/services/scheduling'; // Assuming we reuse this interface
import { useToast } from "@/hooks/use-toast";
import { PlusCircle, Trash2 } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton'; // Added Skeleton

// Example: Standard working hours and slot duration
const DEFAULT_START_HOUR = 9;
const DEFAULT_END_HOUR = 17;
const SLOT_DURATION_MINUTES = 60;

// Generate potential time slots for a day
function generatePotentialSlots(date: Date): TimeSlot[] {
  const slots: TimeSlot[] = [];
  let currentTime = setMinutes(setHours(date, DEFAULT_START_HOUR), 0);
  const endTimeLimit = setMinutes(setHours(date, DEFAULT_END_HOUR), 0);

  while (currentTime < endTimeLimit) {
    const slotEnd = new Date(currentTime.getTime() + SLOT_DURATION_MINUTES * 60000); // Use timestamp to avoid mutation issues

    slots.push({
      startTime: format(currentTime, 'HH:mm'),
      endTime: format(slotEnd, 'HH:mm'),
    });
    currentTime = slotEnd;
  }
  return slots;
}

export default function ProfessionalSchedulePage() {
  const { toast } = useToast();
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());
  const [availability, setAvailability] = useState<Record<string, TimeSlot[]>>({}); // Key: 'yyyy-MM-dd', Value: Array of available slots
  const [potentialSlots, setPotentialSlots] = useState<TimeSlot[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [saving, setSaving] = useState(false);

  // Fetch initial availability (mocked)
  useEffect(() => {
    setIsLoading(true);
    // TODO: Replace with actual API call to fetch professional's availability
    console.log("Fetching availability...");
    setTimeout(() => {
      const initialAvailability = {
        [format(new Date(), 'yyyy-MM-dd')]: [
          { startTime: '10:00', endTime: '11:00' },
          { startTime: '14:00', endTime: '15:00' },
        ],
        [format(addDays(new Date(), 1), 'yyyy-MM-dd')]: [
          { startTime: '09:00', endTime: '10:00' },
          { startTime: '11:00', endTime: '12:00' },
          { startTime: '15:00', endTime: '16:00' },
        ],
      };
      setAvailability(initialAvailability);
      setIsLoading(false);
    }, 1000);
  }, []);

  // Update potential slots when selectedDate changes
  useEffect(() => {
    if (selectedDate) {
      setPotentialSlots(generatePotentialSlots(selectedDate));
    } else {
      setPotentialSlots([]);
    }
  }, [selectedDate]);

  const handleSlotToggle = (slot: TimeSlot) => {
    if (!selectedDate) return;
    const dateKey = format(selectedDate, 'yyyy-MM-dd');
    setAvailability(prev => {
      const currentDaySlots = prev[dateKey] || [];
      const isAvailable = currentDaySlots.some(s => s.startTime === slot.startTime);
      let newDaySlots: TimeSlot[];

      if (isAvailable) {
        // Remove the slot
        newDaySlots = currentDaySlots.filter(s => s.startTime !== slot.startTime);
      } else {
        // Add the slot and sort
        newDaySlots = [...currentDaySlots, slot].sort((a, b) => a.startTime.localeCompare(b.startTime));
      }

      // If no slots left for the day, remove the key, otherwise update it
      const newAvailability = { ...prev };
      if (newDaySlots.length === 0) {
        delete newAvailability[dateKey];
      } else {
        newAvailability[dateKey] = newDaySlots;
      }
      return newAvailability;
    });
  };

  const handleSaveAvailability = async () => {
    if (!selectedDate) return;
    setSaving(true);
    const dateKey = format(selectedDate, 'yyyy-MM-dd');
    const slotsToSave = availability[dateKey] || [];
    console.log(`Saving availability for ${dateKey}:`, slotsToSave);

    // TODO: Implement actual API call to save availability
    await new Promise(resolve => setTimeout(resolve, 1500));

    // Placeholder success
    const saveSuccess = true;
    if (saveSuccess) {
       toast({ title: "Availability Updated", description: `Schedule saved for ${format(selectedDate, 'PPP')}.` });
    } else {
        toast({ variant: "destructive", title: "Save Failed", description: "Could not update availability." });
        // Optionally revert state or refetch if save fails
    }
    setSaving(false);
  };

  const selectedDayAvailability = selectedDate ? availability[format(selectedDate, 'yyyy-MM-dd')] || [] : [];

  return (
    <AppLayout userType="professional">
      <div className="container mx-auto py-8">
        <h1 className="text-3xl font-bold mb-6">Manage Your Schedule</h1>
        <Card className="shadow-lg">
            <CardHeader>
                <CardTitle>Set Your Availability</CardTitle>
                <CardDescription>Select a date and toggle the time slots when you are available for video calls.</CardDescription>
            </CardHeader>
            <CardContent className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <div className="md:col-span-1 flex justify-center">
                     <Calendar
                       mode="single"
                       selected={selectedDate}
                       onSelect={setSelectedDate}
                       disabled={(date) => date < new Date(new Date().setHours(0,0,0,0))} // Disable past dates
                       initialFocus
                       className="rounded-md border shadow-inner bg-muted/20 p-3"
                     />
                </div>
                <div className="md:col-span-2">
                    <h3 className="text-lg font-semibold mb-4">
                        {selectedDate ? `Availability for ${format(selectedDate, 'PPP')}` : 'Select a date'}
                    </h3>
                    {isLoading && selectedDate ? (
                       <div className="space-y-3">
                           {[...Array(5)].map((_, i) => (
                             <div key={i} className="flex items-center justify-between p-3 border rounded-md">
                               <Skeleton className="h-5 w-24" />
                               <Skeleton className="h-6 w-12 rounded-md" /> {/* Changed to rounded-md */}
                              </div>
                            ))}
                       </div>
                    ) : selectedDate ? (
                       potentialSlots.length > 0 ? (
                         <div className="space-y-3 max-h-96 overflow-y-auto pr-2">
                            {potentialSlots.map(slot => {
                               const isAvailable = selectedDayAvailability.some(s => s.startTime === slot.startTime);
                               return (
                                <div key={slot.startTime} className="flex items-center justify-between p-3 border rounded-md hover:bg-muted/50 transition-colors">
                                    <Label htmlFor={`slot-${slot.startTime}`} className="cursor-pointer">
                                        {slot.startTime} - {slot.endTime}
                                    </Label>
                                    <Switch
                                        id={`slot-${slot.startTime}`}
                                        checked={isAvailable}
                                        onCheckedChange={() => handleSlotToggle(slot)}
                                        disabled={saving}
                                    />
                                 </div>
                               );
                            })}
                         </div>
                        ) : (
                           <p className="text-muted-foreground">No potential slots generated for this day (check settings).</p>
                        )
                    ) : (
                       <p className="text-muted-foreground">Please select a date from the calendar.</p>
                    )}

                    {selectedDate && (
                       <div className="mt-6 pt-6 border-t">
                           <Button onClick={handleSaveAvailability} disabled={saving || isLoading}>
                               {saving ? 'Saving...' : 'Save Availability for Selected Date'}
                           </Button>
                       </div>
                    )}
                </div>
            </CardContent>
        </Card>
      </div>
    </AppLayout>
  );
}
