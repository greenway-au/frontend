/**
 * NDIS Plans API
 * API calls for NDIS plan endpoints
 */

import { api } from '@/lib/api';
import type {
  NDISPlan,
  PlanFilters,
  PlansListResponse,
  UploadPlanPayload,
  UpdateBudgetPayload,
} from '../types/ndis-plan.types';

const NDIS_PLANS_PATH = '/api/v1/ndis-plans';

export const ndisPlansApi = {
  /** Upload an NDIS plan */
  upload: (payload: UploadPlanPayload): Promise<NDISPlan> => {
    const formData = new FormData();
    formData.append('file', payload.file);
    formData.append('participant_id', payload.participant_id);

    return api.post<NDISPlan>(`${NDIS_PLANS_PATH}/upload`, formData);
  },

  /** Get list of NDIS plans */
  list: (filters: PlanFilters = {}): Promise<PlansListResponse> => {
    return api.get<PlansListResponse>(NDIS_PLANS_PATH, {
      params: {
        participant_id: filters.participant_id,
        status: filters.status,
        limit: filters.limit,
        offset: filters.offset,
      },
    });
  },

  /** Get single plan by ID */
  get: (id: string): Promise<NDISPlan> => {
    return api.get<NDISPlan>(`${NDIS_PLANS_PATH}/${id}`);
  },

  /** Update plan budget breakdown */
  updateBudget: (id: string, data: UpdateBudgetPayload): Promise<NDISPlan> => {
    return api.patch<NDISPlan>(`${NDIS_PLANS_PATH}/${id}`, data);
  },

  /** Delete plan */
  delete: (id: string): Promise<void> => {
    return api.delete(`${NDIS_PLANS_PATH}/${id}`);
  },
} as const;
