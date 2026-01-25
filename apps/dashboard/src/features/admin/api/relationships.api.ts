/**
 * Relationships API
 * API calls for relationship management
 */

import { api } from '@/lib/api';
import type {
  ClientProviderRelationship,
  ClientProviderListResponse,
  CreateClientProviderPayload,
  UpdateClientProviderPayload,
  ClientCoordinatorAssignment,
  ClientCoordinatorListResponse,
  AssignCoordinatorPayload,
  UpdateCoordinatorAssignmentPayload,
} from '../types/relationship.types';

// Admin routes
const ADMIN_RELATIONSHIPS_PATH = '/api/v1/admin/relationships';
const ADMIN_PARTICIPANTS_PATH = '/api/v1/admin/participants';
const ADMIN_PROVIDERS_PATH = '/api/v1/admin/providers';
const ADMIN_COORDINATORS_PATH = '/api/v1/admin/coordinators';

// Role-specific "me" routes
const COORDINATORS_ME_PATH = '/api/v1/coordinators/me';
const PROVIDERS_ME_PATH = '/api/v1/providers/me';
const PARTICIPANTS_ME_PATH = '/api/v1/participants/me';

export const relationshipsApi = {
  // ============================================
  // Admin: Client-Provider Relationships
  // ============================================

  /** Create a client-provider relationship (admin only) */
  createClientProvider: (data: CreateClientProviderPayload): Promise<ClientProviderRelationship> => {
    return api.post<ClientProviderRelationship>(`${ADMIN_RELATIONSHIPS_PATH}/client-provider`, data);
  },

  /** Update a client-provider relationship (admin only) */
  updateClientProvider: (id: string, data: UpdateClientProviderPayload): Promise<ClientProviderRelationship> => {
    return api.put<ClientProviderRelationship>(`${ADMIN_RELATIONSHIPS_PATH}/client-provider/${id}`, data);
  },

  /** Delete a client-provider relationship (admin only) */
  deleteClientProvider: (id: string): Promise<void> => {
    return api.delete(`${ADMIN_RELATIONSHIPS_PATH}/client-provider/${id}`);
  },

  /** List providers for a participant (admin only) */
  listProvidersByParticipant: (participantId: string): Promise<ClientProviderListResponse> => {
    return api.get<ClientProviderListResponse>(`${ADMIN_PARTICIPANTS_PATH}/${participantId}/providers`);
  },

  /** List participants for a provider (admin only) */
  listParticipantsByProvider: (providerId: string): Promise<ClientProviderListResponse> => {
    return api.get<ClientProviderListResponse>(`${ADMIN_PROVIDERS_PATH}/${providerId}/participants`);
  },

  // ============================================
  // Admin: Client-Coordinator Assignments
  // ============================================

  /** Assign a coordinator to a participant (admin only) */
  assignCoordinator: (data: AssignCoordinatorPayload): Promise<ClientCoordinatorAssignment> => {
    return api.post<ClientCoordinatorAssignment>(`${ADMIN_RELATIONSHIPS_PATH}/client-coordinator`, data);
  },

  /** Update a coordinator assignment (admin only) */
  updateCoordinatorAssignment: (id: string, data: UpdateCoordinatorAssignmentPayload): Promise<ClientCoordinatorAssignment> => {
    return api.put<ClientCoordinatorAssignment>(`${ADMIN_RELATIONSHIPS_PATH}/client-coordinator/${id}`, data);
  },

  /** Delete a coordinator assignment (admin only) */
  deleteCoordinatorAssignment: (id: string): Promise<void> => {
    return api.delete(`${ADMIN_RELATIONSHIPS_PATH}/client-coordinator/${id}`);
  },

  /** Get the coordinator for a participant (admin only) */
  getCoordinatorForParticipant: (participantId: string): Promise<ClientCoordinatorAssignment> => {
    return api.get<ClientCoordinatorAssignment>(`${ADMIN_PARTICIPANTS_PATH}/${participantId}/coordinator`);
  },

  /** List participants for a coordinator (admin only) */
  listParticipantsByCoordinator: (coordinatorId: string): Promise<ClientCoordinatorListResponse> => {
    return api.get<ClientCoordinatorListResponse>(`${ADMIN_COORDINATORS_PATH}/${coordinatorId}/participants`);
  },

  // ============================================
  // Role-specific "me" endpoints
  // ============================================

  /** Get my assigned participants as a coordinator */
  getMyParticipantsAsCoordinator: (): Promise<ClientCoordinatorListResponse> => {
    return api.get<ClientCoordinatorListResponse>(`${COORDINATORS_ME_PATH}/participants`);
  },

  /** Get my linked participants as a provider */
  getMyParticipantsAsProvider: (): Promise<ClientProviderListResponse> => {
    return api.get<ClientProviderListResponse>(`${PROVIDERS_ME_PATH}/participants`);
  },

  /** Get my linked providers as a participant/client */
  getMyProvidersAsClient: (): Promise<ClientProviderListResponse> => {
    return api.get<ClientProviderListResponse>(`${PARTICIPANTS_ME_PATH}/providers`);
  },

  /** Get my assigned coordinator as a participant/client */
  getMyCoordinatorAsClient: (): Promise<ClientCoordinatorAssignment> => {
    return api.get<ClientCoordinatorAssignment>(`${PARTICIPANTS_ME_PATH}/coordinator`);
  },
} as const;
