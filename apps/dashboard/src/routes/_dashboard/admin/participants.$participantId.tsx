/**
 * Participant Detail Page
 * View detailed information about a specific participant
 */

import { createFileRoute } from '@tanstack/react-router';
import { useAtomValue } from 'jotai';
import { userAtom } from '@/stores/auth';
import { PageHeader } from '@/components/common/PageHeader';
import { ProtectedRoute } from '@/features/auth';
import {
  useParticipant,
  useProvidersByParticipant,
  useCoordinatorForParticipant,
  EntityInfoSection,
  RelationshipsList,
  RecentActivitySection,
} from '@/features/admin';
import { useInvoices } from '@/features/invoices';
import { NDISPlansSection } from '@/features/ndis-plans';
import { ArrowLeft } from 'lucide-react';

export const Route = createFileRoute('/_dashboard/admin/participants/$participantId')({
  component: ParticipantDetailPage,
});

function ParticipantDetailPage() {
  const { participantId } = Route.useParams();
  const user = useAtomValue(userAtom);

  // Check permissions
  const isAdmin = user?.userType === 'admin';
  const isCoordinator = user?.userType === 'coordinator';
  const canManagePlans = isAdmin || isCoordinator;

  // Parallel queries for optimal performance
  const { data: participant, isLoading: isLoadingParticipant } = useParticipant(participantId);
  const { data: providers } = useProvidersByParticipant(participantId);
  const { data: coordinator } = useCoordinatorForParticipant(participantId);
  const { data: invoices, isLoading: isLoadingInvoices } = useInvoices({
    participant_id: participantId,
    limit: 10,
  });

  // Transform providers for RelationshipsList component
  const providersList = providers?.map((p) => ({
    id: p.id,
    name: p.name,
    status: p.status,
    subtitle: p.service_types?.join(', ') || undefined,
  }));

  // Transform coordinator for RelationshipsList component
  const coordinatorList = coordinator
    ? [
        {
          id: coordinator.id,
          name: coordinator.full_name,
          status: coordinator.status,
          subtitle: coordinator.organization || undefined,
        },
      ]
    : [];

  return (
    <ProtectedRoute roles={['admin']}>
      <div className="space-y-6">
        <PageHeader
          title={participant?.full_name || 'Loading...'}
          description={`NDIS Number: ${participant?.ndis_number || '-'}`}
          action={{
            label: 'Back',
            onClick: () => window.history.back(),
            icon: <ArrowLeft className="size-4 mr-2" />,
            variant: 'outline',
          }}
        />

        {isLoadingParticipant ? (
          <div className="py-12 text-center">
            <div className="size-8 border-2 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4" />
            <p className="text-sm text-muted-foreground">Loading participant details...</p>
          </div>
        ) : !participant ? (
          <div className="py-12 text-center">
            <p className="text-sm text-muted-foreground">Participant not found</p>
          </div>
        ) : (
          <>
            <EntityInfoSection
              title="Participant Information"
              status={participant.status}
              fields={[
                { label: 'Full Name', value: participant.full_name },
                { label: 'NDIS Number', value: participant.ndis_number },
                { label: 'Plan Start Date', value: participant.plan_start_date, format: 'date' },
                { label: 'Plan End Date', value: participant.plan_end_date, format: 'date' },
                {
                  label: 'Starting Funding',
                  value: participant.starting_funding_amount,
                  format: 'currency',
                },
                {
                  label: 'Account Status',
                  value: participant.user_id ? 'Account Linked' : 'No Account',
                },
              ]}
            />

            <RelationshipsList
              title="Linked Providers"
              entities={providersList}
              type="provider"
              emptyMessage="No providers linked to this participant"
            />

            <RelationshipsList
              title="Assigned Coordinator"
              entities={coordinatorList}
              type="coordinator"
              emptyMessage="No coordinator assigned to this participant"
            />

            <RecentActivitySection
              invoices={invoices}
              isLoading={isLoadingInvoices}
              showViewAll={true}
            />

            <NDISPlansSection
              participantId={participantId}
              canUpload={canManagePlans}
              canEdit={canManagePlans}
            />
          </>
        )}
      </div>
    </ProtectedRoute>
  );
}
