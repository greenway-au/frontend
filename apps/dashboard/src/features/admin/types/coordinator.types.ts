/**
 * Coordinator Types
 * Type definitions for coordinator entities
 */

import type { BaseEntity } from '@/types/common';

export type CoordinatorStatus = 'active' | 'inactive' | 'pending';

export interface Coordinator extends BaseEntity {
  user_id?: string | null;
  full_name: string;
  email?: string | null;
  phone?: string | null;
  organization?: string | null;
  status: CoordinatorStatus;
}

export interface CreateCoordinatorPayload {
  full_name: string;
  email?: string;
  phone?: string;
  organization?: string;
  status?: CoordinatorStatus;
}

export interface UpdateCoordinatorPayload {
  full_name?: string;
  email?: string;
  phone?: string;
  organization?: string;
  status?: CoordinatorStatus;
}

export interface CoordinatorsListResponse {
  coordinators: Coordinator[];
  total: number;
  limit: number;
  offset: number;
}
