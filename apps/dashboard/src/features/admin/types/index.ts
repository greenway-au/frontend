/**
 * Admin Types Index
 * Re-export all admin-related types
 */

export * from './coordinator.types';
export * from './invitation.types';

// Re-export from other features for convenience
export type {
  Participant,
  CreateParticipantPayload,
  UpdateParticipantPayload,
  ParticipantsListResponse,
} from '@/features/participants/types/participant.types';

export type {
  Provider,
  CreateProviderPayload,
  UpdateProviderPayload,
  ProvidersListResponse,
} from '@/features/providers/types/provider.types';
