/**
 * Providers Query Hooks
 * TanStack Query hooks for provider operations
 */

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { providersApi } from './providers.api';
import type {
  CreateProviderPayload,
  UpdateProviderPayload,
} from '../types/provider.types';

/** Query key factory for providers */
export const providerKeys = {
  all: ['providers'] as const,
  lists: () => [...providerKeys.all, 'list'] as const,
  list: (params?: { limit?: number; offset?: number }) => [...providerKeys.lists(), params] as const,
  details: () => [...providerKeys.all, 'detail'] as const,
  detail: (id: string) => [...providerKeys.details(), id] as const,
  myProfile: () => [...providerKeys.all, 'me'] as const,
} as const;

/** Get paginated providers list */
export function useProviders(params?: { limit?: number; offset?: number }) {
  return useQuery({
    queryKey: providerKeys.list(params),
    queryFn: () => providersApi.list(params),
  });
}

/** Get single provider by ID */
export function useProvider(id: string) {
  return useQuery({
    queryKey: providerKeys.detail(id),
    queryFn: () => providersApi.get(id),
    enabled: !!id,
  });
}

/** Get current user's provider profile */
export function useMyProviderProfile() {
  return useQuery({
    queryKey: providerKeys.myProfile(),
    queryFn: () => providersApi.getMyProfile(),
  });
}

/** Create new provider */
export function useCreateProvider() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateProviderPayload) => providersApi.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: providerKeys.lists() });
    },
  });
}

/** Update provider */
export function useUpdateProvider() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateProviderPayload }) =>
      providersApi.update(id, data),
    onSuccess: (updatedProvider) => {
      queryClient.setQueryData(
        providerKeys.detail(updatedProvider.id),
        updatedProvider
      );
      queryClient.invalidateQueries({ queryKey: providerKeys.lists() });
    },
  });
}

/** Delete provider */
export function useDeleteProvider() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => providersApi.delete(id),
    onSuccess: (_, id) => {
      queryClient.removeQueries({ queryKey: providerKeys.detail(id) });
      queryClient.invalidateQueries({ queryKey: providerKeys.lists() });
    },
  });
}
