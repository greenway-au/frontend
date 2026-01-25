/**
 * Relationships Query Hooks
 * TanStack Query hooks for relationship operations
 */

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { relationshipsApi } from './relationships.api';
import type {
  CreateClientProviderPayload,
  UpdateClientProviderPayload,
  AssignCoordinatorPayload,
  UpdateCoordinatorAssignmentPayload,
} from '../types/relationship.types';
import { participantKeys } from '@/features/participants/api/participants.queries';

/** Query key factory for relationships */
export const relationshipKeys = {
  all: ['relationships'] as const,

  // Client-Provider (admin)
  clientProviders: () => [...relationshipKeys.all, 'client-provider'] as const,
  providersByParticipant: (participantId: string) =>
    [...relationshipKeys.clientProviders(), 'by-participant', participantId] as const,
  participantsByProvider: (providerId: string) =>
    [...relationshipKeys.clientProviders(), 'by-provider', providerId] as const,

  // Client-Coordinator (admin)
  clientCoordinators: () => [...relationshipKeys.all, 'client-coordinator'] as const,
  coordinatorForParticipant: (participantId: string) =>
    [...relationshipKeys.clientCoordinators(), 'for-participant', participantId] as const,
  participantsByCoordinator: (coordinatorId: string) =>
    [...relationshipKeys.clientCoordinators(), 'by-coordinator', coordinatorId] as const,

  // Role-specific "me" keys
  myParticipantsAsCoordinator: () => [...relationshipKeys.all, 'my-participants-coordinator'] as const,
  myParticipantsAsProvider: () => [...relationshipKeys.all, 'my-participants-provider'] as const,
  myProvidersAsClient: () => [...relationshipKeys.all, 'my-providers-client'] as const,
  myCoordinatorAsClient: () => [...relationshipKeys.all, 'my-coordinator-client'] as const,
} as const;

// ============================================
// Client-Provider Relationship Hooks
// ============================================

/** Get providers linked to a participant */
export function useProvidersByParticipant(participantId: string) {
  return useQuery({
    queryKey: relationshipKeys.providersByParticipant(participantId),
    queryFn: () => relationshipsApi.listProvidersByParticipant(participantId),
    enabled: !!participantId,
  });
}

/** Get participants linked to a provider */
export function useParticipantsByProvider(providerId: string) {
  return useQuery({
    queryKey: relationshipKeys.participantsByProvider(providerId),
    queryFn: () => relationshipsApi.listParticipantsByProvider(providerId),
    enabled: !!providerId,
  });
}

/** Create a client-provider relationship */
export function useCreateClientProvider() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateClientProviderPayload) =>
      relationshipsApi.createClientProvider(data),
    onSuccess: () => {
      // Invalidate all client-provider queries
      queryClient.invalidateQueries({ queryKey: relationshipKeys.clientProviders() });
    },
  });
}

/** Update a client-provider relationship */
export function useUpdateClientProvider() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateClientProviderPayload }) =>
      relationshipsApi.updateClientProvider(id, data),
    onSuccess: () => {
      // Invalidate all client-provider queries
      queryClient.invalidateQueries({ queryKey: relationshipKeys.clientProviders() });
    },
  });
}

/** Delete a client-provider relationship */
export function useDeleteClientProvider() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => relationshipsApi.deleteClientProvider(id),
    onSuccess: () => {
      // Invalidate all client-provider queries
      queryClient.invalidateQueries({ queryKey: relationshipKeys.clientProviders() });
    },
  });
}

// ============================================
// Client-Coordinator Assignment Hooks
// ============================================

/** Get the coordinator assigned to a participant */
export function useCoordinatorForParticipant(participantId: string) {
  return useQuery({
    queryKey: relationshipKeys.coordinatorForParticipant(participantId),
    queryFn: () => relationshipsApi.getCoordinatorForParticipant(participantId),
    enabled: !!participantId,
  });
}

/** Get participants assigned to a coordinator */
export function useParticipantsByCoordinator(coordinatorId: string) {
  return useQuery({
    queryKey: relationshipKeys.participantsByCoordinator(coordinatorId),
    queryFn: () => relationshipsApi.listParticipantsByCoordinator(coordinatorId),
    enabled: !!coordinatorId,
  });
}

/** Assign a coordinator to a participant */
export function useAssignCoordinator() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: AssignCoordinatorPayload) =>
      relationshipsApi.assignCoordinator(data),
    onSuccess: () => {
      // Invalidate all client-coordinator queries
      queryClient.invalidateQueries({ queryKey: relationshipKeys.clientCoordinators() });
      // Also invalidate participants list as it may show coordinator info
      queryClient.invalidateQueries({ queryKey: participantKeys.lists() });
    },
  });
}

/** Update a coordinator assignment */
export function useUpdateCoordinatorAssignment() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateCoordinatorAssignmentPayload }) =>
      relationshipsApi.updateCoordinatorAssignment(id, data),
    onSuccess: () => {
      // Invalidate all client-coordinator queries
      queryClient.invalidateQueries({ queryKey: relationshipKeys.clientCoordinators() });
    },
  });
}

/** Delete a coordinator assignment */
export function useDeleteCoordinatorAssignment() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => relationshipsApi.deleteCoordinatorAssignment(id),
    onSuccess: () => {
      // Invalidate all client-coordinator queries
      queryClient.invalidateQueries({ queryKey: relationshipKeys.clientCoordinators() });
      // Also invalidate participants list
      queryClient.invalidateQueries({ queryKey: participantKeys.lists() });
    },
  });
}

// ============================================
// Role-specific "me" hooks (non-admin users)
// ============================================

/** Get my assigned participants as a coordinator */
export function useMyParticipantsAsCoordinator() {
  return useQuery({
    queryKey: relationshipKeys.myParticipantsAsCoordinator(),
    queryFn: () => relationshipsApi.getMyParticipantsAsCoordinator(),
  });
}

/** Get my linked participants as a provider */
export function useMyParticipantsAsProvider() {
  return useQuery({
    queryKey: relationshipKeys.myParticipantsAsProvider(),
    queryFn: () => relationshipsApi.getMyParticipantsAsProvider(),
  });
}

/** Get my linked providers as a client/participant */
export function useMyProvidersAsClient() {
  return useQuery({
    queryKey: relationshipKeys.myProvidersAsClient(),
    queryFn: () => relationshipsApi.getMyProvidersAsClient(),
  });
}

/** Get my assigned coordinator as a client/participant */
export function useMyCoordinatorAsClient() {
  return useQuery({
    queryKey: relationshipKeys.myCoordinatorAsClient(),
    queryFn: () => relationshipsApi.getMyCoordinatorAsClient(),
  });
}

