import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { participantsApi } from './participants.api';
import type {
  CreateParticipantPayload,
  UpdateParticipantPayload,
} from '../types/participant.types';

/** Query key factory for participants */
export const participantKeys = {
  all: ['participants'] as const,
  lists: () => [...participantKeys.all, 'list'] as const,
  list: (params?: { limit?: number; offset?: number }) => [...participantKeys.lists(), params] as const,
  details: () => [...participantKeys.all, 'detail'] as const,
  detail: (id: string) => [...participantKeys.details(), id] as const,
} as const;

/** Get paginated participants list */
export function useParticipants(params?: { limit?: number; offset?: number }) {
  return useQuery({
    queryKey: participantKeys.list(params),
    queryFn: () => participantsApi.list(params),
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
