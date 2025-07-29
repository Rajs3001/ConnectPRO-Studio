import AppLayout from '@/components/layouts/app-layout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { Calendar, MessageSquare, Settings, Users, Video } from 'lucide-react';

export default function ProfessionalDashboardPage() {
  // TODO: Fetch actual professional data, upcoming appointments, stats, etc.
  const upcomingAppointments = [
    { id: 1, user: 'Alice Student', time: 'Tomorrow at 2:00 PM', status: 'Confirmed' },
    { id: 2, user: 'Charlie User', time: 'July 25th at 10:00 AM', status: 'Pending Confirmation' },
  ];
  const stats = {
    totalAppointments: 42,
    profileViews: 156,
    rating: 4.8,
  };

  return (
    <AppLayout userType="professional">
      <div className="container mx-auto py-8">
        <h1 className="text-3xl font-bold mb-6">Welcome back, Dr. Bob!</h1> {/* TODO: Use dynamic name */}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          <Card className="shadow-lg hover:shadow-xl transition-shadow duration-300">
             <CardHeader>
                <CardTitle className="text-xl">Appointments Today</CardTitle>
                <CardDescription>You have 2 appointments scheduled</CardDescription>
             </CardHeader>
            <CardContent>
                {/* Placeholder: List today's appointments or a summary */}
                <p className="text-sm text-muted-foreground mb-4">10:00 AM - Alice S.</p>
                <p className="text-sm text-muted-foreground mb-4">2:00 PM - Charlie U.</p>
                <Button variant="default" asChild>
                   <Link href="/professional/appointments">View All Appointments</Link>
                </Button>
            </CardContent>
          </Card>
          <Card className="shadow-lg hover:shadow-xl transition-shadow duration-300">
            <CardHeader>
              <CardTitle className="text-xl flex items-center gap-2"><Calendar className="h-5 w-5"/> Manage Schedule</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription className="mb-4">Update your availability and view your calendar.</CardDescription>
              <Button variant="outline" asChild>
                <Link href="/professional/schedule">Go to Calendar</Link>
              </Button>
            </CardContent>
          </Card>
           <Card className="shadow-lg hover:shadow-xl transition-shadow duration-300">
            <CardHeader>
              <CardTitle className="text-xl flex items-center gap-2"><Settings className="h-5 w-5"/> Profile & Settings</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription className="mb-4">Keep your profile information up-to-date.</CardDescription>
              <Button variant="outline" asChild>
                <Link href="/professional/profile">Edit Profile</Link>
              </Button>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card className="shadow">
            <CardHeader>
              <CardTitle>Upcoming Appointments</CardTitle>
            </CardHeader>
            <CardContent>
              {upcomingAppointments.length > 0 ? (
                <ul className="space-y-4">
                  {upcomingAppointments.map(apt => (
                    <li key={apt.id} className="flex justify-between items-start p-3 border rounded-md bg-muted/50">
                      <div>
                        <p className="font-semibold">{apt.user}</p>
                        <p className="text-sm text-muted-foreground">{apt.time}</p>
                      </div>
                      <div className="text-right">
                         <span className={`text-xs px-2 py-0.5 rounded-full ${apt.status === 'Confirmed' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>
                             {apt.status}
                         </span>
                         <Button variant="ghost" size="sm" className="mt-1">Details</Button> {/* Link */}
                      </div>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-muted-foreground">No upcoming appointments.</p>
              )}
               <Button variant="link" className="mt-4 p-0 h-auto" asChild>
                 <Link href="/professional/appointments">View all appointments</Link>
               </Button>
            </CardContent>
          </Card>

          <Card className="shadow">
            <CardHeader>
              <CardTitle>Performance Overview</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
                <div className="flex justify-between items-center">
                   <span className="text-muted-foreground">Total Completed Appointments</span>
                   <span className="font-semibold">{stats.totalAppointments}</span>
                </div>
                 <div className="flex justify-between items-center">
                   <span className="text-muted-foreground">Profile Views (Last 30 days)</span>
                   <span className="font-semibold">{stats.profileViews}</span>
                </div>
                 <div className="flex justify-between items-center">
                   <span className="text-muted-foreground">Average Rating</span>
                   <span className="font-semibold">{stats.rating} / 5.0</span>
                </div>
                {/* Add more stats or charts here */}
                 <Button variant="link" className="mt-2 p-0 h-auto">View Detailed Analytics</Button> {/* Link to analytics page */}
            </CardContent>
          </Card>
        </div>
      </div>
    </AppLayout>
  );
}
