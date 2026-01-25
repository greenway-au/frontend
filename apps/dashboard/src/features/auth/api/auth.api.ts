/**
 * Auth API
 * API calls for authentication endpoints
 */

import { api } from '@/lib/api';
import type { LoginCredentials, RegisterData, LoginResponse, RefreshResponse, User } from '../types/auth.types';

const AUTH_BASE = '/api/v1/auth';

/** Backend response shape (snake_case from Go) */
interface BackendLoginResponse {
  token: {
    access_token: string;
    refresh_token: string;
    expires_at: string; // RFC3339 date string
    token_type: string;
  };
  user: {
    id: string;
    email: string;
    name: string;
    user_type: string;
    provider_id?: string;
    participant_id?: string;
    coordinator_id?: string;
  };
}

/** Backend user response shape */
interface BackendUserResponse {
  id: string;
  email: string;
  name: string;
  user_type: string;
  provider_id?: string;
  participant_id?: string;
  coordinator_id?: string;
  created_at?: string;
  updated_at?: string;
}

/** Transform backend login response to frontend format */
function transformLoginResponse(data: BackendLoginResponse): LoginResponse {
  return {
    user: {
      id: data.user.id,
      email: data.user.email,
      name: data.user.name,
      userType: data.user.user_type as 'client' | 'provider' | 'admin' | 'coordinator',
      providerId: data.user.provider_id,
      participantId: data.user.participant_id,
      coordinatorId: data.user.coordinator_id,
      createdAt: '',
      updatedAt: '',
    },
    tokens: {
      accessToken: data.token.access_token,
      refreshToken: data.token.refresh_token,
      expiresAt: new Date(data.token.expires_at).getTime(),
    },
  };
}

/** Transform backend user response to frontend format */
function transformUserResponse(data: BackendUserResponse): User {
  return {
    id: data.id,
    email: data.email,
    name: data.name,
    userType: data.user_type as 'client' | 'provider' | 'admin' | 'coordinator',
    providerId: data.provider_id,
    participantId: data.participant_id,
    coordinatorId: data.coordinator_id,
    createdAt: data.created_at || '',
    updatedAt: data.updated_at || '',
  };
}

export const authApi = {
  /** Login with email and password */
  login: async (credentials: LoginCredentials): Promise<LoginResponse> => {
    const data = await api.post<BackendLoginResponse>(`${AUTH_BASE}/login`, credentials, {
      skipAuth: true,
    });
    return transformLoginResponse(data);
  },

  /** Register a new user */
  register: async (data: RegisterData): Promise<LoginResponse> => {
    // Transform camelCase to snake_case for backend
    const payload = {
      email: data.email,
      password: data.password,
      name: data.name,
      user_type: data.userType, // Convert userType -> user_type
    };
    const response = await api.post<BackendLoginResponse>(`${AUTH_BASE}/register`, payload, {
      skipAuth: true,
    });
    return transformLoginResponse(response);
  },

  /** Logout current user */
  logout: (): Promise<void> => {
    // Client-side logout only for stateless JWT
    return Promise.resolve();
  },

  /** Refresh access token */
  refresh: (refreshToken: string): Promise<RefreshResponse> => {
    return api.post<RefreshResponse>(`${AUTH_BASE}/refresh`, { refresh_token: refreshToken }, { skipAuth: true });
  },

  /** Get current user */
  me: async (): Promise<User> => {
    const data = await api.get<BackendUserResponse>(`${AUTH_BASE}/me`);
    return transformUserResponse(data);
  },

  /** Request password reset */
  forgotPassword: (email: string): Promise<{ message: string }> => {
    return api.post(`${AUTH_BASE}/forgot-password`, { email }, { skipAuth: true });
  },

  /** Reset password with token */
  resetPassword: (token: string, password: string): Promise<{ message: string }> => {
    return api.post(`${AUTH_BASE}/reset-password`, { token, password }, { skipAuth: true });
  },

  /** Verify email with token */
  verifyEmail: (token: string): Promise<{ message: string }> => {
    return api.post(`${AUTH_BASE}/verify-email`, { token }, { skipAuth: true });
  },
} as const;
