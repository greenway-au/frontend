/**
 * Participant Detail Page
 * View detailed information about a participant including:
 * - Overview information
 * - Activity (recent invoices)
 * - Linked providers
 * - Assigned coordinator
 */

import { useMemo, useState } from 'react';
import { createFileRoute, Link, useNavigate } from '@tanstack/react-router';
import { PageHeader } from '@/components/common/PageHeader';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@workspace/ui/components/card';
import { Badge } from '@workspace/ui/components/badge';
import { Button } from '@workspace/ui/components/button';
import { Avatar, AvatarFallback } from '@workspace/ui/components/avatar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@workspace/ui/components/tabs';
import {
  ChevronLeft,
  Receipt,
  FileX,
  Building2,
  UserCog,
  Link2,
  Loader2,
  Users,
  Calendar,
  DollarSign,
} from 'lucide-react';
import { ProtectedRoute } from '@/features/auth';
import { useParticipant } from '@/features/participants/api/participants.queries';
import {
  useProvidersByParticipant,
  useCoordinatorForParticipant,
} from '@/features/admin/api/relationships.queries';
import { useInvoices } from '@/features/invoices/api/invoices.queries';

export const Route = createFileRoute('/_dashboard/admin/participants/$participantId')({
  component: ParticipantDetailPage,
});

function ParticipantDetailPage() {
  const { participantId } = Route.useParams();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('overview');

  // Fetch data
  const { data: participant, isLoading: isLoadingParticipant } = useParticipant(participantId);
  const { data: providers, isLoading: isLoadingProviders } = useProvidersByParticipant(participantId);
  const { data: coordinator, isLoading: isLoadingCoordinator } = useCoordinatorForParticipant(participantId);
  const { data: invoicesData, isLoading: isLoadingInvoices } = useInvoices({
    participant_id: participantId,
    limit: 50,
  });

  // Sort invoices by date descending
  const sortedInvoices = useMemo(() => {
    return invoicesData?.invoices?.sort((a, b) =>
      new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
    ) || [];
  }, [invoicesData]);

  // Helper to get initials from name
  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  if (isLoadingParticipant) {
    return (
      <ProtectedRoute roles={['admin']}>
        <div className="flex items-center justify-center h-96">
          <Loader2 className="size-8 animate-spin text-muted-foreground" />
        </div>
      </ProtectedRoute>
    );
  }

  if (!participant) {
    return (
      <ProtectedRoute roles={['admin']}>
        <div className="space-y-6">
          <PageHeader
            title="Participant Not Found"
            description="The requested participant could not be found."
          />
          <Card>
            <CardContent className="pt-6">
              <div className="text-center py-8">
                <Users className="size-12 mx-auto mb-3 text-muted-foreground/50" />
                <p className="text-muted-foreground mb-4">
                  This participant does not exist or has been deleted.
                </p>
                <Button onClick={() => navigate({ to: '/admin/participants' })}>
                  <ChevronLeft className="size-4 mr-1" />
                  Back to Participants
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </ProtectedRoute>
    );
  }

  return (
    <ProtectedRoute roles={['admin']}>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate({ to: '/admin/participants' })}
          >
            <ChevronLeft className="size-4 mr-1" />
            Back
          </Button>
          <div className="flex-1">
            <h1 className="text-3xl font-bold tracking-tight">
              {participant.full_name || 'Unnamed Participant'}
            </h1>
            {participant.ndis_number && (
              <p className="text-muted-foreground">NDIS: {participant.ndis_number}</p>
            )}
          </div>
          <Badge variant={participant.status === 'active' ? 'default' : 'secondary'}>
            {participant.status}
          </Badge>
        </div>

        {/* Stats Cards */}
        <div className="grid gap-4 sm:grid-cols-3">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Plan Status</CardTitle>
              <Calendar className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {participant.plan_end_date
                  ? new Date(participant.plan_end_date) > new Date()
                    ? 'Active'
                    : 'Expired'
                  : 'Not Set'}
              </div>
              {participant.plan_end_date && (
                <p className="text-xs text-muted-foreground mt-1">
                  Expires {new Date(participant.plan_end_date).toLocaleDateString()}
                </p>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Invoices</CardTitle>
              <Receipt className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{invoicesData?.total ?? 0}</div>
              {invoicesData && invoicesData.total > 0 && (
                <p className="text-xs text-muted-foreground mt-1">
                  {invoicesData.invoices.filter((i) => i.status === 'paid').length} paid
                </p>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Active Providers</CardTitle>
              <Building2 className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {providers?.filter((p) => p.status === 'active').length ?? 0}
              </div>
              {providers && providers.length > 0 && (
                <p className="text-xs text-muted-foreground mt-1">
                  {providers.length} total linked
                </p>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="activity">Activity</TabsTrigger>
            <TabsTrigger value="providers">Providers</TabsTrigger>
            <TabsTrigger value="coordinator">Coordinator</TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Participant Information</CardTitle>
                <CardDescription>
                  Core details about {participant.full_name || 'this participant'}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <dl className="grid grid-cols-2 gap-4">
                  <div>
                    <dt className="text-sm font-medium text-muted-foreground">Full Name</dt>
                    <dd className="text-base mt-1">{participant.full_name || 'Not set'}</dd>
                  </div>
                  <div>
                    <dt className="text-sm font-medium text-muted-foreground">NDIS Number</dt>
                    <dd className="text-base mt-1">{participant.ndis_number || 'Not set'}</dd>
                  </div>
                  <div>
                    <dt className="text-sm font-medium text-muted-foreground">Plan Start Date</dt>
                    <dd className="text-base mt-1">
                      {participant.plan_start_date
                        ? new Date(participant.plan_start_date).toLocaleDateString()
                        : 'Not set'}
                    </dd>
                  </div>
                  <div>
                    <dt className="text-sm font-medium text-muted-foreground">Plan Expiry Date</dt>
                    <dd className="text-base mt-1">
                      {participant.plan_end_date
                        ? new Date(participant.plan_end_date).toLocaleDateString()
                        : 'Not set'}
                    </dd>
                  </div>
                  <div>
                    <dt className="text-sm font-medium text-muted-foreground">Starting Funding</dt>
                    <dd className="text-base mt-1 flex items-center gap-1">
                      {participant.starting_funding_amount ? (
                        <>
                          <DollarSign className="size-4 text-muted-foreground" />
                          {participant.starting_funding_amount.toLocaleString()}
                        </>
                      ) : (
                        'Not set'
                      )}
                    </dd>
                  </div>
                  <div>
                    <dt className="text-sm font-medium text-muted-foreground">Status</dt>
                    <dd className="mt-1">
                      <Badge variant={participant.status === 'active' ? 'default' : 'secondary'}>
                        {participant.status}
                      </Badge>
                    </dd>
                  </div>
                  <div>
                    <dt className="text-sm font-medium text-muted-foreground">Account Status</dt>
                    <dd className="mt-1">
                      {participant.user_id ? (
                        <Badge variant="outline" className="text-green-600 border-green-600">
                          Linked
                        </Badge>
                      ) : (
                        <Badge variant="outline" className="text-yellow-600 border-yellow-600">
                          No Account
                        </Badge>
                      )}
                    </dd>
                  </div>
                </dl>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Activity Tab */}
          <TabsContent value="activity" className="space-y-4">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="flex items-center gap-2">
                      <Receipt className="size-5" />
                      Recent Invoices
                    </CardTitle>
                    <CardDescription>
                      Invoice history for {participant.full_name || 'this participant'}
                    </CardDescription>
                  </div>
                  {sortedInvoices.length > 0 && (
                    <Badge variant="outline">{sortedInvoices.length} invoices</Badge>
                  )}
                </div>
              </CardHeader>
              <CardContent>
                {isLoadingInvoices ? (
                  <div className="flex justify-center py-8">
                    <Loader2 className="size-6 animate-spin" />
                  </div>
                ) : sortedInvoices.length === 0 ? (
                  <div className="text-center py-8 text-muted-foreground">
                    <FileX className="size-12 mx-auto mb-3 text-muted-foreground/50" />
                    <p>No invoices found</p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {sortedInvoices.map((invoice) => (
                      <div
                        key={invoice.id}
                        className="flex items-start gap-3 p-3 rounded-lg border hover:bg-muted/50 transition-colors"
                      >
                        <div
                          className={`size-10 rounded-full flex items-center justify-center flex-shrink-0 ${
                            invoice.status === 'paid'
                              ? 'bg-green-100'
                              : invoice.status === 'approved'
                              ? 'bg-blue-100'
                              : invoice.status === 'rejected'
                              ? 'bg-red-100'
                              : 'bg-yellow-100'
                          }`}
                        >
                          <Receipt
                            className={`size-5 ${
                              invoice.status === 'paid'
                                ? 'text-green-600'
                                : invoice.status === 'approved'
                                ? 'text-blue-600'
                                : invoice.status === 'rejected'
                                ? 'text-red-600'
                                : 'text-yellow-600'
                            }`}
                          />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between gap-2">
                            <p className="font-medium truncate">
                              {invoice.metadata?.invoice_number ||
                                `Invoice ${invoice.id.slice(0, 8)}`}
                            </p>
                            <span className="text-sm font-semibold flex-shrink-0">
                              ${invoice.metadata?.amount?.toFixed(2) || '0.00'}
                            </span>
                          </div>
                          <p className="text-sm text-muted-foreground truncate">
                            {invoice.provider_name || 'Unknown Provider'}
                          </p>
                          <div className="flex items-center gap-2 mt-1 flex-wrap">
                            <Badge
                              variant={
                                invoice.status === 'paid'
                                  ? 'default'
                                  : invoice.status === 'approved'
                                  ? 'secondary'
                                  : invoice.status === 'rejected'
                                  ? 'destructive'
                                  : 'outline'
                              }
                            >
                              {invoice.status}
                            </Badge>
                            {invoice.validation_result && (
                              <Badge
                                variant={
                                  invoice.validation_result.status === 'valid'
                                    ? 'default'
                                    : invoice.validation_result.status === 'invalid'
                                    ? 'destructive'
                                    : 'secondary'
                                }
                              >
                                {invoice.validation_result.status}
                              </Badge>
                            )}
                            <span className="text-xs text-muted-foreground">
                              {new Date(invoice.created_at).toLocaleDateString()}
                            </span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Providers Tab */}
          <TabsContent value="providers" className="space-y-4">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="flex items-center gap-2">
                      <Building2 className="size-5" />
                      Linked Providers
                    </CardTitle>
                    <CardDescription>
                      Service providers working with {participant.full_name || 'this participant'}
                    </CardDescription>
                  </div>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => navigate({ to: '/admin/relationships' })}
                  >
                    <Link2 className="size-4 mr-1" />
                    Manage
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                {isLoadingProviders ? (
                  <div className="flex justify-center py-8">
                    <Loader2 className="size-6 animate-spin" />
                  </div>
                ) : !providers?.length ? (
                  <div className="text-center py-8">
                    <Building2 className="size-12 mx-auto mb-3 text-muted-foreground/50" />
                    <p className="text-muted-foreground">No providers linked</p>
                    <Button
                      size="sm"
                      variant="outline"
                      className="mt-4"
                      onClick={() => navigate({ to: '/admin/relationships' })}
                    >
                      Link Provider
                    </Button>
                  </div>
                ) : (
                  <div className="space-y-2">
                    {providers.map((rel) => (
                      <div
                        key={rel.id}
                        className="flex items-center justify-between p-3 rounded-lg border hover:bg-muted/50 transition-colors"
                      >
                        <div className="flex items-center gap-3">
                          <div className="size-10 rounded-full bg-green-100 flex items-center justify-center flex-shrink-0">
                            <Building2 className="size-5 text-green-600" />
                          </div>
                          <div className="min-w-0">
                            <p className="font-medium truncate">
                              {rel.provider_name || 'Unknown Provider'}
                            </p>
                            <div className="flex items-center gap-2 mt-1 flex-wrap">
                              <Badge variant={rel.status === 'active' ? 'default' : 'secondary'}>
                                {rel.status}
                              </Badge>
                              {rel.start_date && (
                                <span className="text-xs text-muted-foreground">
                                  Since {new Date(rel.start_date).toLocaleDateString()}
                                </span>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Coordinator Tab */}
          <TabsContent value="coordinator" className="space-y-4">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="flex items-center gap-2">
                      <UserCog className="size-5" />
                      Support Coordinator
                    </CardTitle>
                    <CardDescription>
                      Coordinator managing {participant.full_name || 'this participant'}'s plan
                    </CardDescription>
                  </div>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => navigate({ to: '/admin/relationships' })}
                  >
                    <Link2 className="size-4 mr-1" />
                    Manage
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                {isLoadingCoordinator ? (
                  <div className="flex justify-center py-8">
                    <Loader2 className="size-6 animate-spin" />
                  </div>
                ) : !coordinator ? (
                  <div className="text-center py-8">
                    <UserCog className="size-12 mx-auto mb-3 text-muted-foreground/50" />
                    <p className="text-muted-foreground">No coordinator assigned</p>
                    <Button
                      size="sm"
                      variant="outline"
                      className="mt-4"
                      onClick={() => navigate({ to: '/admin/relationships' })}
                    >
                      Assign Coordinator
                    </Button>
                  </div>
                ) : (
                  <div className="flex items-center gap-3 p-4 rounded-lg border">
                    <Avatar className="size-12">
                      <AvatarFallback className="bg-purple-100 text-purple-600">
                        {getInitials(coordinator.coordinator_name || 'C')}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-lg truncate">
                        {coordinator.coordinator_name || 'Unknown'}
                      </p>
                      {coordinator.organization && (
                        <p className="text-sm text-muted-foreground truncate">
                          {coordinator.organization}
                        </p>
                      )}
                      <div className="flex items-center gap-2 mt-2 flex-wrap">
                        {coordinator.is_primary && (
                          <Badge variant="secondary">Primary</Badge>
                        )}
                        <Badge variant={coordinator.status === 'active' ? 'default' : 'secondary'}>
                          {coordinator.status}
                        </Badge>
                        {coordinator.start_date && (
                          <span className="text-xs text-muted-foreground">
                            Since {new Date(coordinator.start_date).toLocaleDateString()}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </ProtectedRoute>
  );
}
