
"use client";

import React from 'react';
import { useParams, useRouter } from 'next/navigation';
import CommunityProfileSection from '@/components/community/ProfileSection'; // Reuse the profile section component
import { Button } from '@/components/ui/button';
import { ChevronLeft } from 'lucide-react';

// This page will display a specific user's community profile.
// It might reuse the `CommunityProfileSection` but could potentially
// fetch different data (public view vs. own view) or have a slightly different layout.

export default function ViewCommunityProfilePage() {
  const params = useParams();
  const profileId = params.profileId as string;
  const router = useRouter();

  // TODO: Fetch public profile data based on profileId
  // For now, we'll just render the same mock profile section for demo.
  // In a real app, `CommunityProfileSection` would need to accept a profileId prop
  // and fetch the correct data, potentially hiding edit buttons if it's not the current user.

  console.log("Viewing profile for ID:", profileId);

  return (
    <div className="bg-background min-h-screen" data-testid={`view-profile-page-${profileId}`}>
      {/* Simple Header for Profile View */}
      <header className="sticky top-0 z-40 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60" data-testid="view-profile-header">
        <div className="container mx-auto flex h-16 items-center justify-between px-4 md:px-6">
          <Button variant="ghost" size="icon" onClick={() => router.back()} data-testid="view-profile-back-button">
            <ChevronLeft size={20} />
          </Button>
          <h1 className="text-lg font-semibold" data-testid="view-profile-title">Profile</h1>
          <div>{/* Placeholder */}</div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto py-8 max-w-4xl" data-testid="view-profile-main-content">
        {/* Render the profile section - pass profileId and potentially a 'viewOnly' prop */}
        <CommunityProfileSection profileId={profileId} viewOnly={true} /> {/* Pass profileId and viewOnly flag */}
      </main>
    </div>
  );
}

