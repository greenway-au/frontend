import type { BaseEntity } from '@/types/common';

export interface Provider extends BaseEntity {
  user_id?: string | null;
  name: string;
  abn?: string | null;
  contact_email?: string | null;
  contact_phone?: string | null;
  address?: string | null;
  service_types: string[];
  status: 'active' | 'inactive' | 'pending';
}

export interface CreateProviderPayload {
  name: string;
  abn?: string;
  contact_email?: string;
  contact_phone?: string;
  address?: string;
  service_types?: string[];
  status?: 'active' | 'inactive' | 'pending';
}

export interface UpdateProviderPayload {
  name?: string;
  abn?: string;
  contact_email?: string;
  contact_phone?: string;
  address?: string;
  service_types?: string[];
  status?: 'active' | 'inactive' | 'pending';
}

export interface ProvidersListResponse {
  providers: Provider[];
  total: number;
  limit: number;
  offset: number;
}
