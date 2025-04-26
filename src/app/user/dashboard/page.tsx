
import AppLayout from '@/components/layouts/app-layout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { Calendar, MessageSquare, Search, Video } from 'lucide-react';

export default function UserDashboardPage() {
  // TODO: Fetch actual user data, upcoming appointments, recent chats etc.
  const upcomingAppointments = [
    { id: 1, professional: 'Dr. Bob Johnson', field: 'Data Science', time: 'Tomorrow at 2:00 PM', type: 'Video Call' },
    { id: 2, professional: 'Alice Smith', field: 'Software Engineering', time: 'July 25th at 10:00 AM', type: 'Video Call' },
  ];
  const recentChats = [
    { id: 1, professional: 'AI Counselor', preview: 'Okay, based on our chat, I recommend connecting with...', unread: 0 },
    { id: 2, professional: 'Alice Smith', preview: 'Thanks for the advice!', unread: 1 },
  ];

  return (
    <AppLayout userType="user">
      <div className="container mx-auto py-8" data-testid="user-dashboard-container">
        <h1 className="text-3xl font-bold mb-6" data-testid="user-dashboard-welcome">Welcome, Alice!</h1> {/* TODO: Use dynamic name */}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8" data-testid="user-dashboard-cards">
          <Card className="shadow-lg hover:shadow-xl transition-shadow duration-300 bg-primary text-primary-foreground" data-testid="card-find-professional">
            <CardHeader>
              <CardTitle className="text-xl flex items-center gap-2"><Search className="h-5 w-5"/> Find a Professional</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription className="text-primary-foreground/80 mb-4">Ready to connect with an expert? Browse profiles and filter by field.</CardDescription>
              <Button variant="secondary" asChild data-testid="find-professional-button">
                <Link href="/user/find-professional">Search Now</Link>
              </Button>
            </CardContent>
          </Card>
          <Card className="shadow-lg hover:shadow-xl transition-shadow duration-300" data-testid="card-my-appointments">
            <CardHeader>
              <CardTitle className="text-xl flex items-center gap-2"><Calendar className="h-5 w-5"/> My Appointments</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription className="mb-4">View your scheduled video calls and manage your bookings.</CardDescription>
              <Button variant="outline" asChild data-testid="view-schedule-button">
                <Link href="/user/appointments">View Schedule</Link>
              </Button>
            </CardContent>
          </Card>
           <Card className="shadow-lg hover:shadow-xl transition-shadow duration-300" data-testid="card-ai-counselor">
            <CardHeader>
              <CardTitle className="text-xl flex items-center gap-2"><MessageSquare className="h-5 w-5"/> AI Counselor</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription className="mb-4">Get guidance and professional suggestions from our AI assistant.</CardDescription>
              <Button variant="outline" asChild data-testid="chat-with-ai-button">
                <Link href="/user/chat/ai">Chat with AI</Link>
              </Button>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6" data-testid="user-dashboard-lists">
          <Card className="shadow" data-testid="upcoming-appointments-list">
            <CardHeader>
              <CardTitle>Upcoming Appointments</CardTitle>
            </CardHeader>
            <CardContent>
              {upcomingAppointments.length > 0 ? (
                <ul className="space-y-4">
                  {upcomingAppointments.map(apt => (
                    <li key={apt.id} className="flex justify-between items-start p-3 border rounded-md bg-muted/50" data-testid={`upcoming-apt-${apt.id}`}>
                      <div>
                        <p className="font-semibold">{apt.professional}</p>
                        <p className="text-sm text-muted-foreground">{apt.field}</p>
                        <p className="text-sm text-muted-foreground">{apt.time}</p>
                      </div>
                      <Button variant="ghost" size="sm" className="mt-1">Details</Button> {/* Link to appointment details */}
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-muted-foreground" data-testid="no-upcoming-appointments">No upcoming appointments.</p>
              )}
               <Button variant="link" className="mt-4 p-0 h-auto" asChild data-testid="view-all-appointments-link">
                 <Link href="/user/appointments">View all appointments</Link>
               </Button>
            </CardContent>
          </Card>

          <Card className="shadow" data-testid="recent-chats-list">
            <CardHeader>
              <CardTitle>Recent Chats</CardTitle>
            </CardHeader>
            <CardContent>
              {recentChats.length > 0 ? (
                <ul className="space-y-4">
                  {recentChats.map(chat => (
                    <li key={chat.id} className="flex justify-between items-start p-3 border rounded-md hover:bg-muted/50 cursor-pointer" data-testid={`recent-chat-${chat.id}`}> {/* Make clickable */}
                     <Link href={`/user/chat/${chat.professional === 'AI Counselor' ? 'ai' : chat.id}`} className="w-full">
                       <div className="flex justify-between items-start w-full">
                          <div>
                            <p className="font-semibold">{chat.professional}</p>
                            <p className="text-sm text-muted-foreground truncate max-w-xs">{chat.preview}</p>
                          </div>
                          {chat.unread > 0 && (
                            <span className="bg-primary text-primary-foreground text-xs font-bold rounded-full px-2 py-0.5 ml-2" data-testid={`unread-badge-${chat.id}`}>
                              {chat.unread}
                            </span>
                          )}
                       </div>
                      </Link>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-muted-foreground" data-testid="no-recent-chats">No recent chats.</p>
              )}
               <Button variant="link" className="mt-4 p-0 h-auto" asChild data-testid="view-all-chats-link">
                  <Link href="/user/chat">View all chats</Link>
               </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </AppLayout>
  );
}

