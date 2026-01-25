/**
 * Coordinators Query Hooks
 * TanStack Query hooks for coordinator operations
 */

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { coordinatorsApi } from './coordinators.api';
import type {
  CreateCoordinatorPayload,
  UpdateCoordinatorPayload,
} from '../types/coordinator.types';

/** Query key factory for coordinators */
export const coordinatorKeys = {
  all: ['coordinators'] as const,
  lists: () => [...coordinatorKeys.all, 'list'] as const,
  list: (params?: { limit?: number; offset?: number }) => [...coordinatorKeys.lists(), params] as const,
  details: () => [...coordinatorKeys.all, 'detail'] as const,
  detail: (id: string) => [...coordinatorKeys.details(), id] as const,
} as const;

/** Get paginated coordinators list */
export function useCoordinators(params?: { limit?: number; offset?: number }) {
  return useQuery({
    queryKey: coordinatorKeys.list(params),
    queryFn: () => coordinatorsApi.list(params),
  });
}

/** Get single coordinator by ID */
export function useCoordinator(id: string) {
  return useQuery({
    queryKey: coordinatorKeys.detail(id),
    queryFn: () => coordinatorsApi.get(id),
    enabled: !!id,
  });
}

/** Create new coordinator */
export function useCreateCoordinator() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateCoordinatorPayload) => coordinatorsApi.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: coordinatorKeys.lists() });
    },
  });
}

/** Update coordinator */
export function useUpdateCoordinator() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateCoordinatorPayload }) =>
      coordinatorsApi.update(id, data),
    onSuccess: (updatedCoordinator) => {
      queryClient.setQueryData(
        coordinatorKeys.detail(updatedCoordinator.id),
        updatedCoordinator
      );
      queryClient.invalidateQueries({ queryKey: coordinatorKeys.lists() });
    },
  });
}

/** Delete coordinator */
export function useDeleteCoordinator() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => coordinatorsApi.delete(id),
    onSuccess: (_, id) => {
      queryClient.removeQueries({ queryKey: coordinatorKeys.detail(id) });
      queryClient.invalidateQueries({ queryKey: coordinatorKeys.lists() });
    },
  });
}
