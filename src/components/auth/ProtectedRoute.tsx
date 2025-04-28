
"use client";

import React, { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';
import SiteLoader from '@/components/shared/site-loader';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requireCommunityProfile?: boolean; // New prop to enforce community profile check
}

const publicPaths = [
  '/', // Landing page
  '/login/user',
  '/login/professional',
  '/signup/user',
  '/signup/professional',
  '/community/join', // Explicitly public
  '/privacy', // Example public pages
  '/terms',
  '/contact',
];

const authPaths = [
  '/login/user',
  '/login/professional',
  '/signup/user',
  '/signup/professional',
];

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children, requireCommunityProfile = false }) => {
  const { user, loading: authLoading, communityProfileExists } = useAuth(); // Renamed loading to authLoading
  const router = useRouter();
  const pathname = usePathname();
  const [isChecking, setIsChecking] = useState(true); // Use separate checking state

  useEffect(() => {
    console.log("ProtectedRoute Effect:", { authLoading, user: !!user, pathname, communityProfileExists, requireCommunityProfile });

    if (authLoading) {
      console.log("ProtectedRoute: Auth loading, waiting...");
      setIsChecking(true);
      return; // Wait for auth state to resolve
    }

    const pathIsPublic = publicPaths.some(publicPath => pathname === publicPath || (publicPath !== '/' && pathname.startsWith(publicPath)));
    const pathIsAuth = authPaths.some(authPath => pathname === authPath);

    console.log("ProtectedRoute Checks:", { pathIsPublic, pathIsAuth });

    if (!user) {
      // User is not logged in
      if (!pathIsPublic && !pathIsAuth) {
        console.log(`ProtectedRoute: Not logged in, accessing protected route "${pathname}". Redirecting.`);
        const redirectPath = pathname.startsWith('/professional') ? '/login/professional' : '/login/user';
        router.replace(`${redirectPath}?redirect=${pathname}`);
        return; // Keep checking true until redirect happens
      }
    } else {
      // User is logged in
      if (pathIsAuth) {
        // If logged in and trying to access login/signup, redirect to dashboard
        console.log(`ProtectedRoute: Logged in, accessing auth route "${pathname}". Redirecting to dashboard.`);
        const dashboardPath = pathname.includes('professional') ? '/professional/dashboard' : '/user/dashboard';
        router.replace(dashboardPath);
        return; // Keep checking true until redirect happens
      }

      // Check for community profile if required for this route
      if (requireCommunityProfile) {
         if (communityProfileExists === null) {
            console.log("ProtectedRoute: Community profile check in progress...");
            setIsChecking(true); // Still checking community profile
            return;
         } else if (communityProfileExists === false) {
             console.log(`ProtectedRoute: Community profile required for "${pathname}" but not found. Redirecting to /community/join.`);
             router.replace('/community/join');
             return; // Keep checking true until redirect happens
         }
         // If communityProfileExists is true, continue
          console.log("ProtectedRoute: Community profile check passed.");
      }
    }

    // If all checks pass or path is public/auth (and community check passed if required), allow rendering
    console.log("ProtectedRoute: Checks passed, allowing access.");
    setIsChecking(false);

  }, [user, authLoading, pathname, router, communityProfileExists, requireCommunityProfile]);

  if (isChecking || authLoading) {
    // Show a loader while checking authentication or community profile status
    return (
      <div className="flex items-center justify-center min-h-screen bg-background" data-testid="protected-route-loader">
        <SiteLoader size="lg" />
      </div>
    );
  }

  // Render children if checks passed
  return <>{children}</>;
};

export default ProtectedRoute;
