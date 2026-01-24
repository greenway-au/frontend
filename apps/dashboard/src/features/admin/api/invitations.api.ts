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
const ADMIN_BASE_PATH = '/api/v1/admin/invitations';

export const invitationsApi = {
  /** Get paginated list of invitations (admin only) */
  list: (params?: { limit?: number; offset?: number }): Promise<InvitationsListResponse> => {
    return api.get<InvitationsListResponse>(ADMIN_BASE_PATH, { params });
  },

  /** Get single invitation by ID (admin only) */
  get: (id: string): Promise<Invitation> => {
    return api.get<Invitation>(`${ADMIN_BASE_PATH}/${id}`);
  },

  /** Create new invitation (admin only) */
  create: (data: CreateInvitationPayload): Promise<Invitation> => {
    return api.post<Invitation>(ADMIN_BASE_PATH, data);
  },

  /** Revoke invitation (admin only) */
  revoke: (id: string): Promise<void> => {
    return api.delete(`${ADMIN_BASE_PATH}/${id}`);
  },

  /** Validate invitation token (public) */
  validate: (token: string): Promise<InvitationValidation> => {
    return api.get<InvitationValidation>(`${BASE_PATH}/validate`, {
      params: { token },
      skipAuth: true,
    });
  },

  /** Accept invitation and create user account (public) */
  accept: (data: AcceptInvitationPayload): Promise<LoginResponse> => {
    return api.post<LoginResponse>(`${BASE_PATH}/accept`, data, {
      skipAuth: true,
    });
  },
} as const;
