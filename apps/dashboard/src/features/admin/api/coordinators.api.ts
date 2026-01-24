/**
 * Coordinators API
 * API calls for coordinator management (admin only)
 */

import { api } from '@/lib/api';
import type {
  Coordinator,
  CoordinatorsListResponse,
  CreateCoordinatorPayload,
  UpdateCoordinatorPayload,
} from '../types/coordinator.types';

const BASE_PATH = '/api/v1/coordinators';

export const coordinatorsApi = {
  /** Get paginated list of coordinators */
  list: (params?: { limit?: number; offset?: number }): Promise<CoordinatorsListResponse> => {
    return api.get<CoordinatorsListResponse>(BASE_PATH, { params });
  },

  /** Get single coordinator by ID */
  get: (id: string): Promise<Coordinator> => {
    return api.get<Coordinator>(`${BASE_PATH}/${id}`);
  },

  /** Create new coordinator */
  create: (data: CreateCoordinatorPayload): Promise<Coordinator> => {
    return api.post<Coordinator>(BASE_PATH, data);
  },

  /** Update coordinator */
  update: (id: string, data: UpdateCoordinatorPayload): Promise<Coordinator> => {
    return api.put<Coordinator>(`${BASE_PATH}/${id}`, data);
  },

  /** Delete coordinator */
  delete: (id: string): Promise<void> => {
    return api.delete(`${BASE_PATH}/${id}`);
  },
} as const;
