/**
 * Invitations Query Hooks
 * TanStack Query hooks for invitation operations
 */

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { invitationsApi } from './invitations.api';
import type {
  CreateInvitationPayload,
  AcceptInvitationPayload,
} from '../types/invitation.types';

/** Query key factory for invitations */
export const invitationKeys = {
  all: ['invitations'] as const,
  lists: () => [...invitationKeys.all, 'list'] as const,
  list: (params?: { limit?: number; offset?: number }) => [...invitationKeys.lists(), params] as const,
  details: () => [...invitationKeys.all, 'detail'] as const,
  detail: (id: string) => [...invitationKeys.details(), id] as const,
  validation: (token: string) => [...invitationKeys.all, 'validate', token] as const,
} as const;

/** Get paginated invitations list (admin only) */
export function useInvitations(params?: { limit?: number; offset?: number }) {
  return useQuery({
    queryKey: invitationKeys.list(params),
    queryFn: () => invitationsApi.list(params),
  });
}

/** Get single invitation by ID (admin only) */
export function useInvitation(id: string) {
  return useQuery({
    queryKey: invitationKeys.detail(id),
    queryFn: () => invitationsApi.get(id),
    enabled: !!id,
  });
}

/** Create new invitation (admin only) */
export function useCreateInvitation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateInvitationPayload) => invitationsApi.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: invitationKeys.lists() });
    },
  });
}

/** Revoke invitation (admin only) */
export function useRevokeInvitation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => invitationsApi.revoke(id),
    onSuccess: (_, id) => {
      queryClient.removeQueries({ queryKey: invitationKeys.detail(id) });
      queryClient.invalidateQueries({ queryKey: invitationKeys.lists() });
    },
  });
}

/** Validate invitation token (public) */
export function useValidateInvitation(token: string) {
  return useQuery({
    queryKey: invitationKeys.validation(token),
    queryFn: () => invitationsApi.validate(token),
    enabled: !!token,
  });
}

/** Accept invitation (public) */
export function useAcceptInvitation() {
  return useMutation({
    mutationFn: (data: AcceptInvitationPayload) => invitationsApi.accept(data),
  });
}
