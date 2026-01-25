/**
 * Admin API Index
 * Re-export all admin API functions and hooks
 */

// Coordinators
export { coordinatorsApi } from './coordinators.api';
export {
  coordinatorKeys,
  useCoordinators,
  useCoordinator,
  useCreateCoordinator,
  useUpdateCoordinator,
  useDeleteCoordinator,
} from './coordinators.queries';

// Invitations
export { invitationsApi } from './invitations.api';
export {
  invitationKeys,
  useInvitations,
  useInvitation,
  useCreateInvitation,
  useRevokeInvitation,
  useValidateInvitation,
  useAcceptInvitation,
} from './invitations.queries';

// Re-export participant and provider APIs for admin convenience
export { participantsApi } from '@/features/participants/api/participants.api';
export {
  participantKeys,
  useParticipants,
  useParticipant,
  useCreateParticipant,
  useUpdateParticipant,
  useDeleteParticipant,
} from '@/features/participants/api/participants.queries';

export { providersApi } from '@/features/providers/api/providers.api';
export {
  providerKeys,
  useProviders,
  useProvider,
  useCreateProvider,
  useUpdateProvider,
  useDeleteProvider,
} from '@/features/providers/api/providers.queries';
