/**
 * Auth Query Hooks
 * TanStack Query hooks for auth operations
 */

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useSetAtom } from 'jotai';
import { authApi } from './auth.api';
import { setAuthAtom, clearAuthAtom, updateTokensAtom } from '@/stores/auth';
import type { LoginCredentials, RegisterData } from '../types/auth.types';

/** Query keys for auth */
export const authKeys = {
  all: ['auth'] as const,
  currentUser: () => [...authKeys.all, 'me'] as const,
} as const;

/** Get current user query */
export function useCurrentUser() {
  return useQuery({
    queryKey: authKeys.currentUser(),
    queryFn: () => authApi.me(),
    staleTime: 5 * 60 * 1000, // 5 minutes
    retry: false,
  });
}

/** Login mutation */
export function useLogin() {
  const setAuth = useSetAtom(setAuthAtom);
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (credentials: LoginCredentials) => authApi.login(credentials),
    onSuccess: (data) => {
      // Store in Jotai (atomWithStorage automatically syncs to localStorage)
      setAuth({ user: data.user, tokens: data.tokens });
      // Update query cache
      queryClient.setQueryData(authKeys.currentUser(), data.user);
    },
  });
}

/** Register mutation */
export function useRegister() {
  const setAuth = useSetAtom(setAuthAtom);
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: RegisterData) => authApi.register(data),
    onSuccess: (data) => {
      // Store in Jotai (atomWithStorage automatically syncs to localStorage)
      setAuth({ user: data.user, tokens: data.tokens });
      queryClient.setQueryData(authKeys.currentUser(), data.user);
    },
  });
}

/** Logout mutation */
export function useLogout() {
  const clearAuth = useSetAtom(clearAuthAtom);
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () => authApi.logout(),
    onSuccess: () => {
      // Clear auth state (atomWithStorage automatically syncs to localStorage)
      clearAuth();
      queryClient.clear();
    },
    onError: () => {
      // Still clear local state on error
      clearAuth();
      queryClient.clear();
    },
  });
}

/** Refresh token mutation */
export function useRefreshToken() {
  const updateTokens = useSetAtom(updateTokensAtom);

  return useMutation({
    mutationFn: (refreshToken: string) => authApi.refresh(refreshToken),
    onSuccess: (data) => {
      // Update tokens in Jotai (atomWithStorage automatically syncs to localStorage)
      updateTokens({
        accessToken: data.accessToken,
        expiresAt: data.expiresAt,
      });
    },
  });
}

/** Forgot password mutation */
export function useForgotPassword() {
  return useMutation({
    mutationFn: (email: string) => authApi.forgotPassword(email),
  });
}

/** Reset password mutation */
export function useResetPassword() {
  return useMutation({
    mutationFn: ({ token, password }: { token: string; password: string }) => authApi.resetPassword(token, password),
  });
}
