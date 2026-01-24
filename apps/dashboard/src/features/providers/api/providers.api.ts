import { api } from '@/lib/api';
import type {
  Provider,
  ProvidersListResponse,
  CreateProviderPayload,
  UpdateProviderPayload,
} from '../types/provider.types';

const BASE_PATH = '/api/v1/providers';

export const providersApi = {
  list: (params?: { limit?: number; offset?: number }): Promise<ProvidersListResponse> => {
    return api.get<ProvidersListResponse>(BASE_PATH, { params });
  },

  get: (id: string): Promise<Provider> => {
    return api.get<Provider>(`${BASE_PATH}/${id}`);
  },

  getMyProfile: (): Promise<Provider> => {
    return api.get<Provider>(`${BASE_PATH}/me`);
  },

  create: (data: CreateProviderPayload): Promise<Provider> => {
    return api.post<Provider>(BASE_PATH, data);
  },

  update: (id: string, data: UpdateProviderPayload): Promise<Provider> => {
    return api.put<Provider>(`${BASE_PATH}/${id}`, data);
  },

  delete: (id: string): Promise<void> => {
    return api.delete(`${BASE_PATH}/${id}`);
  },
} as const;
