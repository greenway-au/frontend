/**
 * Admin Relationships Page
 * Manage client-provider and client-coordinator relationships
 * Enhanced UI/UX with dual-panel layout, searchable comboboxes, and better visuals
 */

import { useState, useMemo } from 'react';
import { createFileRoute } from '@tanstack/react-router';
import { PageHeader } from '@/components/common/PageHeader';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@workspace/ui/components/card';
import { Button } from '@workspace/ui/components/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@workspace/ui/components/dialog';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@workspace/ui/components/alert-dialog';
import { Combobox } from '@workspace/ui/components/combobox';
import { ScrollArea } from '@workspace/ui/components/scroll-area';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@workspace/ui/components/tabs';
import { Badge } from '@workspace/ui/components/badge';
import { Avatar, AvatarFallback, getInitials } from '@workspace/ui/components/avatar';
import {
  Plus,
  Link2,
  Trash2,
  Users,
  Building2,
  UserCog,
  Loader2,
  Search,
  ArrowRight,
  CheckCircle2,
  XCircle,
  User
} from 'lucide-react';
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
import { Input } from '@workspace/ui/components/input';

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
// Client-Provider Section - Improved UI/UX
// =============================================================================

function ClientProviderSection() {
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [selectedParticipantId, setSelectedParticipantId] = useState<string>('');
  const [selectedProviderId, setSelectedProviderId] = useState<string>('');
  const [deleteConfirm, setDeleteConfirm] = useState<{ open: boolean; id: string; name: string }>({ open: false, id: '', name: '' });
  const [searchQuery, setSearchQuery] = useState('');

  const { data: participantsData } = useParticipants({ limit: 100 });
  const { data: providersData } = useProviders({ limit: 100 });
  const createClientProvider = useCreateClientProvider();
  const deleteClientProvider = useDeleteClientProvider();

  // For viewing relationships of selected participant
  const [viewingParticipantId, setViewingParticipantId] = useState<string>('');
  const { data: participantProviders, isLoading: isLoadingRelationships } = useProvidersByParticipant(viewingParticipantId);

  // Create lookup maps for names
  const providerMap = useMemo(() => {
    const map = new Map<string, string>();
    providersData?.providers?.forEach(p => map.set(p.id, p.name));
    return map;
  }, [providersData]);

  // Filter participants by search query
  const filteredParticipants = useMemo(() => {
    if (!participantsData?.participants) return [];
    if (!searchQuery) return participantsData.participants;
    const query = searchQuery.toLowerCase();
    return participantsData.participants.filter(p =>
      p.full_name?.toLowerCase().includes(query) ||
      p.ndis_number?.toLowerCase().includes(query)
    );
  }, [participantsData, searchQuery]);

  // Combobox options
  const participantOptions = useMemo(() =>
    participantsData?.participants?.map(p => ({
      value: p.id,
      label: p.full_name || `Participant ${p.id.slice(0, 8)}`,
      description: p.ndis_number ? `NDIS: ${p.ndis_number}` : undefined,
    })) ?? [],
    [participantsData]
  );

  const providerOptions = useMemo(() =>
    providersData?.providers?.map(p => ({
      value: p.id,
      label: p.name,
      description: p.abn ? `ABN: ${p.abn}` : undefined,
    })) ?? [],
    [providersData]
  );

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
      // Refresh if viewing the same participant
      if (viewingParticipantId === selectedParticipantId) {
        setViewingParticipantId('');
        setTimeout(() => setViewingParticipantId(selectedParticipantId), 100);
      }
    } catch {
      toast.error('Failed to create relationship. It may already exist.');
    }
  };

  const handleDelete = async () => {
    try {
      await deleteClientProvider.mutateAsync(deleteConfirm.id);
      toast.success('Relationship removed');
      setDeleteConfirm({ open: false, id: '', name: '' });
    } catch {
      toast.error('Failed to remove relationship');
    }
  };

  const selectedParticipant = participantsData?.participants?.find(p => p.id === viewingParticipantId);

  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid gap-4 sm:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Participants</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{participantsData?.total ?? 0}</div>
            <p className="text-xs text-muted-foreground mt-1">Available for linking</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Providers</CardTitle>
            <Building2 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{providersData?.total ?? 0}</div>
            <p className="text-xs text-muted-foreground mt-1">Service providers</p>
          </CardContent>
        </Card>
        <Card className="bg-primary/5 border-primary/20">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Quick Action</CardTitle>
            <Link2 className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <Button onClick={() => setIsCreateOpen(true)} size="sm" className="w-full">
              <Plus className="size-4 mr-2" />
              Create New Link
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Dual Panel Layout */}
      <div className="grid gap-6 lg:grid-cols-5">
        {/* Left Panel - Participant List */}
        <Card className="lg:col-span-2">
          <CardHeader className="pb-3">
            <CardTitle className="text-base flex items-center gap-2">
              <Users className="size-4" />
              Participants
            </CardTitle>
            <CardDescription>Select to view their providers</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
              <Input
                placeholder="Search by name or NDIS..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9"
              />
            </div>
            <ScrollArea className="h-[400px] pr-2">
              <div className="space-y-1">
                {filteredParticipants.length === 0 ? (
                  <p className="text-center text-muted-foreground py-8 text-sm">
                    No participants found
                  </p>
                ) : (
                  filteredParticipants.map((participant) => (
                    <button
                      key={participant.id}
                      onClick={() => setViewingParticipantId(participant.id)}
                      className={`w-full flex items-center gap-3 p-3 rounded-lg text-left transition-colors ${
                        viewingParticipantId === participant.id
                          ? 'bg-primary text-primary-foreground'
                          : 'hover:bg-muted'
                      }`}
                    >
                      <Avatar size="sm">
                        <AvatarFallback className={viewingParticipantId === participant.id ? 'bg-primary-foreground/20 text-primary-foreground' : 'bg-blue-100 text-blue-600'}>
                          {getInitials(participant.full_name || 'P')}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1 min-w-0">
                        <p className="font-medium truncate text-sm">
                          {participant.full_name || 'Unnamed Participant'}
                        </p>
                        {participant.ndis_number && (
                          <p className={`text-xs truncate ${viewingParticipantId === participant.id ? 'text-primary-foreground/70' : 'text-muted-foreground'}`}>
                            NDIS: {participant.ndis_number}
                          </p>
                        )}
                      </div>
                      <Badge
                        variant={participant.status === 'active' ? 'default' : 'secondary'}
                        className={`text-xs ${viewingParticipantId === participant.id ? 'bg-primary-foreground/20 text-primary-foreground' : ''}`}
                      >
                        {participant.status}
                      </Badge>
                    </button>
                  ))
                )}
              </div>
            </ScrollArea>
          </CardContent>
        </Card>

        {/* Right Panel - Provider Relationships */}
        <Card className="lg:col-span-3">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-base flex items-center gap-2">
                  <Building2 className="size-4" />
                  Linked Providers
                </CardTitle>
                <CardDescription>
                  {selectedParticipant
                    ? `Providers for ${selectedParticipant.full_name || 'selected participant'}`
                    : 'Select a participant to view providers'
                  }
                </CardDescription>
              </div>
              {viewingParticipantId && (
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => {
                    setSelectedParticipantId(viewingParticipantId);
                    setIsCreateOpen(true);
                  }}
                >
                  <Plus className="size-4 mr-1" />
                  Add Provider
                </Button>
              )}
            </div>
          </CardHeader>
          <CardContent>
            {!viewingParticipantId ? (
              <div className="flex flex-col items-center justify-center py-12 text-center">
                <div className="size-12 rounded-full bg-muted flex items-center justify-center mb-4">
                  <ArrowRight className="size-6 text-muted-foreground" />
                </div>
                <p className="text-muted-foreground">Select a participant from the list</p>
                <p className="text-sm text-muted-foreground">to view their linked providers</p>
              </div>
            ) : isLoadingRelationships ? (
              <div className="flex items-center justify-center py-12">
                <Loader2 className="size-6 animate-spin text-muted-foreground" />
              </div>
            ) : !participantProviders?.length ? (
              <div className="flex flex-col items-center justify-center py-12 text-center">
                <div className="size-12 rounded-full bg-orange-100 flex items-center justify-center mb-4">
                  <XCircle className="size-6 text-orange-600" />
                </div>
                <p className="font-medium">No providers linked</p>
                <p className="text-sm text-muted-foreground mb-4">This participant has no service providers yet</p>
                <Button
                  size="sm"
                  onClick={() => {
                    setSelectedParticipantId(viewingParticipantId);
                    setIsCreateOpen(true);
                  }}
                >
                  <Plus className="size-4 mr-1" />
                  Link First Provider
                </Button>
              </div>
            ) : (
              <div className="space-y-3">
                {participantProviders.map((rel) => (
                  <div
                    key={rel.id}
                    className="flex items-center justify-between p-4 rounded-lg border bg-card hover:bg-muted/50 transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <div className="size-10 rounded-full bg-green-100 flex items-center justify-center">
                        <Building2 className="size-5 text-green-600" />
                      </div>
                      <div>
                        <p className="font-medium">
                          {providerMap.get(rel.provider_id) || `Provider ${rel.provider_id.slice(0, 8)}...`}
                        </p>
                        <div className="flex items-center gap-2 mt-1">
                          <Badge variant={rel.status === 'active' ? 'default' : 'secondary'} className="text-xs">
                            {rel.status === 'active' ? (
                              <><CheckCircle2 className="size-3 mr-1" /> Active</>
                            ) : rel.status}
                          </Badge>
                          {rel.start_date && (
                            <span className="text-xs text-muted-foreground">
                              Since {new Date(rel.start_date).toLocaleDateString()}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="text-muted-foreground hover:text-red-600 hover:bg-red-50"
                      onClick={() => setDeleteConfirm({
                        open: true,
                        id: rel.id,
                        name: providerMap.get(rel.provider_id) || 'this provider'
                      })}
                    >
                      <Trash2 className="size-4" />
                    </Button>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Create Dialog with Combobox */}
      <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Link2 className="size-5" />
              Link Provider to Participant
            </DialogTitle>
            <DialogDescription>
              Create a relationship between a participant and a service provider
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <label className="text-sm font-medium flex items-center gap-2">
                <User className="size-4" />
                Participant
              </label>
              <Combobox
                options={participantOptions}
                value={selectedParticipantId}
                onValueChange={setSelectedParticipantId}
                placeholder="Search and select participant..."
                searchPlaceholder="Type to search participants..."
                emptyMessage="No participants found."
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium flex items-center gap-2">
                <Building2 className="size-4" />
                Provider
              </label>
              <Combobox
                options={providerOptions}
                value={selectedProviderId}
                onValueChange={setSelectedProviderId}
                placeholder="Search and select provider..."
                searchPlaceholder="Type to search providers..."
                emptyMessage="No providers found."
              />
            </div>

            {/* Preview */}
            {selectedParticipantId && selectedProviderId && (
              <div className="rounded-lg border bg-muted/50 p-4">
                <p className="text-xs text-muted-foreground mb-2">Preview</p>
                <div className="flex items-center gap-3">
                  <div className="flex items-center gap-2">
                    <Avatar size="sm">
                      <AvatarFallback className="bg-blue-100 text-blue-600">
                        {getInitials(participantOptions.find(p => p.value === selectedParticipantId)?.label || 'P')}
                      </AvatarFallback>
                    </Avatar>
                    <span className="text-sm font-medium">
                      {participantOptions.find(p => p.value === selectedParticipantId)?.label}
                    </span>
                  </div>
                  <ArrowRight className="size-4 text-muted-foreground" />
                  <div className="flex items-center gap-2">
                    <div className="size-8 rounded-full bg-green-100 flex items-center justify-center">
                      <Building2 className="size-4 text-green-600" />
                    </div>
                    <span className="text-sm font-medium">
                      {providerOptions.find(p => p.value === selectedProviderId)?.label}
                    </span>
                  </div>
                </div>
              </div>
            )}
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
              Create Link
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation AlertDialog */}
      <AlertDialog open={deleteConfirm.open} onOpenChange={(open) => setDeleteConfirm(prev => ({ ...prev, open }))}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Remove Provider Link?</AlertDialogTitle>
            <AlertDialogDescription>
              This will remove the link between the participant and <strong>{deleteConfirm.name}</strong>.
              This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              className="bg-red-600 hover:bg-red-700"
            >
              Remove Link
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}

// =============================================================================
// Client-Coordinator Section - Improved UI/UX
// =============================================================================

function ClientCoordinatorSection() {
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [selectedParticipantId, setSelectedParticipantId] = useState<string>('');
  const [selectedCoordinatorId, setSelectedCoordinatorId] = useState<string>('');
  const [deleteConfirm, setDeleteConfirm] = useState<{ open: boolean; id: string; name: string; participantName: string }>({
    open: false,
    id: '',
    name: '',
    participantName: ''
  });
  const [searchQuery, setSearchQuery] = useState('');

  const { data: participantsData } = useParticipants({ limit: 100 });
  const { data: coordinatorsData } = useCoordinators({ limit: 100 });
  const assignCoordinator = useAssignCoordinator();
  const deleteAssignment = useDeleteCoordinatorAssignment();

  // For viewing assignment of selected participant
  const [viewingParticipantId, setViewingParticipantId] = useState<string>('');
  const { data: participantCoordinator, isLoading: isLoadingAssignment } = useCoordinatorForParticipant(viewingParticipantId);

  // Create lookup map for coordinator names
  const coordinatorMap = useMemo(() => {
    const map = new Map<string, { full_name: string; organization?: string | null }>();
    coordinatorsData?.coordinators?.forEach(c => map.set(c.id, {
      full_name: c.full_name,
      organization: c.organization
    }));
    return map;
  }, [coordinatorsData]);

  // Filter participants by search query
  const filteredParticipants = useMemo(() => {
    if (!participantsData?.participants) return [];
    if (!searchQuery) return participantsData.participants;
    const query = searchQuery.toLowerCase();
    return participantsData.participants.filter(p =>
      p.full_name?.toLowerCase().includes(query) ||
      p.ndis_number?.toLowerCase().includes(query)
    );
  }, [participantsData, searchQuery]);

  // Combobox options
  const participantOptions = useMemo(() =>
    participantsData?.participants?.map(p => ({
      value: p.id,
      label: p.full_name || `Participant ${p.id.slice(0, 8)}`,
      description: p.ndis_number ? `NDIS: ${p.ndis_number}` : undefined,
    })) ?? [],
    [participantsData]
  );

  const coordinatorOptions = useMemo(() =>
    coordinatorsData?.coordinators?.map(c => ({
      value: c.id,
      label: c.full_name,
      description: c.organization ? `Org: ${c.organization}` : undefined,
    })) ?? [],
    [coordinatorsData]
  );

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

  const handleDelete = async () => {
    try {
      await deleteAssignment.mutateAsync(deleteConfirm.id);
      toast.success('Coordinator assignment removed');
      setDeleteConfirm({ open: false, id: '', name: '', participantName: '' });
    } catch {
      toast.error('Failed to remove assignment');
    }
  };

  const selectedParticipant = participantsData?.participants?.find(p => p.id === viewingParticipantId);

  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid gap-4 sm:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Participants</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{participantsData?.total ?? 0}</div>
            <p className="text-xs text-muted-foreground mt-1">Available for assignment</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Coordinators</CardTitle>
            <UserCog className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{coordinatorsData?.total ?? 0}</div>
            <p className="text-xs text-muted-foreground mt-1">Support coordinators</p>
          </CardContent>
        </Card>
        <Card className="bg-primary/5 border-primary/20">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Quick Action</CardTitle>
            <Link2 className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <Button onClick={() => setIsCreateOpen(true)} size="sm" className="w-full">
              <Plus className="size-4 mr-2" />
              Assign Coordinator
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Dual Panel Layout */}
      <div className="grid gap-6 lg:grid-cols-5">
        {/* Left Panel - Participant List */}
        <Card className="lg:col-span-2">
          <CardHeader className="pb-3">
            <CardTitle className="text-base flex items-center gap-2">
              <Users className="size-4" />
              Participants
            </CardTitle>
            <CardDescription>Select to view their coordinator</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
              <Input
                placeholder="Search by name or NDIS..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9"
              />
            </div>
            <ScrollArea className="h-[400px] pr-2">
              <div className="space-y-1">
                {filteredParticipants.length === 0 ? (
                  <p className="text-center text-muted-foreground py-8 text-sm">
                    No participants found
                  </p>
                ) : (
                  filteredParticipants.map((participant) => (
                    <button
                      key={participant.id}
                      onClick={() => setViewingParticipantId(participant.id)}
                      className={`w-full flex items-center gap-3 p-3 rounded-lg text-left transition-colors ${
                        viewingParticipantId === participant.id
                          ? 'bg-primary text-primary-foreground'
                          : 'hover:bg-muted'
                      }`}
                    >
                      <Avatar size="sm">
                        <AvatarFallback className={viewingParticipantId === participant.id ? 'bg-primary-foreground/20 text-primary-foreground' : 'bg-blue-100 text-blue-600'}>
                          {getInitials(participant.full_name || 'P')}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1 min-w-0">
                        <p className="font-medium truncate text-sm">
                          {participant.full_name || 'Unnamed Participant'}
                        </p>
                        {participant.ndis_number && (
                          <p className={`text-xs truncate ${viewingParticipantId === participant.id ? 'text-primary-foreground/70' : 'text-muted-foreground'}`}>
                            NDIS: {participant.ndis_number}
                          </p>
                        )}
                      </div>
                      <Badge
                        variant={participant.status === 'active' ? 'default' : 'secondary'}
                        className={`text-xs ${viewingParticipantId === participant.id ? 'bg-primary-foreground/20 text-primary-foreground' : ''}`}
                      >
                        {participant.status}
                      </Badge>
                    </button>
                  ))
                )}
              </div>
            </ScrollArea>
          </CardContent>
        </Card>

        {/* Right Panel - Coordinator Assignment */}
        <Card className="lg:col-span-3">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-base flex items-center gap-2">
                  <UserCog className="size-4" />
                  Assigned Coordinator
                </CardTitle>
                <CardDescription>
                  {selectedParticipant
                    ? `Coordinator for ${selectedParticipant.full_name || 'selected participant'}`
                    : 'Select a participant to view coordinator'
                  }
                </CardDescription>
              </div>
              {viewingParticipantId && !participantCoordinator && !isLoadingAssignment && (
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => {
                    setSelectedParticipantId(viewingParticipantId);
                    setIsCreateOpen(true);
                  }}
                >
                  <Plus className="size-4 mr-1" />
                  Assign Coordinator
                </Button>
              )}
            </div>
          </CardHeader>
          <CardContent>
            {!viewingParticipantId ? (
              <div className="flex flex-col items-center justify-center py-12 text-center">
                <div className="size-12 rounded-full bg-muted flex items-center justify-center mb-4">
                  <ArrowRight className="size-6 text-muted-foreground" />
                </div>
                <p className="text-muted-foreground">Select a participant from the list</p>
                <p className="text-sm text-muted-foreground">to view their assigned coordinator</p>
              </div>
            ) : isLoadingAssignment ? (
              <div className="flex items-center justify-center py-12">
                <Loader2 className="size-6 animate-spin text-muted-foreground" />
              </div>
            ) : !participantCoordinator ? (
              <div className="flex flex-col items-center justify-center py-12 text-center">
                <div className="size-12 rounded-full bg-orange-100 flex items-center justify-center mb-4">
                  <XCircle className="size-6 text-orange-600" />
                </div>
                <p className="font-medium">No coordinator assigned</p>
                <p className="text-sm text-muted-foreground mb-4">This participant doesn't have a support coordinator yet</p>
                <Button
                  size="sm"
                  onClick={() => {
                    setSelectedParticipantId(viewingParticipantId);
                    setIsCreateOpen(true);
                  }}
                >
                  <Plus className="size-4 mr-1" />
                  Assign First Coordinator
                </Button>
              </div>
            ) : (
              <div className="space-y-3">
                <div className="flex items-center justify-between p-4 rounded-lg border bg-card hover:bg-muted/50 transition-colors">
                  <div className="flex items-center gap-3">
                    <div className="size-10 rounded-full bg-purple-100 flex items-center justify-center">
                      <UserCog className="size-5 text-purple-600" />
                    </div>
                    <div>
                      <p className="font-medium">
                        {coordinatorMap.get(participantCoordinator.coordinator_id)?.full_name ||
                          `Coordinator ${participantCoordinator.coordinator_id.slice(0, 8)}...`}
                      </p>
                      {coordinatorMap.get(participantCoordinator.coordinator_id)?.organization && (
                        <p className="text-xs text-muted-foreground">
                          {coordinatorMap.get(participantCoordinator.coordinator_id)?.organization}
                        </p>
                      )}
                      <div className="flex items-center gap-2 mt-1">
                        {participantCoordinator.is_primary && (
                          <Badge variant="secondary" className="text-xs">Primary</Badge>
                        )}
                        <Badge variant={participantCoordinator.status === 'active' ? 'default' : 'secondary'} className="text-xs">
                          {participantCoordinator.status === 'active' ? (
                            <><CheckCircle2 className="size-3 mr-1" /> Active</>
                          ) : participantCoordinator.status}
                        </Badge>
                        {participantCoordinator.start_date && (
                          <span className="text-xs text-muted-foreground">
                            Since {new Date(participantCoordinator.start_date).toLocaleDateString()}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="text-muted-foreground hover:text-red-600 hover:bg-red-50"
                    onClick={() => {
                      const coordinator = coordinatorMap.get(participantCoordinator.coordinator_id);
                      setDeleteConfirm({
                        open: true,
                        id: participantCoordinator.id,
                        name: coordinator?.full_name || 'this coordinator',
                        participantName: selectedParticipant?.full_name || 'the participant'
                      });
                    }}
                  >
                    <Trash2 className="size-4" />
                  </Button>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Create Dialog with Combobox */}
      <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Link2 className="size-5" />
              Assign Coordinator to Participant
            </DialogTitle>
            <DialogDescription>
              Assign a support coordinator to manage a participant's NDIS plan
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <label className="text-sm font-medium flex items-center gap-2">
                <User className="size-4" />
                Participant
              </label>
              <Combobox
                options={participantOptions}
                value={selectedParticipantId}
                onValueChange={setSelectedParticipantId}
                placeholder="Search and select participant..."
                searchPlaceholder="Type to search participants..."
                emptyMessage="No participants found."
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium flex items-center gap-2">
                <UserCog className="size-4" />
                Coordinator
              </label>
              <Combobox
                options={coordinatorOptions}
                value={selectedCoordinatorId}
                onValueChange={setSelectedCoordinatorId}
                placeholder="Search and select coordinator..."
                searchPlaceholder="Type to search coordinators..."
                emptyMessage="No coordinators found."
              />
            </div>

            {/* Preview */}
            {selectedParticipantId && selectedCoordinatorId && (
              <div className="rounded-lg border bg-muted/50 p-4">
                <p className="text-xs text-muted-foreground mb-2">Preview</p>
                <div className="flex items-center gap-3">
                  <div className="flex items-center gap-2">
                    <Avatar size="sm">
                      <AvatarFallback className="bg-blue-100 text-blue-600">
                        {getInitials(participantOptions.find(p => p.value === selectedParticipantId)?.label || 'P')}
                      </AvatarFallback>
                    </Avatar>
                    <span className="text-sm font-medium">
                      {participantOptions.find(p => p.value === selectedParticipantId)?.label}
                    </span>
                  </div>
                  <ArrowRight className="size-4 text-muted-foreground" />
                  <div className="flex items-center gap-2">
                    <div className="size-8 rounded-full bg-purple-100 flex items-center justify-center">
                      <UserCog className="size-4 text-purple-600" />
                    </div>
                    <span className="text-sm font-medium">
                      {coordinatorOptions.find(c => c.value === selectedCoordinatorId)?.label}
                    </span>
                  </div>
                </div>
              </div>
            )}
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
                <Link2 className="size-4 mr-2" />
              )}
              Assign Coordinator
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation AlertDialog */}
      <AlertDialog open={deleteConfirm.open} onOpenChange={(open) => setDeleteConfirm(prev => ({ ...prev, open }))}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Remove Coordinator Assignment?</AlertDialogTitle>
            <AlertDialogDescription>
              This will remove <strong>{deleteConfirm.name}</strong> as the coordinator for <strong>{deleteConfirm.participantName}</strong>.
              This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              className="bg-red-600 hover:bg-red-700"
            >
              Remove Assignment
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
