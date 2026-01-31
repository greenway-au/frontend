/**
 * Coordinator Detail Page
 * View detailed information about a specific coordinator
 */

import { createFileRoute } from '@tanstack/react-router';
import { PageHeader } from '@/components/common/PageHeader';
import { ProtectedRoute } from '@/features/auth';
import {
  useCoordinator,
  useParticipantsByCoordinator,
  EntityInfoSection,
  RelationshipsList,
} from '@/features/admin';
import { ArrowLeft } from 'lucide-react';

export const Route = createFileRoute('/_dashboard/admin/coordinators/$coordinatorId')({
  component: CoordinatorDetailPage,
});

function CoordinatorDetailPage() {
  const { coordinatorId } = Route.useParams();

  // Parallel queries for optimal performance
  const { data: coordinator, isLoading: isLoadingCoordinator } = useCoordinator(coordinatorId);
  const { data: participants } = useParticipantsByCoordinator(coordinatorId);

  // Transform participants for RelationshipsList component
  const participantsList = participants?.map((p) => ({
    id: p.id,
    name: p.full_name || 'Unnamed',
    status: p.status,
    subtitle: p.ndis_number || undefined,
  }));

  return (
    <ProtectedRoute roles={['admin']}>
      <div className="space-y-6">
        <PageHeader
          title={coordinator?.full_name || 'Loading...'}
          description={coordinator?.organization || 'Coordinator'}
          action={{
            label: 'Back',
            onClick: () => window.history.back(),
            icon: <ArrowLeft className="size-4 mr-2" />,
            variant: 'outline',
          }}
        />

        {isLoadingCoordinator ? (
          <div className="py-12 text-center">
            <div className="size-8 border-2 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4" />
            <p className="text-sm text-muted-foreground">Loading coordinator details...</p>
          </div>
        ) : !coordinator ? (
          <div className="py-12 text-center">
            <p className="text-sm text-muted-foreground">Coordinator not found</p>
          </div>
        ) : (
          <>
            <EntityInfoSection
              title="Coordinator Information"
              status={coordinator.status}
              fields={[
                { label: 'Full Name', value: coordinator.full_name },
                { label: 'Email', value: coordinator.email },
                { label: 'Phone', value: coordinator.phone },
                { label: 'Organization', value: coordinator.organization },
                {
                  label: 'Account Status',
                  value: coordinator.user_id ? 'Account Linked' : 'No Account',
                },
              ]}
            />

            <RelationshipsList
              title="Assigned Participants"
              entities={participantsList}
              type="participant"
              emptyMessage="No participants assigned to this coordinator"
            />
          </>
        )}
      </div>
    </ProtectedRoute>
  );
}
