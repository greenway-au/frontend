/**
 * Admin Coordinators Page
 * Manage coordinators - admin only
 */

import { useState } from 'react';
import { createFileRoute, Link } from '@tanstack/react-router';
import { PageHeader } from '@/components/common/PageHeader';
import { Card, CardContent, CardHeader, CardTitle } from '@workspace/ui/components/card';
import { Button } from '@workspace/ui/components/button';
import { Input } from '@workspace/ui/components/input';
import { Label } from '@workspace/ui/components/label';
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
import { Badge } from '@workspace/ui/components/badge';
import { Plus, UserCog, Mail, Trash2, UserCheck, UserX, Eye } from 'lucide-react';
import { ProtectedRoute } from '@/features/auth';
import {
  useCoordinators,
  useCreateCoordinator,
  useDeleteCoordinator,
  useCreateInvitation,
} from '@/features/admin';
import type { CreateCoordinatorPayload, CoordinatorStatus } from '@/features/admin/types/coordinator.types';
import { toast } from 'sonner';

export const Route = createFileRoute('/_dashboard/admin/coordinators')({
  component: CoordinatorsPage,
});

function CoordinatorsPage() {
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [isInviteOpen, setIsInviteOpen] = useState(false);
  const [selectedCoordinatorId, setSelectedCoordinatorId] = useState<string | null>(null);
  const [inviteEmail, setInviteEmail] = useState('');

  const { data, isLoading } = useCoordinators({ limit: 100 });
  const createCoordinator = useCreateCoordinator();
  const deleteCoordinator = useDeleteCoordinator();
  const createInvitation = useCreateInvitation();

  const [formData, setFormData] = useState<CreateCoordinatorPayload>({
    full_name: '',
    email: '',
    phone: '',
    organization: '',
    status: 'pending',
  });

  const handleCreate = async () => {
    if (!formData.full_name) {
      toast.error('Coordinator name is required');
      return;
    }
    try {
      await createCoordinator.mutateAsync(formData);
      toast.success('Coordinator created successfully');
      setIsCreateOpen(false);
      setFormData({
        full_name: '',
        email: '',
        phone: '',
        organization: '',
        status: 'pending',
      });
    } catch {
      toast.error('Failed to create coordinator');
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this coordinator?')) return;
    try {
      await deleteCoordinator.mutateAsync(id);
      toast.success('Coordinator deleted');
    } catch {
      toast.error('Failed to delete coordinator');
    }
  };

  const handleInvite = async () => {
    if (!selectedCoordinatorId || !inviteEmail) return;
    try {
      const invitation = await createInvitation.mutateAsync({
        invitation_type: 'coordinator',
        entity_id: selectedCoordinatorId,
        email: inviteEmail,
      });
      const inviteUrl = `${window.location.origin}/invite?token=${invitation.token}`;
      await navigator.clipboard.writeText(inviteUrl);
      toast.success('Invitation created! Link copied to clipboard.');
      setIsInviteOpen(false);
      setInviteEmail('');
      setSelectedCoordinatorId(null);
    } catch {
      toast.error('Failed to create invitation');
    }
  };

  const openInviteDialog = (coordinatorId: string) => {
    setSelectedCoordinatorId(coordinatorId);
    setIsInviteOpen(true);
  };

  const getStatusVariant = (status: string) => {
    switch (status) {
      case 'active':
        return 'default';
      case 'pending':
        return 'secondary';
      case 'inactive':
        return 'outline';
      default:
        return 'secondary';
    }
  };

  return (
    <ProtectedRoute roles={['admin']}>
      <div className="space-y-6">
        <PageHeader
          title="Coordinators"
          description="Manage support coordinators in the system"
          action={{
            label: 'Add Coordinator',
            onClick: () => setIsCreateOpen(true),
            icon: <Plus className="size-4 mr-2" />,
          }}
        />

        <div className="grid gap-4 sm:grid-cols-3">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Coordinators</CardTitle>
              <UserCog className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{data?.total ?? 0}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Active</CardTitle>
              <UserCheck className="h-4 w-4 text-green-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {data?.coordinators?.filter((c) => c.user_id).length ?? 0}
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Pending Invite</CardTitle>
              <UserX className="h-4 w-4 text-yellow-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {data?.coordinators?.filter((c) => !c.user_id).length ?? 0}
              </div>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Contact</TableHead>
                  <TableHead>Organization</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Account</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {isLoading ? (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-8">
                      Loading...
                    </TableCell>
                  </TableRow>
                ) : !data?.coordinators?.length ? (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                      No coordinators yet. Create one to get started.
                    </TableCell>
                  </TableRow>
                ) : (
                  data.coordinators.map((coordinator) => (
                    <TableRow key={coordinator.id}>
                      <TableCell className="font-medium">{coordinator.full_name}</TableCell>
                      <TableCell>
                        <div className="text-sm">
                          {coordinator.email && <div>{coordinator.email}</div>}
                          {coordinator.phone && (
                            <div className="text-muted-foreground">{coordinator.phone}</div>
                          )}
                          {!coordinator.email && !coordinator.phone && '-'}
                        </div>
                      </TableCell>
                      <TableCell>{coordinator.organization || '-'}</TableCell>
                      <TableCell>
                        <Badge variant={getStatusVariant(coordinator.status)}>
                          {coordinator.status}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        {coordinator.user_id ? (
                          <Badge variant="outline" className="text-green-600 border-green-600">
                            Linked
                          </Badge>
                        ) : (
                          <Badge variant="outline" className="text-yellow-600 border-yellow-600">
                            No Account
                          </Badge>
                        )}
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Button variant="ghost" size="sm" asChild>
                            <Link to={`/admin/coordinators/${coordinator.id}`}>
                              <Eye className="size-4 mr-1" />
                              View
                            </Link>
                          </Button>
                          {!coordinator.user_id && (
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => openInviteDialog(coordinator.id)}
                            >
                              <Mail className="size-4 mr-1" />
                              Invite
                            </Button>
                          )}
                          <Button
                            variant="ghost"
                            size="sm"
                            className="text-destructive"
                            onClick={() => handleDelete(coordinator.id)}
                          >
                            <Trash2 className="size-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        {/* Create Coordinator Dialog */}
        <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add New Coordinator</DialogTitle>
              <DialogDescription>
                Create a new support coordinator record. You can invite them to create an account
                later.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="full_name">Full Name *</Label>
                <Input
                  id="full_name"
                  value={formData.full_name}
                  onChange={(e) => setFormData({ ...formData, full_name: e.target.value })}
                  placeholder="Jane Smith"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    value={formData.email || ''}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    placeholder="coordinator@example.com"
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="phone">Phone</Label>
                  <Input
                    id="phone"
                    value={formData.phone || ''}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    placeholder="04XX XXX XXX"
                  />
                </div>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="organization">Organization</Label>
                <Input
                  id="organization"
                  value={formData.organization || ''}
                  onChange={(e) => setFormData({ ...formData, organization: e.target.value })}
                  placeholder="Support Coordination Services Pty Ltd"
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="status">Status</Label>
                <Select
                  value={formData.status}
                  onValueChange={(value: CoordinatorStatus) =>
                    setFormData({ ...formData, status: value })
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="pending">Pending</SelectItem>
                    <SelectItem value="active">Active</SelectItem>
                    <SelectItem value="inactive">Inactive</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsCreateOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleCreate} disabled={createCoordinator.isPending}>
                {createCoordinator.isPending ? 'Creating...' : 'Create Coordinator'}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Invite Dialog */}
        <Dialog open={isInviteOpen} onOpenChange={setIsInviteOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Send Invitation</DialogTitle>
              <DialogDescription>
                Send an invitation link to allow this coordinator to create their account.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="invite_email">Email Address</Label>
                <Input
                  id="invite_email"
                  type="email"
                  value={inviteEmail}
                  onChange={(e) => setInviteEmail(e.target.value)}
                  placeholder="coordinator@example.com"
                />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsInviteOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleInvite} disabled={createInvitation.isPending || !inviteEmail}>
                {createInvitation.isPending ? 'Creating...' : 'Create & Copy Link'}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </ProtectedRoute>
  );
}
