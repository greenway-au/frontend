/**
 * Admin Providers Page
 * Manage providers - admin only
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
} from '@workspace/ui/components/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@workspace/ui/components/select';
import { Badge } from '@workspace/ui/components/badge';
import { Plus, Building2, Mail, Trash2, UserCheck, UserX } from 'lucide-react';
import { ProtectedRoute } from '@/features/auth';
import {
  useProviders,
  useCreateProvider,
  useDeleteProvider,
  useCreateInvitation,
} from '@/features/admin';
import type { CreateProviderPayload } from '@/features/providers/types/provider.types';
import { toast } from 'sonner';

export const Route = createFileRoute('/_dashboard/admin/providers')({
  component: ProvidersPage,
});

function ProvidersPage() {
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [isInviteOpen, setIsInviteOpen] = useState(false);
  const [selectedProviderId, setSelectedProviderId] = useState<string | null>(null);
  const [inviteEmail, setInviteEmail] = useState('');

  const { data, isLoading } = useProviders({ limit: 100 });
  const createProvider = useCreateProvider();
  const deleteProvider = useDeleteProvider();
  const createInvitation = useCreateInvitation();

  const [formData, setFormData] = useState<CreateProviderPayload>({
    name: '',
    abn: '',
    contact_email: '',
    contact_phone: '',
    address: '',
    service_types: [],
    status: 'pending',
  });

  const handleCreate = async () => {
    if (!formData.name) {
      toast.error('Provider name is required');
      return;
    }
    try {
      await createProvider.mutateAsync(formData);
      toast.success('Provider created successfully');
      setIsCreateOpen(false);
      setFormData({
        name: '',
        abn: '',
        contact_email: '',
        contact_phone: '',
        address: '',
        service_types: [],
        status: 'pending',
      });
    } catch {
      toast.error('Failed to create provider');
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this provider?')) return;
    try {
      await deleteProvider.mutateAsync(id);
      toast.success('Provider deleted');
    } catch {
      toast.error('Failed to delete provider');
    }
  };

  const handleInvite = async () => {
    if (!selectedProviderId || !inviteEmail) return;
    try {
      const invitation = await createInvitation.mutateAsync({
        invitation_type: 'provider',
        entity_id: selectedProviderId,
        email: inviteEmail,
      });
      const inviteUrl = `${window.location.origin}/invite?token=${invitation.token}`;
      await navigator.clipboard.writeText(inviteUrl);
      toast.success('Invitation created! Link copied to clipboard.');
      setIsInviteOpen(false);
      setInviteEmail('');
      setSelectedProviderId(null);
    } catch {
      toast.error('Failed to create invitation');
    }
  };

  const openInviteDialog = (providerId: string) => {
    setSelectedProviderId(providerId);
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
          title="Providers"
          description="Manage service providers in the system"
          action={{
            label: 'Add Provider',
            onClick: () => setIsCreateOpen(true),
            icon: <Plus className="size-4 mr-2" />,
          }}
        />

        <div className="grid gap-4 sm:grid-cols-3">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Providers</CardTitle>
              <Building2 className="h-4 w-4 text-muted-foreground" />
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
                {data?.providers?.filter((p) => p.user_id).length ?? 0}
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
                {data?.providers?.filter((p) => !p.user_id).length ?? 0}
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
                  <TableHead>ABN</TableHead>
                  <TableHead>Contact</TableHead>
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
                ) : !data?.providers?.length ? (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                      No providers yet. Create one to get started.
                    </TableCell>
                  </TableRow>
                ) : (
                  data.providers.map((provider) => (
                    <TableRow key={provider.id}>
                      <TableCell className="font-medium">{provider.name}</TableCell>
                      <TableCell>{provider.abn || '-'}</TableCell>
                      <TableCell>
                        <div className="text-sm">
                          {provider.contact_email && <div>{provider.contact_email}</div>}
                          {provider.contact_phone && (
                            <div className="text-muted-foreground">{provider.contact_phone}</div>
                          )}
                          {!provider.contact_email && !provider.contact_phone && '-'}
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant={getStatusVariant(provider.status)}>{provider.status}</Badge>
                      </TableCell>
                      <TableCell>
                        {provider.user_id ? (
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
                          {!provider.user_id && (
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => openInviteDialog(provider.id)}
                            >
                              <Mail className="size-4 mr-1" />
                              Invite
                            </Button>
                          )}
                          <Button
                            variant="ghost"
                            size="sm"
                            className="text-destructive"
                            onClick={() => handleDelete(provider.id)}
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

        {/* Create Provider Dialog */}
        <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add New Provider</DialogTitle>
              <DialogDescription>
                Create a new provider record. You can invite them to create an account later.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="name">Provider Name *</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="Acme Healthcare Services"
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="abn">ABN</Label>
                <Input
                  id="abn"
                  value={formData.abn || ''}
                  onChange={(e) => setFormData({ ...formData, abn: e.target.value })}
                  placeholder="12 345 678 901"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="contact_email">Contact Email</Label>
                  <Input
                    id="contact_email"
                    type="email"
                    value={formData.contact_email || ''}
                    onChange={(e) => setFormData({ ...formData, contact_email: e.target.value })}
                    placeholder="contact@provider.com"
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="contact_phone">Contact Phone</Label>
                  <Input
                    id="contact_phone"
                    value={formData.contact_phone || ''}
                    onChange={(e) => setFormData({ ...formData, contact_phone: e.target.value })}
                    placeholder="02 9000 0000"
                  />
                </div>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="address">Address</Label>
                <Input
                  id="address"
                  value={formData.address || ''}
                  onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                  placeholder="123 Main St, Sydney NSW 2000"
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="status">Status</Label>
                <Select
                  value={formData.status}
                  onValueChange={(value: 'active' | 'inactive' | 'pending') =>
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
              <Button onClick={handleCreate} disabled={createProvider.isPending}>
                {createProvider.isPending ? 'Creating...' : 'Create Provider'}
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
                Send an invitation link to allow this provider to create their account.
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
                  placeholder="provider@example.com"
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
