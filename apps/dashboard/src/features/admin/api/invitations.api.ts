/**
 * Invitations API
 * API calls for invitation management (admin only)
 */

import { api } from '@/lib/api';
import type {
  Invitation,
  InvitationsListResponse,
  CreateInvitationPayload,
  InvitationValidation,
  AcceptInvitationPayload,
} from '../types/invitation.types';
import type { LoginResponse } from '@/types/auth';

const BASE_PATH = '/api/v1/invitations';
const ADMIN_PATH = '/api/v1/admin/invitations';

/** Backend response shape for accept invitation (snake_case from Go) */
interface BackendAcceptResponse {
  user: {
    id: string;
    email: string;
    name: string;
    user_type: string;
    provider_id?: string;
    participant_id?: string;
    coordinator_id?: string;
    created_at: string;
    updated_at: string;
  };
  tokens: {
    access_token: string;
    refresh_token: string;
    expires_at: number;
    token_type: string;
  };
}

/** Transform backend accept response to frontend format */
function transformAcceptResponse(data: BackendAcceptResponse): LoginResponse {
  return {
    user: {
      id: data.user.id,
      email: data.user.email,
      name: data.user.name,
      userType: data.user.user_type as 'client' | 'provider' | 'admin' | 'coordinator',
      providerId: data.user.provider_id,
      participantId: data.user.participant_id,
      coordinatorId: data.user.coordinator_id,
      createdAt: data.user.created_at,
      updatedAt: data.user.updated_at,
    },
    tokens: {
      accessToken: data.tokens.access_token,
      refreshToken: data.tokens.refresh_token,
      expiresAt: data.tokens.expires_at,
    },
  };
}

export const invitationsApi = {
  /** Get paginated list of invitations (admin only) */
  list: (params?: { limit?: number; offset?: number }): Promise<InvitationsListResponse> => {
    return api.get<InvitationsListResponse>(ADMIN_PATH, { params });
  },

  /** Get single invitation by ID (admin only) */
  get: (id: string): Promise<Invitation> => {
    return api.get<Invitation>(`${ADMIN_PATH}/${id}`);
  },

  /** Create new invitation (admin only) */
  create: (data: CreateInvitationPayload): Promise<Invitation> => {
    return api.post<Invitation>(ADMIN_PATH, data);
  },

  /** Revoke invitation (admin only) */
  revoke: (id: string): Promise<void> => {
    return api.delete(`${ADMIN_PATH}/${id}`);
  },

  /** Validate invitation token (public) */
  validate: (token: string): Promise<InvitationValidation> => {
    return api.get<InvitationValidation>(`${BASE_PATH}/validate`, {
      params: { token },
    });
  },

  /** Accept invitation and create user account (public) */
  accept: async (data: AcceptInvitationPayload): Promise<LoginResponse> => {
    const response = await api.post<BackendAcceptResponse>(`${BASE_PATH}/accept`, data);
    return transformAcceptResponse(response);
  },
} as const;
