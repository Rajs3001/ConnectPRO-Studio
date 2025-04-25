/**
 * Represents an available time slot for scheduling appointments.
 */
export interface TimeSlot {
  /**
   * The start time of the time slot (e.g., '09:00').
   */
  startTime: string;
  /**
   * The end time of the time slot (e.g., '10:00').
   */
  endTime: string;
}

/**
 * Asynchronously retrieves available time slots for a given professional on a specific date.
 *
 * @param professionalId The ID of the professional.
 * @param date The date for which to retrieve available time slots (e.g., '2024-07-22').
 * @returns A promise that resolves to an array of TimeSlot objects.
 */
export async function getAvailableTimeSlots(
  professionalId: string,
  date: string
): Promise<TimeSlot[]> {
  // TODO: Implement this by calling an API.

  return [
    {
      startTime: '09:00',
      endTime: '10:00',
    },
    {
      startTime: '11:00',
      endTime: '12:00',
    },
    {
      startTime: '14:00',
      endTime: '15:00',
    },
  ];
}
