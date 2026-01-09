/**
 * Auth Hooks
 * Convenient hooks for auth state and operations
 */

import { useAtomValue } from 'jotai';
import { authStateAtom, userAtom, isAuthenticatedAtom } from '@/stores/auth';

/** Get full auth state */
export function useAuth() {
  return useAtomValue(authStateAtom);
}

/** Get current user (or null) */
export function useUser() {
  return useAtomValue(userAtom);
}

/** Check if user is authenticated */
export function useIsAuthenticated() {
  return useAtomValue(isAuthenticatedAtom);
}

/** Get user role */
export function useUserRole() {
  const user = useAtomValue(userAtom);
  return user?.role ?? null;
}

/** Check if user has a specific role */
export function useHasRole(role: string | string[]) {
  const userRole = useUserRole();
  if (!userRole) return false;

  if (Array.isArray(role)) {
    return role.includes(userRole);
  }
  return userRole === role;
}

// Re-export query hooks for convenience
export { useCurrentUser, useLogin, useLogout, useRegister } from '../api/auth.queries';
