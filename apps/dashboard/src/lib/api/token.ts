/**
 * Token Management
 * Utilities for JWT token storage and access
 */

import type { AuthTokens } from '@/types/auth';

const TOKEN_KEY = 'auth:tokens';
const EXPIRY_BUFFER_MS = 60_000; // 1 minute buffer before expiry

/** Get tokens from storage */
export function getStoredTokens(): AuthTokens | null {
  if (typeof window === 'undefined') return null;

  try {
    const stored = localStorage.getItem(TOKEN_KEY);
    if (!stored) return null;
    return JSON.parse(stored) as AuthTokens;
  } catch {
    return null;
  }
}

/** Store tokens in localStorage */
export function storeTokens(tokens: AuthTokens): void {
  if (typeof window === 'undefined') return;
  localStorage.setItem(TOKEN_KEY, JSON.stringify(tokens));
}

/** Clear tokens from storage */
export function clearStoredTokens(): void {
  if (typeof window === 'undefined') return;
  localStorage.removeItem(TOKEN_KEY);
}

/** Get current access token if valid */
export function getAccessToken(): string | null {
  const tokens = getStoredTokens();
  if (!tokens) return null;

  // Check if token is expired (with buffer)
  if (tokens.expiresAt - EXPIRY_BUFFER_MS < Date.now()) {
    return null;
  }

  return tokens.accessToken;
}

/** Get refresh token */
export function getRefreshToken(): string | null {
  const tokens = getStoredTokens();
  return tokens?.refreshToken ?? null;
}

/** Check if access token is expired */
export function isTokenExpired(): boolean {
  const tokens = getStoredTokens();
  if (!tokens) return true;
  return tokens.expiresAt < Date.now();
}

/** Check if token will expire soon (within buffer) */
export function isTokenExpiringSoon(): boolean {
  const tokens = getStoredTokens();
  if (!tokens) return true;
  return tokens.expiresAt - EXPIRY_BUFFER_MS < Date.now();
}

/** Update access token after refresh */
export function updateAccessToken(accessToken: string, expiresAt: number): void {
  const tokens = getStoredTokens();
  if (!tokens) return;

  storeTokens({
    ...tokens,
    accessToken,
    expiresAt,
  });
}
