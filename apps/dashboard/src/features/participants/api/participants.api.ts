/**
 * Participants API
 * API calls for participant endpoints
 */

import { api } from '@/lib/api';
import type { PaginatedResponse } from '@/types/api';
import type {
  Participant,
  ParticipantListItem,
  ParticipantFilters,
  CreateParticipantPayload,
  UpdateParticipantPayload,
} from '../types/participant.types';

const BASE_PATH = '/api/v1/participants';

export const participantsApi = {
  /** Get paginated list of participants */
  list: (filters: ParticipantFilters = {}): Promise<PaginatedResponse<ParticipantListItem>> => {
    return api.get<PaginatedResponse<ParticipantListItem>>(BASE_PATH, {
      params: {
        search: filters.search,
        status: filters.status,
        page: filters.page,
        limit: filters.limit,
      },
    });
  },

  /** Get single participant by ID */
  get: (id: string): Promise<Participant> => {
    return api.get<Participant>(`${BASE_PATH}/${id}`);
  },

  /** Create new participant */
  create: (data: CreateParticipantPayload): Promise<Participant> => {
    return api.post<Participant>(BASE_PATH, data);
  },

  /** Update participant */
  update: (id: string, data: UpdateParticipantPayload): Promise<Participant> => {
    return api.patch<Participant>(`${BASE_PATH}/${id}`, data);
  },

  /** Delete participant */
  delete: (id: string): Promise<void> => {
    return api.delete(`${BASE_PATH}/${id}`);
  },

  /** Get participant's plans */
  getPlans: (participantId: string) => {
    return api.get(`${BASE_PATH}/${participantId}/plans`);
  },

  /** Export participants to CSV */
  export: (filters: ParticipantFilters = {}): Promise<Blob> => {
    return api.get(`${BASE_PATH}/export`, {
      params: {
        search: filters.search,
        status: filters.status,
      },
    });
  },
} as const;
