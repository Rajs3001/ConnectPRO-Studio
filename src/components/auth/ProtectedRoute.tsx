
"use client";

import React, { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';
import SiteLoader from '@/components/shared/site-loader';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

const publicPaths = [
  '/', // Landing page
  '/login/user',
  '/login/professional',
  '/signup/user',
  '/signup/professional',
  '/community/join', // Allow access to join page even if not fully profiled
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

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const { user, loading, communityProfileExists } = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  const [isChecking, setIsChecking] = useState(true); // Separate checking state

  useEffect(() => {
    console.log("ProtectedRoute Effect:", { loading, user: !!user, pathname, communityProfileExists });

    if (loading) {
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
        // Determine redirect based on intended area if possible, otherwise default to user login
        const redirectPath = pathname.startsWith('/professional') ? '/login/professional' : '/login/user';
        router.replace(`${redirectPath}?redirect=${pathname}`);
        // Keep checking true until redirect happens
        return;
      }
    } else {
      // User is logged in
      if (pathIsAuth) {
        // If logged in and trying to access login/signup, redirect to dashboard
        console.log(`ProtectedRoute: Logged in, accessing auth route "${pathname}". Redirecting to dashboard.`);
        const dashboardPath = pathname.includes('professional') ? '/professional/dashboard' : '/user/dashboard';
        router.replace(dashboardPath);
        // Keep checking true until redirect happens
        return;
      }

       // Check for community profile if accessing community areas (and not the join page)
       if (pathname.startsWith('/community') && pathname !== '/community/join' && communityProfileExists === false) {
          console.log(`ProtectedRoute: Logged in but no community profile, accessing community route "${pathname}". Redirecting to /community/join.`);
          router.replace('/community/join');
           // Keep checking true until redirect happens
           return;
       }
    }

    // If all checks pass or path is public/auth, allow rendering
    console.log("ProtectedRoute: Checks passed, allowing access.");
    setIsChecking(false);

  }, [user, loading, pathname, router, communityProfileExists]);

  if (isChecking || loading) {
    // Show a loader while checking authentication or if loading is true
    return (
      <div className="flex items-center justify-center min-h-screen bg-background" data-testid="protected-route-loader">
        <SiteLoader size="lg" />
      </div>
    );
  }

  // Render children if authenticated or if the route is public
  return <>{children}</>;
};

export default ProtectedRoute;
