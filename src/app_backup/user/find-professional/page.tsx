"use client";

import type { Professional } from '@/services/professional';
import { getProfessionals } from '@/services/professional';
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation'; // Import useRouter
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { MessageSquare, User, Video } from 'lucide-react';
import Link from 'next/link';
import { Skeleton } from '@/components/ui/skeleton';
import AppLayout from '@/components/layouts/app-layout';
import { useAuth } from '@/hooks/useAuth'; // Import useAuth
import SiteLoader from '@/components/shared/site-loader'; // Import SiteLoader

// Example fields, sync with signup
const professionalFields = [
  "All Fields",
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

export default function FindProfessionalPage() {
  const { user, loading: authLoading } = useAuth(); // Get user and loading status
  const router = useRouter(); // Initialize router
  const [professionals, setProfessionals] = useState<Professional[]>([]);
  const [filteredProfessionals, setFilteredProfessionals] = useState<Professional[]>([]);
  const [loadingData, setLoadingData] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedField, setSelectedField] = useState('All Fields');

  // Effect to check authentication and redirect if necessary
  useEffect(() => {
    if (!authLoading && !user) {
      // Redirect to login page if not authenticated and auth check is complete
      console.log("FindProfessionalPage: User not authenticated, redirecting to login.");
      router.push('/login/user?redirect=/user/find-professional');
    }
  }, [user, authLoading, router]);

  // Effect to fetch professionals data only if authenticated
  useEffect(() => {
    const fetchProfessionals = async () => {
      if (!user) return; // Don't fetch if not authenticated
      setLoadingData(true);
      try {
        const fetchedProfessionals = await getProfessionals({});
        setProfessionals(fetchedProfessionals);
        setFilteredProfessionals(fetchedProfessionals); // Initial population
      } catch (error) {
        console.error("Failed to fetch professionals:", error);
        // Handle error state, maybe show a toast
      } finally {
        setLoadingData(false);
      }
    };

    if (user && !authLoading) { // Fetch only when user is confirmed and auth loading is done
      fetchProfessionals();
    }
  }, [user, authLoading]); // Depend on user and authLoading

  // Effect to filter professionals based on search term and selected field
  useEffect(() => {
    if (!user) return; // Don't filter if not authenticated

    let results = professionals;

    if (selectedField !== 'All Fields') {
      results = results.filter(p => p.field === selectedField);
    }

    if (searchTerm) {
      const lowerSearchTerm = searchTerm.toLowerCase();
      results = results.filter(p =>
        p.name.toLowerCase().includes(lowerSearchTerm) ||
        p.description.toLowerCase().includes(lowerSearchTerm) ||
        p.skills.some(skill => skill.toLowerCase().includes(lowerSearchTerm))
      );
    }

    setFilteredProfessionals(results);
  }, [searchTerm, selectedField, professionals, user]);

  // Show loading state while checking auth or fetching data
  if (authLoading || (user && loadingData)) {
    return (
        <AppLayout userType="user">
            <div className="container mx-auto py-8 flex justify-center items-center min-h-[calc(100vh-200px)]">
                <SiteLoader size="lg" />
            </div>
        </AppLayout>
    );
  }

  // If user is definitely not logged in (after auth check), show nothing or redirect message
  if (!user && !authLoading) {
     // router.push already called, show minimal content or null
     return (
        <div className="flex items-center justify-center min-h-screen bg-background">
            <p className="text-muted-foreground">Redirecting to login...</p>
         </div>
      );
  }

  // Render the main content only if authenticated and data loaded
  return (
    <AppLayout userType="user">
        <div className="container mx-auto py-8 px-4 md:px-0" data-testid="find-professional-page">
            <h1 className="text-3xl font-bold mb-6" data-testid="page-title">Find a Professional</h1>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8 p-4 bg-muted rounded-lg shadow" data-testid="filter-controls">
                 <Input
                    placeholder="Search by name, skill, or keyword..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="md:col-span-2"
                    data-testid="search-input"
                  />
                 <Select onValueChange={setSelectedField} value={selectedField} data-testid="field-select">
                    <SelectTrigger>
                      <SelectValue placeholder="Filter by field" />
                    </SelectTrigger>
                    <SelectContent>
                      {professionalFields.map((field) => (
                        <SelectItem key={field} value={field}>{field}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
            </div>

             {loadingData ? ( // Show skeleton only while loading data (after auth check)
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6" data-testid="professionals-skeleton">
                    {[...Array(6)].map((_, index) => (
                         <Card key={index} className="shadow-lg">
                             <CardHeader>
                                 <div className="flex items-center gap-4">
                                      <Skeleton className="h-12 w-12 rounded-full" />
                                     <div className="space-y-2">
                                        <Skeleton className="h-4 w-[150px]" />
                                        <Skeleton className="h-3 w-[100px]" />
                                     </div>
                                 </div>
                            </CardHeader>
                            <CardContent className="space-y-3">
                                <Skeleton className="h-4 w-full" />
                                <Skeleton className="h-4 w-[80%]" />
                                 <div className="flex flex-wrap gap-2 pt-2">
                                     <Skeleton className="h-6 w-[70px] rounded-full" />
                                     <Skeleton className="h-6 w-[90px] rounded-full" />
                                     <Skeleton className="h-6 w-[60px] rounded-full" />
                                 </div>
                            </CardContent>
                            <CardFooter className="flex justify-end gap-2">
                                 <Skeleton className="h-9 w-24 rounded-md" />
                                 <Skeleton className="h-9 w-24 rounded-md" />
                            </CardFooter>
                        </Card>
                     ))}
                 </div>
             ) : filteredProfessionals.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6" data-testid="professionals-grid">
                 {filteredProfessionals.map((pro) => (
                    <Card key={pro.id} className="flex flex-col justify-between shadow-lg hover:shadow-xl transition-shadow duration-300" data-testid={`professional-card-${pro.id}`}>
                      <CardHeader>
                        <div className="flex items-center gap-4">
                          <User className="h-10 w-10 text-primary" /> {/* Placeholder Icon */}
                          <div>
                            <CardTitle className="text-xl" data-testid="pro-name">{pro.name}</CardTitle>
                            <CardDescription data-testid="pro-field">{pro.field}</CardDescription>
                          </div>
                        </div>
                      </CardHeader>
                      <CardContent className="flex-grow">
                        <p className="text-sm text-muted-foreground mb-3" data-testid="pro-description">{pro.description}</p>
                        <div className="flex flex-wrap gap-2" data-testid="pro-skills">
                          {pro.skills.map((skill) => (
                            <Badge key={skill} variant="secondary">{skill}</Badge>
                          ))}
                        </div>
                      </CardContent>
                      <CardFooter className="flex justify-end gap-2">
                        <Button variant="outline" size="sm" asChild data-testid="pro-chat-button">
                          <Link href={`/user/chat/${pro.id}`}>
                            <MessageSquare className="mr-1 h-4 w-4"/> Chat
                           </Link>
                         </Button>
                        <Button variant="default" size="sm" asChild data-testid="pro-schedule-button">
                           <Link href={`/user/schedule/${pro.id}`}>
                            <Video className="mr-1 h-4 w-4"/> Schedule Call
                           </Link>
                        </Button>
                      </CardFooter>
                    </Card>
                  ))}
                </div>
             ) : (
                <div className="text-center py-16 text-muted-foreground" data-testid="no-professionals-message">
                  <p>No professionals found matching your criteria.</p>
                </div>
             )}
        </div>
     </AppLayout>
  );
}
