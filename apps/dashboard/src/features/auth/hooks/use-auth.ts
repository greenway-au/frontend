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

/** Get user type */
export function useUserType() {
  const user = useAtomValue(userAtom);
  return user?.userType ?? null;
}

/** Check if user is a specific type */
export function useIsUserType(type: string | string[]) {
  const userType = useUserType();
  if (!userType) return false;

  if (Array.isArray(type)) {
    return type.includes(userType);
  }
  return userType === type;
}

/** Check if user is a client */
export function useIsClient() {
  return useIsUserType('client');
}

/** Check if user is a provider */
export function useIsProvider() {
  return useIsUserType('provider');
}

/** Check if user is an admin */
export function useIsAdmin() {
  return useIsUserType('admin');
}

// Re-export query hooks for convenience
export { useCurrentUser, useLogin, useLogout, useRegister } from '../api/auth.queries';
