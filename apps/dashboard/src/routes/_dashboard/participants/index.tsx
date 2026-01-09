/**
 * Participants List Route
 * Shows all participants with filtering and search
 */

import { createFileRoute } from '@tanstack/react-router';
import { PageHeader } from '@/components/common/PageHeader';
import { ParticipantList } from '@/features/participants';

export const Route = createFileRoute('/_dashboard/participants/')({
  component: ParticipantsPage,
});

function ParticipantsPage() {
  return (
    <div className="space-y-6">
      <PageHeader
        title="Participants"
        description="Manage NDIS participants and their plans"
        action={{
          label: 'Add Participant',
          href: '/participants/new',
        }}
      />
      <ParticipantList />
    </div>
  );
}
