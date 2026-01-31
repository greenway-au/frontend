/**
 * Provider Detail Page
 * View detailed information about a specific provider
 */

import { createFileRoute } from '@tanstack/react-router';
import { PageHeader } from '@/components/common/PageHeader';
import { ProtectedRoute } from '@/features/auth';
import {
  useProvider,
  useParticipantsByProvider,
  EntityInfoSection,
  RelationshipsList,
  RecentActivitySection,
} from '@/features/admin';
import { useInvoices } from '@/features/invoices';
import { ArrowLeft } from 'lucide-react';

export const Route = createFileRoute('/_dashboard/admin/providers/$providerId')({
  component: ProviderDetailPage,
});

function ProviderDetailPage() {
  const { providerId } = Route.useParams();

  // Parallel queries for optimal performance
  const { data: provider, isLoading: isLoadingProvider } = useProvider(providerId);
  const { data: participants } = useParticipantsByProvider(providerId);
  const { data: invoices, isLoading: isLoadingInvoices } = useInvoices({
    provider_id: providerId,
    limit: 10,
  });

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
          title={provider?.name || 'Loading...'}
          description={`ABN: ${provider?.abn || '-'}`}
          action={{
            label: 'Back',
            onClick: () => window.history.back(),
            icon: <ArrowLeft className="size-4 mr-2" />,
            variant: 'outline',
          }}
        />

        {isLoadingProvider ? (
          <div className="py-12 text-center">
            <div className="size-8 border-2 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4" />
            <p className="text-sm text-muted-foreground">Loading provider details...</p>
          </div>
        ) : !provider ? (
          <div className="py-12 text-center">
            <p className="text-sm text-muted-foreground">Provider not found</p>
          </div>
        ) : (
          <>
            <EntityInfoSection
              title="Provider Information"
              status={provider.status}
              fields={[
                { label: 'Name', value: provider.name },
                { label: 'ABN', value: provider.abn },
                { label: 'Email', value: provider.contact_email },
                { label: 'Phone', value: provider.contact_phone },
                { label: 'Address', value: provider.address },
                {
                  label: 'Service Types',
                  value: provider.service_types?.join(', ') || 'None specified',
                },
                {
                  label: 'Account Status',
                  value: provider.user_id ? 'Account Linked' : 'No Account',
                },
              ]}
            />

            <RelationshipsList
              title="Client Connections"
              entities={participantsList}
              type="participant"
              emptyMessage="No participants linked to this provider"
            />

            <RecentActivitySection
              invoices={invoices}
              isLoading={isLoadingInvoices}
              showViewAll={true}
            />
          </>
        )}
      </div>
    </ProtectedRoute>
  );
}
