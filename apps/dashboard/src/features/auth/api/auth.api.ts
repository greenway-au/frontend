/**
 * Auth API
 * API calls for authentication endpoints
 */

import { api } from '@/lib/api';
import type {
  LoginCredentials,
  RegisterData,
  LoginResponse,
  RefreshResponse,
  User,
} from '../types/auth.types';

const AUTH_BASE = '/api/v1/auth';

export const authApi = {
  /** Login with email and password */
  login: (credentials: LoginCredentials): Promise<LoginResponse> => {
    return api.post<LoginResponse>(`${AUTH_BASE}/login`, credentials, {
      skipAuth: true,
    });
  },

  /** Register a new user */
  register: (data: RegisterData): Promise<LoginResponse> => {
    return api.post<LoginResponse>(`${AUTH_BASE}/register`, data, {
      skipAuth: true,
    });
  },

  /** Logout current user */
  logout: (): Promise<void> => {
    // Client-side logout only for stateless JWT
    return Promise.resolve();
  },

  /** Refresh access token */
  refresh: (refreshToken: string): Promise<RefreshResponse> => {
    return api.post<RefreshResponse>(
      `${AUTH_BASE}/refresh`,
      { refreshToken },
      { skipAuth: true }
    );
  },

  /** Get current user */
  me: (): Promise<User> => {
    return api.get<User>('/api/v1/auth/me');
  },

  /** Request password reset */
  forgotPassword: (email: string): Promise<{ message: string }> => {
    return api.post(`${AUTH_BASE}/forgot-password`, { email }, { skipAuth: true });
  },

  /** Reset password with token */
  resetPassword: (token: string, password: string): Promise<{ message: string }> => {
    return api.post(
      `${AUTH_BASE}/reset-password`,
      { token, password },
      { skipAuth: true }
    );
  },

  /** Verify email with token */
  verifyEmail: (token: string): Promise<{ message: string }> => {
    return api.post(`${AUTH_BASE}/verify-email`, { token }, { skipAuth: true });
  },
} as const;
