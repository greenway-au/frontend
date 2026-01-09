/**
 * Protected Route
 * Wrapper component that redirects unauthenticated users
 */

import { Navigate, Outlet, useLocation } from '@tanstack/react-router';
import { useIsAuthenticated } from '../hooks/use-auth';
import { LoadingSpinner } from '@/components/common/LoadingSpinner';
import { useAtomValue } from 'jotai';
import { authLoadingAtom } from '@/stores/auth';

interface ProtectedRouteProps {
  /** Children to render when authenticated */
  children?: React.ReactNode;
  /** Redirect path for unauthenticated users */
  redirectTo?: string;
  /** Required roles (any of these) */
  roles?: string[];
}

export function ProtectedRoute({
  children,
  redirectTo = '/login',
  roles: _roles,
}: ProtectedRouteProps) {
  const isAuthenticated = useIsAuthenticated();
  const isLoading = useAtomValue(authLoadingAtom);
  const location = useLocation();

  // Show loading while checking auth state
  if (isLoading) {
    return <LoadingSpinner centered label="Checking authentication..." />;
  }

  // Redirect if not authenticated
  if (!isAuthenticated) {
    // Preserve the attempted URL for redirect after login
    const returnUrl = encodeURIComponent(location.pathname + location.search);
    // Use type assertion for dynamic redirect path
    return <Navigate to={`${redirectTo}?returnUrl=${returnUrl}` as '/login'} />;
  }

  // TODO: Add role checking when needed
  // if (roles && roles.length > 0) {
  //   const hasRole = useHasRole(roles);
  //   if (!hasRole) {
  //     return <Navigate to="/unauthorized" />;
  //   }
  // }

  return children ?? <Outlet />;
}
