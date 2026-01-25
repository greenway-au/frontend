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
const ADMIN_PATH = '/api/v1/admin/coordinators';

export const coordinatorsApi = {
  /** Get paginated list of coordinators (admin only) */
  list: (params?: { limit?: number; offset?: number }): Promise<CoordinatorsListResponse> => {
    return api.get<CoordinatorsListResponse>(ADMIN_PATH, { params });
  },

  /** Get single coordinator by ID (admin only) */
  get: (id: string): Promise<Coordinator> => {
    return api.get<Coordinator>(`${ADMIN_PATH}/${id}`);
  },

  /** Create new coordinator (admin only) */
  create: (data: CreateCoordinatorPayload): Promise<Coordinator> => {
    return api.post<Coordinator>(ADMIN_PATH, data);
  },

  /** Update coordinator (admin only) */
  update: (id: string, data: UpdateCoordinatorPayload): Promise<Coordinator> => {
    return api.put<Coordinator>(`${ADMIN_PATH}/${id}`, data);
  },

  /** Delete coordinator (admin only) */
  delete: (id: string): Promise<void> => {
    return api.delete(`${ADMIN_PATH}/${id}`);
  },

  /** Get my profile (for coordinators viewing their own profile) */
  getMyProfile: (): Promise<Coordinator> => {
    return api.get<Coordinator>(`${BASE_PATH}/me`);
  },
} as const;
