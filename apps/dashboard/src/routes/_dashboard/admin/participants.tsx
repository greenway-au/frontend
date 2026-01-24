/**
 * Admin Participants Page
 * Manage participants (clients) - admin only
 */

import { useState } from 'react';
import { createFileRoute } from '@tanstack/react-router';
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
  DialogTrigger,
} from '@workspace/ui/components/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@workspace/ui/components/select';
import { Badge } from '@workspace/ui/components/badge';
import { Plus, Users, Mail, Trash2, UserCheck, UserX } from 'lucide-react';
import { ProtectedRoute } from '@/features/auth';
import {
  useParticipants,
  useCreateParticipant,
  useDeleteParticipant,
  useCreateInvitation,
} from '@/features/admin';
import type { CreateParticipantPayload } from '@/features/participants/types/participant.types';
import { toast } from 'sonner';

export const Route = createFileRoute('/_dashboard/admin/participants')({
  component: ParticipantsPage,
});

function ParticipantsPage() {
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [isInviteOpen, setIsInviteOpen] = useState(false);
  const [selectedParticipantId, setSelectedParticipantId] = useState<string | null>(null);
  const [inviteEmail, setInviteEmail] = useState('');

  const { data, isLoading } = useParticipants({ limit: 100 });
  const createParticipant = useCreateParticipant();
  const deleteParticipant = useDeleteParticipant();
  const createInvitation = useCreateInvitation();

  const [formData, setFormData] = useState<CreateParticipantPayload>({
    full_name: '',
    ndis_number: '',
    plan_start_date: '',
    plan_end_date: '',
    starting_funding_amount: undefined,
    status: 'active',
  });

  const handleCreate = async () => {
    try {
      await createParticipant.mutateAsync(formData);
      toast.success('Participant created successfully');
      setIsCreateOpen(false);
      setFormData({
        full_name: '',
        ndis_number: '',
        plan_start_date: '',
        plan_end_date: '',
        starting_funding_amount: undefined,
        status: 'active',
      });
    } catch {
      toast.error('Failed to create participant');
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this participant?')) return;
    try {
      await deleteParticipant.mutateAsync(id);
      toast.success('Participant deleted');
    } catch {
      toast.error('Failed to delete participant');
    }
  };

  const handleInvite = async () => {
    if (!selectedParticipantId || !inviteEmail) return;
    try {
      const invitation = await createInvitation.mutateAsync({
        invitation_type: 'client',
        entity_id: selectedParticipantId,
        email: inviteEmail,
      });
      const inviteUrl = `${window.location.origin}/invite?token=${invitation.token}`;
      await navigator.clipboard.writeText(inviteUrl);
      toast.success('Invitation created! Link copied to clipboard.');
      setIsInviteOpen(false);
      setInviteEmail('');
      setSelectedParticipantId(null);
    } catch {
      toast.error('Failed to create invitation');
    }
  };

  const openInviteDialog = (participantId: string) => {
    setSelectedParticipantId(participantId);
    setIsInviteOpen(true);
  };

  return (
    <ProtectedRoute roles={['admin']}>
      <div className="space-y-6">
        <PageHeader
          title="Participants"
          description="Manage participants (clients) in the system"
          action={{
            label: 'Add Participant',
            onClick: () => setIsCreateOpen(true),
            icon: <Plus className="size-4 mr-2" />,
          }}
        />

        <div className="grid gap-4 sm:grid-cols-3">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Participants</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{data?.total ?? 0}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">With Account</CardTitle>
              <UserCheck className="h-4 w-4 text-green-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {data?.participants?.filter((p) => p.user_id).length ?? 0}
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
                {data?.participants?.filter((p) => !p.user_id).length ?? 0}
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
                  <TableHead>NDIS Number</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Account</TableHead>
                  <TableHead>Funding</TableHead>
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
                ) : !data?.participants?.length ? (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                      No participants yet. Create one to get started.
                    </TableCell>
                  </TableRow>
                ) : (
                  data.participants.map((participant) => (
                    <TableRow key={participant.id}>
                      <TableCell className="font-medium">
                        {participant.full_name || 'Unnamed'}
                      </TableCell>
                      <TableCell>{participant.ndis_number || '-'}</TableCell>
                      <TableCell>
                        <Badge variant={participant.status === 'active' ? 'default' : 'secondary'}>
                          {participant.status}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        {participant.user_id ? (
                          <Badge variant="outline" className="text-green-600 border-green-600">
                            Linked
                          </Badge>
                        ) : (
                          <Badge variant="outline" className="text-yellow-600 border-yellow-600">
                            No Account
                          </Badge>
                        )}
                      </TableCell>
                      <TableCell>
                        {participant.starting_funding_amount
                          ? `$${participant.starting_funding_amount.toLocaleString()}`
                          : '-'}
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          {!participant.user_id && (
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => openInviteDialog(participant.id)}
                            >
                              <Mail className="size-4 mr-1" />
                              Invite
                            </Button>
                          )}
                          <Button
                            variant="ghost"
                            size="sm"
                            className="text-destructive"
                            onClick={() => handleDelete(participant.id)}
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

        {/* Create Participant Dialog */}
        <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add New Participant</DialogTitle>
              <DialogDescription>
                Create a new participant record. You can invite them to create an account later.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="full_name">Full Name</Label>
                <Input
                  id="full_name"
                  value={formData.full_name || ''}
                  onChange={(e) => setFormData({ ...formData, full_name: e.target.value })}
                  placeholder="John Doe"
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="ndis_number">NDIS Number</Label>
                <Input
                  id="ndis_number"
                  value={formData.ndis_number || ''}
                  onChange={(e) => setFormData({ ...formData, ndis_number: e.target.value })}
                  placeholder="123456789"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="plan_start_date">Plan Start Date</Label>
                  <Input
                    id="plan_start_date"
                    type="date"
                    value={formData.plan_start_date || ''}
                    onChange={(e) => setFormData({ ...formData, plan_start_date: e.target.value })}
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="plan_end_date">Plan End Date</Label>
                  <Input
                    id="plan_end_date"
                    type="date"
                    value={formData.plan_end_date || ''}
                    onChange={(e) => setFormData({ ...formData, plan_end_date: e.target.value })}
                  />
                </div>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="starting_funding_amount">Starting Funding Amount ($)</Label>
                <Input
                  id="starting_funding_amount"
                  type="number"
                  value={formData.starting_funding_amount || ''}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      starting_funding_amount: e.target.value ? parseFloat(e.target.value) : undefined,
                    })
                  }
                  placeholder="50000"
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="status">Status</Label>
                <Select
                  value={formData.status}
                  onValueChange={(value: 'active' | 'inactive') =>
                    setFormData({ ...formData, status: value })
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
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
              <Button onClick={handleCreate} disabled={createParticipant.isPending}>
                {createParticipant.isPending ? 'Creating...' : 'Create Participant'}
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
                Send an invitation link to allow this participant to create their account.
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
                  placeholder="participant@example.com"
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
