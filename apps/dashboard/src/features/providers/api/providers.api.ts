import { api } from '@/lib/api';
import type {
  Provider,
  ProvidersListResponse,
  CreateProviderPayload,
  UpdateProviderPayload,
} from '../types/provider.types';

const BASE_PATH = '/api/v1/providers';
const ADMIN_PATH = '/api/v1/admin/providers';

export const providersApi = {
  // Admin-only routes (use ADMIN_PATH)
  list: (params?: { limit?: number; offset?: number }): Promise<ProvidersListResponse> => {
    return api.get<ProvidersListResponse>(ADMIN_PATH, { params });
  },

  get: (id: string): Promise<Provider> => {
    return api.get<Provider>(`${ADMIN_PATH}/${id}`);
  },

  create: (data: CreateProviderPayload): Promise<Provider> => {
    return api.post<Provider>(ADMIN_PATH, data);
  },

  update: (id: string, data: UpdateProviderPayload): Promise<Provider> => {
    return api.put<Provider>(`${ADMIN_PATH}/${id}`, data);
  },

  delete: (id: string): Promise<void> => {
    return api.delete(`${ADMIN_PATH}/${id}`);
  },

  // Non-admin routes (use BASE_PATH)
  getMyProfile: (): Promise<Provider> => {
    return api.get<Provider>(`${BASE_PATH}/me`);
  },
} as const;
