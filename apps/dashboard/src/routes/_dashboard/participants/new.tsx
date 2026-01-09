/**
 * New Participant Route
 * Form to create a new participant
 */

import { createFileRoute } from '@tanstack/react-router';
import { PageHeader } from '@/components/common/PageHeader';
import { ParticipantForm } from '@/features/participants';

export const Route = createFileRoute('/_dashboard/participants/new')({
  component: NewParticipantPage,
});

function NewParticipantPage() {
  return (
    <div className="space-y-6">
      <PageHeader
        title="Add New Participant"
        description="Enter the details for the new NDIS participant"
        backLink={{
          to: '/participants',
          label: 'Back to Participants',
        }}
      />
      <ParticipantForm />
    </div>
  );
}
