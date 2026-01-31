/**
 * NDIS Plans Query Hooks
 * TanStack Query hooks for NDIS plan operations
 */

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { ndisPlansApi } from './ndis-plans.api';
import type {
  PlanFilters,
  UploadPlanPayload,
  UpdateBudgetPayload,
} from '../types/ndis-plan.types';

/** Query key factory for NDIS plans */
export const ndisPlansKeys = {
  all: ['ndis-plans'] as const,
  lists: () => [...ndisPlansKeys.all, 'list'] as const,
  list: (filters: PlanFilters) => [...ndisPlansKeys.lists(), filters] as const,
  details: () => [...ndisPlansKeys.all, 'detail'] as const,
  detail: (id: string) => [...ndisPlansKeys.details(), id] as const,
} as const;

/** Get list of NDIS plans with filtering */
export function useNDISPlans(filters: PlanFilters = {}) {
  return useQuery({
    queryKey: ndisPlansKeys.list(filters),
    queryFn: () => ndisPlansApi.list(filters),
    placeholderData: (previousData) => previousData,
  });
}

/** Get single NDIS plan by ID */
export function useNDISPlan(id: string) {
  return useQuery({
    queryKey: ndisPlansKeys.detail(id),
    queryFn: () => ndisPlansApi.get(id),
    enabled: !!id,
  });
}

/** Upload new NDIS plan */
export function useUploadNDISPlan() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: UploadPlanPayload) => ndisPlansApi.upload(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ndisPlansKeys.lists() });
    },
  });
}

/** Update plan budget */
export function useUpdatePlanBudget() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateBudgetPayload }) =>
      ndisPlansApi.updateBudget(id, data),
    onSuccess: (updatedPlan) => {
      queryClient.setQueryData(ndisPlansKeys.detail(updatedPlan.id), updatedPlan);
      queryClient.invalidateQueries({ queryKey: ndisPlansKeys.lists() });
    },
  });
}

/** Delete NDIS plan */
export function useDeleteNDISPlan() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => ndisPlansApi.delete(id),
    onSuccess: (_, id) => {
      queryClient.removeQueries({ queryKey: ndisPlansKeys.detail(id) });
      queryClient.invalidateQueries({ queryKey: ndisPlansKeys.lists() });
    },
  });
}

/** Download NDIS plan PDF */
export function useDownloadNDISPlan() {
  return useMutation({
    mutationFn: async (plan: { s3_key: string; filename: string }) => {
      const API_BASE_URL = import.meta.env.VITE_API_URL || 'https://dbw1gtfeo534m.cloudfront.net';
      const token = localStorage.getItem('token');

      const response = await fetch(
        `${API_BASE_URL}/api/v1/storage/download/${encodeURIComponent(plan.s3_key)}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) throw new Error('Download failed');

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = plan.filename;
      link.click();
      window.URL.revokeObjectURL(url);
    },
  });
}
