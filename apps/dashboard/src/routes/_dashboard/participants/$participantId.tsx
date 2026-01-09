/**
 * Participant Detail Route
 * Shows full participant details
 */

import { createFileRoute, useNavigate } from '@tanstack/react-router';
import { PageHeader } from '@/components/common/PageHeader';
import {
  ParticipantDetail,
  ParticipantDetailSkeleton,
  useParticipant,
  useDeleteParticipant,
} from '@/features/participants';
import { ErrorFallback } from '@/components/common/ErrorFallback';
import { useConfirm } from '@/hooks';
import { useToast } from '@/hooks';

export const Route = createFileRoute('/_dashboard/participants/$participantId')({
  component: ParticipantDetailPage,
});

function ParticipantDetailPage() {
  const { participantId } = Route.useParams();
  const navigate = useNavigate();
  const { confirm } = useConfirm();
  const { success, error } = useToast();

  const { data: participant, isLoading, isError, error: fetchError } = useParticipant(participantId);
  const deleteMutation = useDeleteParticipant();

  const handleEdit = () => {
    // TODO: Navigate to edit page when route is created
    console.log('Edit participant:', participantId);
  };

  const handleDelete = async () => {
    const confirmed = await confirm({
      title: 'Delete Participant',
      message: `Are you sure you want to delete ${participant?.firstName} ${participant?.lastName}? This action cannot be undone.`,
      variant: 'destructive',
      confirmLabel: 'Delete',
    });

    if (confirmed) {
      try {
        await deleteMutation.mutateAsync(participantId);
        success('Participant deleted', 'The participant has been removed.');
        navigate({ to: '/participants' });
      } catch {
        error('Failed to delete', 'An error occurred while deleting the participant.');
      }
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <PageHeader
          title="Loading..."
          backLink={{ to: '/participants', label: 'Back to Participants' }}
        />
        <ParticipantDetailSkeleton />
      </div>
    );
  }

  if (isError || !participant) {
    return (
      <div className="space-y-6">
        <PageHeader
          title="Participant"
          backLink={{ to: '/participants', label: 'Back to Participants' }}
        />
        <ErrorFallback
          error={fetchError}
          showBack
          backTo="/participants"
        />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title={`${participant.firstName} ${participant.lastName}`}
        description={`NDIS: ${participant.ndisNumber}`}
        backLink={{ to: '/participants', label: 'Back to Participants' }}
      />
      <ParticipantDetail
        participant={participant}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />
    </div>
  );
}
