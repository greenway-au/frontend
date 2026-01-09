/**
 * Participants Feature
 * Public exports for participants module
 */

// Components
export { ParticipantCard } from './components/ParticipantCard';
export { ParticipantList } from './components/ParticipantList';
export { ParticipantForm } from './components/ParticipantForm';
export { ParticipantDetail } from './components/ParticipantDetail';
export {
  ParticipantSkeleton,
  ParticipantCardSkeleton,
  ParticipantDetailSkeleton,
} from './components/ParticipantSkeleton';

// Query Hooks
export {
  participantKeys,
  useParticipants,
  useParticipant,
  useCreateParticipant,
  useUpdateParticipant,
  useDeleteParticipant,
  usePrefetchParticipant,
} from './api/participants.queries';

// API
export { participantsApi } from './api/participants.api';

// Types
export type {
  Participant,
  ParticipantListItem,
  ParticipantStatus,
  ParticipantFilters,
  CreateParticipantPayload,
  UpdateParticipantPayload,
  Plan,
  PlanStatus,
} from './types/participant.types';

// Schemas
export {
  createParticipantSchema,
  updateParticipantSchema,
  addressSchema,
  type CreateParticipantInput,
  type UpdateParticipantInput,
} from './schemas/participant.schema';
