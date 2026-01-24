import { api } from '@/lib/api';
import type {
  Participant,
  ParticipantsListResponse,
  CreateParticipantPayload,
  UpdateParticipantPayload,
} from '../types/participant.types';

const BASE_PATH = '/api/v1/participants';

export const participantsApi = {
  /** Get paginated list of participants */
  list: (params?: { limit?: number; offset?: number }): Promise<ParticipantsListResponse> => {
    return api.get<ParticipantsListResponse>(BASE_PATH, { params });
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
    return api.put<Participant>(`${BASE_PATH}/${id}`, data);
  },

  /** Delete participant */
  delete: (id: string): Promise<void> => {
    return api.delete(`${BASE_PATH}/${id}`);
  },
} as const;
