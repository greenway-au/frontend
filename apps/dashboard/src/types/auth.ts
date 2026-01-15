/**
 * Authentication Types
 * User, token, and auth state definitions
 */

/** User types in the system */
export type UserType = 'client' | 'provider';

/** User entity */
export interface User {
  id: string;
  email: string;
  name: string;
  userType: UserType;
  avatar?: string;
  createdAt: string;
  updatedAt: string;
}

/** JWT tokens structure */
export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
  expiresAt: number;
}

/** Login credentials */
export interface LoginCredentials {
  email: string;
  password: string;
}

/** Registration data */
export interface RegisterData {
  email: string;
  password: string;
  name: string;
  userType?: UserType;
}

/** Auth state for Jotai store */
export interface AuthState {
  user: User | null;
  tokens: AuthTokens | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}

/** Login response from API */
export interface LoginResponse {
  user: User;
  tokens: AuthTokens;
}

/** Refresh token response */
export interface RefreshResponse {
  accessToken: string;
  expiresAt: number;
}
