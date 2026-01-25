export interface BaseEntity {
  id: string;
  created_at: string;
  updated_at: string;
}

export interface Participant extends BaseEntity {
  user_id?: string | null; // Nullable - set when invitation is accepted
  full_name?: string | null;
  ndis_number?: string | null;
  plan_start_date?: string | null; // ISO date (YYYY-MM-DD)
  plan_end_date?: string | null;
  starting_funding_amount?: number | null;
  status: 'active' | 'inactive';
}

export interface CreateParticipantPayload {
  full_name?: string;
  ndis_number?: string;
  plan_start_date?: string;
  plan_end_date?: string;
  starting_funding_amount?: number;
  status?: 'active' | 'inactive';
}

export interface UpdateParticipantPayload {
  full_name?: string;
  ndis_number?: string;
  plan_start_date?: string;
  plan_end_date?: string;
  starting_funding_amount?: number;
  status?: 'active' | 'inactive';
}

export interface ParticipantsListResponse {
  participants: Participant[];
  total: number;
  limit: number;
  offset: number;
}
