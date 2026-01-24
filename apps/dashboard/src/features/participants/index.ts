/**
 * Participants Feature
 * Public exports for participants module
 */

// Components
export { ParticipantCard } from './components/ParticipantCard';
export { ParticipantList } from './components/ParticipantList';
export { ParticipantForm } from './components/ParticipantForm';
export { ParticipantDetail } from './components/ParticipantDetail';
export { ParticipantSkeleton } from './components/ParticipantSkeleton';

// Query Hooks
export {
  participantKeys,
  useParticipants,
  useParticipant,
  useCreateParticipant,
  useUpdateParticipant,
  useDeleteParticipant,
} from './api/participants.queries';

// API
export { participantsApi } from './api/participants.api';

// Types
export type {
  Participant,
  CreateParticipantPayload,
  UpdateParticipantPayload,
  ParticipantsListResponse,
} from './types/participant.types';

// Schemas
export {
  createParticipantSchema,
  updateParticipantSchema,
  type CreateParticipantFormData,
  type UpdateParticipantFormData,
} from './schemas/participant.schema';
