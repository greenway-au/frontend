/**
 * Auth Store
 * Jotai atoms for authentication state
 */

import { atom } from 'jotai';
import { atomWithStorage } from 'jotai/utils';
import type { User, AuthTokens, AuthState } from '@/types/auth';

/** User atom - persisted to localStorage */
export const userAtom = atomWithStorage<User | null>('auth:user', null);

/** Tokens atom - persisted to localStorage */
export const tokensAtom = atomWithStorage<AuthTokens | null>('auth:tokens', null);

/** Loading state for auth operations */
export const authLoadingAtom = atom<boolean>(false);

/** Derived atom: Check if user is authenticated */
export const isAuthenticatedAtom = atom((get) => {
  const tokens = get(tokensAtom);
  if (!tokens) return false;

  // Check token expiry
  return tokens.expiresAt > Date.now();
});

/** Derived atom: Combined auth state */
export const authStateAtom = atom<AuthState>((get) => ({
  user: get(userAtom),
  tokens: get(tokensAtom),
  isAuthenticated: get(isAuthenticatedAtom),
  isLoading: get(authLoadingAtom),
}));

/** Action atom: Set auth data after login */
export const setAuthAtom = atom(
  null,
  (_get, set, { user, tokens }: { user: User; tokens: AuthTokens }) => {
    set(userAtom, user);
    set(tokensAtom, tokens);
  }
);

/** Action atom: Clear auth data on logout */
export const clearAuthAtom = atom(null, (_get, set) => {
  set(userAtom, null);
  set(tokensAtom, null);
});

/** Action atom: Update user data */
export const updateUserAtom = atom(
  null,
  (get, set, updates: Partial<User>) => {
    const currentUser = get(userAtom);
    if (currentUser) {
      set(userAtom, { ...currentUser, ...updates });
    }
  }
);

/** Action atom: Update tokens after refresh */
export const updateTokensAtom = atom(
  null,
  (get, set, { accessToken, expiresAt }: { accessToken: string; expiresAt: number }) => {
    const currentTokens = get(tokensAtom);
    if (currentTokens) {
      set(tokensAtom, { ...currentTokens, accessToken, expiresAt });
    }
  }
);
