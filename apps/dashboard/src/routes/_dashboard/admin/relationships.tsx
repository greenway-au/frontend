/**
 * Admin Relationships Page
 * Manage client-provider and client-coordinator relationships
 */

import { useState } from 'react';
import { createFileRoute } from '@tanstack/react-router';
import { PageHeader } from '@/components/common/PageHeader';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@workspace/ui/components/card';
import { Button } from '@workspace/ui/components/button';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@workspace/ui/components/table';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@workspace/ui/components/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@workspace/ui/components/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@workspace/ui/components/tabs';
import { Badge } from '@workspace/ui/components/badge';
import { Plus, Link2, Trash2, Users, Building2, UserCog, Loader2 } from 'lucide-react';
import { ProtectedRoute } from '@/features/auth';
import {
  useParticipants,
  useProviders,
  useCoordinators,
  useCreateClientProvider,
  useDeleteClientProvider,
  useAssignCoordinator,
  useDeleteCoordinatorAssignment,
  useProvidersByParticipant,
  useCoordinatorForParticipant,
} from '@/features/admin';
import { toast } from 'sonner';

export const Route = createFileRoute('/_dashboard/admin/relationships')({
  component: RelationshipsPage,
});

function RelationshipsPage() {
  return (
    <ProtectedRoute roles={['admin']}>
      <div className="space-y-6">
        <PageHeader
          title="Relationships"
          description="Manage client-provider and client-coordinator relationships"
        />

        <Tabs defaultValue="client-provider" className="space-y-6">
          <TabsList>
            <TabsTrigger value="client-provider" className="flex items-center gap-2">
              <Building2 className="size-4" />
              Client ↔ Provider
            </TabsTrigger>
            <TabsTrigger value="client-coordinator" className="flex items-center gap-2">
              <UserCog className="size-4" />
              Client ↔ Coordinator
            </TabsTrigger>
          </TabsList>

          <TabsContent value="client-provider">
            <ClientProviderSection />
          </TabsContent>

          <TabsContent value="client-coordinator">
            <ClientCoordinatorSection />
          </TabsContent>
        </Tabs>
      </div>
    </ProtectedRoute>
  );
}

// =============================================================================
// Client-Provider Section
// =============================================================================

function ClientProviderSection() {
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [selectedParticipantId, setSelectedParticipantId] = useState<string>('');
  const [selectedProviderId, setSelectedProviderId] = useState<string>('');

  const { data: participantsData } = useParticipants({ limit: 100 });
  const { data: providersData } = useProviders({ limit: 100 });
  const createClientProvider = useCreateClientProvider();
  const deleteClientProvider = useDeleteClientProvider();

  // For viewing relationships of selected participant
  const [viewingParticipantId, setViewingParticipantId] = useState<string>('');
  const { data: participantProviders, isLoading: isLoadingRelationships } = useProvidersByParticipant(viewingParticipantId);

  const handleCreate = async () => {
    if (!selectedParticipantId || !selectedProviderId) {
      toast.error('Please select both participant and provider');
      return;
    }
    try {
      await createClientProvider.mutateAsync({
        participant_id: selectedParticipantId,
        provider_id: selectedProviderId,
        status: 'active',
      });
      toast.success('Relationship created successfully');
      setIsCreateOpen(false);
      setSelectedParticipantId('');
      setSelectedProviderId('');
      // Refresh the view if we're viewing the same participant
      if (viewingParticipantId === selectedParticipantId) {
        setViewingParticipantId('');
        setTimeout(() => setViewingParticipantId(selectedParticipantId), 100);
      }
    } catch {
      toast.error('Failed to create relationship. It may already exist.');
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to remove this relationship?')) return;
    try {
      await deleteClientProvider.mutateAsync(id);
      toast.success('Relationship removed');
    } catch {
      toast.error('Failed to remove relationship');
    }
  };

  return (
    <div className="space-y-6">
      {/* Stats */}
      <div className="grid gap-4 sm:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Participants</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{participantsData?.total ?? 0}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Providers</CardTitle>
            <Building2 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{providersData?.total ?? 0}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Actions</CardTitle>
            <Link2 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <Button onClick={() => setIsCreateOpen(true)} size="sm" className="w-full">
              <Plus className="size-4 mr-2" />
              Link Provider to Client
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* View Relationships */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">View Participant's Providers</CardTitle>
          <CardDescription>Select a participant to view their linked providers</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Select value={viewingParticipantId} onValueChange={setViewingParticipantId}>
            <SelectTrigger>
              <SelectValue placeholder="Select a participant..." />
            </SelectTrigger>
            <SelectContent>
              {participantsData?.participants?.map((p) => (
                <SelectItem key={p.id} value={p.id}>
                  {p.full_name || `Participant ${p.id.slice(0, 8)}`} {p.ndis_number && `(${p.ndis_number})`}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          {viewingParticipantId && (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Provider ID</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Start Date</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {isLoadingRelationships ? (
                  <TableRow>
                    <TableCell colSpan={4} className="text-center py-8">
                      <Loader2 className="size-5 animate-spin mx-auto" />
                    </TableCell>
                  </TableRow>
                ) : !participantProviders?.length ? (
                  <TableRow>
                    <TableCell colSpan={4} className="text-center py-8 text-muted-foreground">
                      No providers linked to this participant
                    </TableCell>
                  </TableRow>
                ) : (
                  participantProviders.map((rel) => (
                    <TableRow key={rel.id}>
                      <TableCell className="font-mono text-sm">
                        {rel.provider_id.slice(0, 8)}...
                      </TableCell>
                      <TableCell>
                        <Badge variant={rel.status === 'active' ? 'default' : 'secondary'}>
                          {rel.status}
                        </Badge>
                      </TableCell>
                      <TableCell>{rel.start_date || '-'}</TableCell>
                      <TableCell className="text-right">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleDelete(rel.id)}
                        >
                          <Trash2 className="size-4 text-red-500" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      {/* Create Dialog */}
      <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Link Provider to Participant</DialogTitle>
            <DialogDescription>
              Create a relationship between a participant and a service provider
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Participant</label>
              <Select value={selectedParticipantId} onValueChange={setSelectedParticipantId}>
                <SelectTrigger>
                  <SelectValue placeholder="Select participant..." />
                </SelectTrigger>
                <SelectContent>
                  {participantsData?.participants?.map((p) => (
                    <SelectItem key={p.id} value={p.id}>
                      {p.full_name || `Participant ${p.id.slice(0, 8)}`}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Provider</label>
              <Select value={selectedProviderId} onValueChange={setSelectedProviderId}>
                <SelectTrigger>
                  <SelectValue placeholder="Select provider..." />
                </SelectTrigger>
                <SelectContent>
                  {providersData?.providers?.map((p) => (
                    <SelectItem key={p.id} value={p.id}>
                      {p.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsCreateOpen(false)}>
              Cancel
            </Button>
            <Button
              onClick={handleCreate}
              disabled={createClientProvider.isPending || !selectedParticipantId || !selectedProviderId}
            >
              {createClientProvider.isPending ? (
                <Loader2 className="size-4 mr-2 animate-spin" />
              ) : (
                <Link2 className="size-4 mr-2" />
              )}
              Create Relationship
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

// =============================================================================
// Client-Coordinator Section
// =============================================================================

function ClientCoordinatorSection() {
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [selectedParticipantId, setSelectedParticipantId] = useState<string>('');
  const [selectedCoordinatorId, setSelectedCoordinatorId] = useState<string>('');

  const { data: participantsData } = useParticipants({ limit: 100 });
  const { data: coordinatorsData } = useCoordinators({ limit: 100 });
  const assignCoordinator = useAssignCoordinator();
  const deleteAssignment = useDeleteCoordinatorAssignment();

  // For viewing assignment of selected participant
  const [viewingParticipantId, setViewingParticipantId] = useState<string>('');
  const { data: participantCoordinator, isLoading: isLoadingAssignment } = useCoordinatorForParticipant(viewingParticipantId);

  const handleCreate = async () => {
    if (!selectedParticipantId || !selectedCoordinatorId) {
      toast.error('Please select both participant and coordinator');
      return;
    }
    try {
      await assignCoordinator.mutateAsync({
        participant_id: selectedParticipantId,
        coordinator_id: selectedCoordinatorId,
        is_primary: true,
        status: 'active',
      });
      toast.success('Coordinator assigned successfully');
      setIsCreateOpen(false);
      setSelectedParticipantId('');
      setSelectedCoordinatorId('');
      // Refresh the view
      if (viewingParticipantId === selectedParticipantId) {
        setViewingParticipantId('');
        setTimeout(() => setViewingParticipantId(selectedParticipantId), 100);
      }
    } catch {
      toast.error('Failed to assign coordinator. Assignment may already exist.');
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to remove this coordinator assignment?')) return;
    try {
      await deleteAssignment.mutateAsync(id);
      toast.success('Assignment removed');
    } catch {
      toast.error('Failed to remove assignment');
    }
  };

  return (
    <div className="space-y-6">
      {/* Stats */}
      <div className="grid gap-4 sm:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Participants</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{participantsData?.total ?? 0}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Coordinators</CardTitle>
            <UserCog className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{coordinatorsData?.total ?? 0}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Actions</CardTitle>
            <Link2 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <Button onClick={() => setIsCreateOpen(true)} size="sm" className="w-full">
              <Plus className="size-4 mr-2" />
              Assign Coordinator
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* View Assignment */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">View Participant's Coordinator</CardTitle>
          <CardDescription>Select a participant to view their assigned coordinator</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Select value={viewingParticipantId} onValueChange={setViewingParticipantId}>
            <SelectTrigger>
              <SelectValue placeholder="Select a participant..." />
            </SelectTrigger>
            <SelectContent>
              {participantsData?.participants?.map((p) => (
                <SelectItem key={p.id} value={p.id}>
                  {p.full_name || `Participant ${p.id.slice(0, 8)}`} {p.ndis_number && `(${p.ndis_number})`}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          {viewingParticipantId && (
            <div className="rounded-lg border p-4">
              {isLoadingAssignment ? (
                <div className="flex items-center justify-center py-4">
                  <Loader2 className="size-5 animate-spin" />
                </div>
              ) : participantCoordinator ? (
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="flex size-10 items-center justify-center rounded-full bg-purple-100">
                      <UserCog className="size-5 text-purple-600" />
                    </div>
                    <div>
                      <p className="text-sm font-medium">Coordinator ID: {participantCoordinator.coordinator_id.slice(0, 8)}...</p>
                      <div className="flex items-center gap-2 mt-1">
                        {participantCoordinator.is_primary && (
                          <Badge variant="secondary" className="text-xs">Primary</Badge>
                        )}
                        <Badge variant={participantCoordinator.status === 'active' ? 'default' : 'secondary'}>
                          {participantCoordinator.status}
                        </Badge>
                      </div>
                    </div>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleDelete(participantCoordinator.id)}
                  >
                    <Trash2 className="size-4 text-red-500" />
                  </Button>
                </div>
              ) : (
                <p className="text-center text-muted-foreground py-4">
                  No coordinator assigned to this participant
                </p>
              )}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Create Dialog */}
      <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Assign Coordinator to Participant</DialogTitle>
            <DialogDescription>
              Assign a support coordinator to manage a participant
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Participant</label>
              <Select value={selectedParticipantId} onValueChange={setSelectedParticipantId}>
                <SelectTrigger>
                  <SelectValue placeholder="Select participant..." />
                </SelectTrigger>
                <SelectContent>
                  {participantsData?.participants?.map((p) => (
                    <SelectItem key={p.id} value={p.id}>
                      {p.full_name || `Participant ${p.id.slice(0, 8)}`}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Coordinator</label>
              <Select value={selectedCoordinatorId} onValueChange={setSelectedCoordinatorId}>
                <SelectTrigger>
                  <SelectValue placeholder="Select coordinator..." />
                </SelectTrigger>
                <SelectContent>
                  {coordinatorsData?.coordinators?.map((c) => (
                    <SelectItem key={c.id} value={c.id}>
                      {c.full_name} {c.organization && `(${c.organization})`}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsCreateOpen(false)}>
              Cancel
            </Button>
            <Button
              onClick={handleCreate}
              disabled={assignCoordinator.isPending || !selectedParticipantId || !selectedCoordinatorId}
            >
              {assignCoordinator.isPending ? (
                <Loader2 className="size-4 mr-2 animate-spin" />
              ) : (
                <UserCog className="size-4 mr-2" />
              )}
              Assign Coordinator
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
