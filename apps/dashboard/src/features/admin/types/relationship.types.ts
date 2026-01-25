/**
 * Relationship Types
 * Type definitions for client-provider and client-coordinator relationships
 */

import type { BaseEntity } from '@/types/common';

// Status types
export type RelationshipStatus = 'active' | 'inactive' | 'pending';
export type AssignmentStatus = 'active' | 'inactive';

// Client-Provider Relationship
export interface ClientProviderRelationship extends BaseEntity {
  participant_id: string;
  provider_id: string;
  status: RelationshipStatus;
  start_date?: string | null;
  end_date?: string | null;
  created_by?: string | null;
}

export interface CreateClientProviderPayload {
  participant_id: string;
  provider_id: string;
  status?: RelationshipStatus;
  start_date?: string;
  end_date?: string;
}

export interface UpdateClientProviderPayload {
  status?: RelationshipStatus;
  start_date?: string;
  end_date?: string;
}

// Client-Coordinator Assignment
export interface ClientCoordinatorAssignment extends BaseEntity {
  participant_id: string;
  coordinator_id: string;
  is_primary: boolean;
  status: AssignmentStatus;
  start_date?: string | null;
  end_date?: string | null;
  created_by?: string | null;
}

export interface AssignCoordinatorPayload {
  participant_id: string;
  coordinator_id: string;
  is_primary?: boolean;
  status?: AssignmentStatus;
  start_date?: string;
  end_date?: string;
}

export interface UpdateCoordinatorAssignmentPayload {
  is_primary?: boolean;
  status?: AssignmentStatus;
  start_date?: string;
  end_date?: string;
}

// List response types - backend returns arrays directly
export type ClientProviderListResponse = ClientProviderRelationship[];

export type ClientCoordinatorListResponse = ClientCoordinatorAssignment[];
