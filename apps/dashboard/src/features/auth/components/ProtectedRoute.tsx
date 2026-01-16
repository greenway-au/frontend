/**
 * Protected Route
 * Wrapper component that redirects unauthenticated users
 */

import { useEffect, useState } from 'react';
import { Outlet, useLocation } from '@tanstack/react-router';
import { useIsAuthenticated } from '../hooks/use-auth';
import { LoadingSpinner } from '@/components/common/LoadingSpinner';
import { useAtomValue } from 'jotai';
import { authLoadingAtom } from '@/stores/auth';

interface ProtectedRouteProps {
  /** Children to render when authenticated */
  children?: React.ReactNode;
  /** Required roles (any of these) */
  roles?: string[];
}

export function ProtectedRoute({
  children,
  roles: _roles,
}: ProtectedRouteProps) {
  const isAuthenticated = useIsAuthenticated();
  const isLoading = useAtomValue(authLoadingAtom);
  const location = useLocation();
  const [isHydrated, setIsHydrated] = useState(false);

  // Wait for hydration on client-side
  useEffect(() => {
    setIsHydrated(true);
  }, []);

  // Redirect to login if not authenticated
  useEffect(() => {
    if (isHydrated && !isLoading && !isAuthenticated) {
      // Use location.href which is the full path with search string
      // location.search in TanStack Router is an object, not a string
      const currentPath = location.href || location.pathname;
      const returnUrl = encodeURIComponent(currentPath);
      window.location.href = `/login?returnUrl=${returnUrl}`;
    }
  }, [isHydrated, isLoading, isAuthenticated, location.href, location.pathname]);

  // Show loading while hydrating, loading, or redirecting
  if (!isHydrated || isLoading || !isAuthenticated) {
    return <LoadingSpinner centered label="Checking authentication..." />;
  }

  return children ?? <Outlet />;
}
