
"use client";

import ProtectedRoute from '@/components/auth/ProtectedRoute';
import React from 'react';

// This layout wraps all authenticated community pages (feed, groups, messages, profile)
// It ensures the user is logged in AND has a community profile.
export default function AuthenticatedCommunityLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    // Use ProtectedRoute with specific check for community access
    <ProtectedRoute requireCommunityProfile={true}>
      {children}
    </ProtectedRoute>
  );
}
