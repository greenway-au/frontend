/**
 * Participant Query Hooks
 * TanStack Query hooks for participant operations
 */

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { participantsApi } from './participants.api';
import type {
  ParticipantFilters,
  CreateParticipantPayload,
  UpdateParticipantPayload,
} from '../types/participant.types';

/** Query key factory for participants */
export const participantKeys = {
  all: ['participants'] as const,
  lists: () => [...participantKeys.all, 'list'] as const,
  list: (filters: ParticipantFilters) => [...participantKeys.lists(), filters] as const,
  details: () => [...participantKeys.all, 'detail'] as const,
  detail: (id: string) => [...participantKeys.details(), id] as const,
} as const;

/** Get paginated participants list */
export function useParticipants(filters: ParticipantFilters = {}) {
  return useQuery({
    queryKey: participantKeys.list(filters),
    queryFn: () => participantsApi.list(filters),
    placeholderData: (previousData) => previousData,
  });
}

/** Get single participant by ID */
export function useParticipant(id: string) {
  return useQuery({
    queryKey: participantKeys.detail(id),
    queryFn: () => participantsApi.get(id),
    enabled: !!id,
  });
}

/** Create new participant */
export function useCreateParticipant() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateParticipantPayload) => participantsApi.create(data),
    onSuccess: () => {
      // Invalidate all list queries
      queryClient.invalidateQueries({ queryKey: participantKeys.lists() });
    },
  });
}

/** Update participant */
export function useUpdateParticipant() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateParticipantPayload }) =>
      participantsApi.update(id, data),
    onSuccess: (updatedParticipant) => {
      // Update cache directly
      queryClient.setQueryData(
        participantKeys.detail(updatedParticipant.id),
        updatedParticipant
      );
      // Invalidate lists
      queryClient.invalidateQueries({ queryKey: participantKeys.lists() });
    },
  });
}

/** Delete participant */
export function useDeleteParticipant() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => participantsApi.delete(id),
    onSuccess: (_, id) => {
      // Remove from cache
      queryClient.removeQueries({ queryKey: participantKeys.detail(id) });
      // Invalidate lists
      queryClient.invalidateQueries({ queryKey: participantKeys.lists() });
    },
  });
}

/** Prefetch participant detail */
export function usePrefetchParticipant() {
  const queryClient = useQueryClient();

  return (id: string) => {
    queryClient.prefetchQuery({
      queryKey: participantKeys.detail(id),
      queryFn: () => participantsApi.get(id),
      staleTime: 5 * 60 * 1000, // 5 minutes
    });
  };
}
