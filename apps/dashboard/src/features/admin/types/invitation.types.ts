/**
 * Invitation Types
 * Type definitions for invitation entities
 */

import type { BaseEntity } from '@/types/common';

export type InvitationType = 'provider' | 'client' | 'coordinator';
export type InvitationStatus = 'pending' | 'accepted' | 'expired' | 'revoked';

export interface Invitation extends BaseEntity {
  token: string;
  invitation_type: InvitationType;
  entity_id: string;
  email: string;
  status: InvitationStatus;
  expires_at: string;
  accepted_at?: string | null;
  accepted_by_user_id?: string | null;
  created_by: string;
  created_at: string;
  updated_at: string;
}

export interface CreateInvitationPayload {
  invitation_type: InvitationType;
  entity_id: string;
  email: string;
  expires_in_days?: number;
}

export interface InvitationValidation {
  valid: boolean;
  message?: string;
  invitation_type?: string;
  entity_name?: string;
  email?: string;
  expires_at?: string;
}

export interface AcceptInvitationPayload {
  token: string;
  email: string;
  name: string;
  password: string;
}

export interface InvitationsListResponse {
  invitations: Invitation[];
  total: number;
  limit: number;
  offset: number;
}
