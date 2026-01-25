/**
 * Admin Invitations Page
 * View and manage all invitations - admin only
 */

import { createFileRoute } from '@tanstack/react-router';
import { PageHeader } from '@/components/common/PageHeader';
import { Card, CardContent, CardHeader, CardTitle } from '@workspace/ui/components/card';
import { Button } from '@workspace/ui/components/button';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@workspace/ui/components/table';
import { Badge } from '@workspace/ui/components/badge';
import { Mail, Copy, XCircle, Clock, CheckCircle2, AlertCircle } from 'lucide-react';
import { ProtectedRoute } from '@/features/auth';
import { useInvitations, useRevokeInvitation } from '@/features/admin';
import { toast } from 'sonner';
import { formatDistanceToNow } from 'date-fns';

export const Route = createFileRoute('/_dashboard/admin/invitations')({
  component: InvitationsPage,
});

function InvitationsPage() {
  const { data, isLoading } = useInvitations({ limit: 100 });
  const revokeInvitation = useRevokeInvitation();

  const handleCopyLink = async (token: string) => {
    const inviteUrl = `${window.location.origin}/invite?token=${token}`;
    await navigator.clipboard.writeText(inviteUrl);
    toast.success('Invitation link copied to clipboard');
  };

  const handleRevoke = async (id: string) => {
    if (!confirm('Are you sure you want to revoke this invitation?')) return;
    try {
      await revokeInvitation.mutateAsync(id);
      toast.success('Invitation revoked');
    } catch {
      toast.error('Failed to revoke invitation');
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending':
        return <Clock className="h-4 w-4" />;
      case 'accepted':
        return <CheckCircle2 className="h-4 w-4" />;
      case 'expired':
        return <AlertCircle className="h-4 w-4" />;
      case 'revoked':
        return <XCircle className="h-4 w-4" />;
      default:
        return null;
    }
  };

  const getStatusVariant = (status: string) => {
    switch (status) {
      case 'pending':
        return 'secondary';
      case 'accepted':
        return 'default';
      case 'expired':
        return 'outline';
      case 'revoked':
        return 'destructive';
      default:
        return 'secondary';
    }
  };

  const getTypeLabel = (type: string) => {
    switch (type) {
      case 'client':
        return 'Participant';
      case 'provider':
        return 'Provider';
      case 'coordinator':
        return 'Coordinator';
      default:
        return type;
    }
  };

  const stats = {
    total: data?.total ?? 0,
    pending: data?.invitations?.filter((i) => i.status === 'pending').length ?? 0,
    accepted: data?.invitations?.filter((i) => i.status === 'accepted').length ?? 0,
    expired: data?.invitations?.filter((i) => i.status === 'expired' || i.status === 'revoked').length ?? 0,
  };

  return (
    <ProtectedRoute roles={['admin']}>
      <div className="space-y-6">
        <PageHeader
          title="Invitations"
          description="View and manage all invitation links sent to users"
        />

        <div className="grid gap-4 sm:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Invitations</CardTitle>
              <Mail className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.total}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Pending</CardTitle>
              <Clock className="h-4 w-4 text-yellow-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.pending}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Accepted</CardTitle>
              <CheckCircle2 className="h-4 w-4 text-green-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.accepted}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Expired/Revoked</CardTitle>
              <AlertCircle className="h-4 w-4 text-red-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.expired}</div>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Type</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Expires</TableHead>
                  <TableHead>Created</TableHead>
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
                ) : !data?.invitations?.length ? (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                      No invitations yet. Create one from the Participants, Providers, or
                      Coordinators pages.
                    </TableCell>
                  </TableRow>
                ) : (
                  data.invitations.map((invitation) => (
                    <TableRow key={invitation.id}>
                      <TableCell>
                        <Badge variant="outline">{getTypeLabel(invitation.invitation_type)}</Badge>
                      </TableCell>
                      <TableCell className="font-medium">{invitation.email}</TableCell>
                      <TableCell>
                        <Badge
                          variant={getStatusVariant(invitation.status)}
                          className="flex items-center gap-1 w-fit"
                        >
                          {getStatusIcon(invitation.status)}
                          {invitation.status}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        {new Date(invitation.expires_at) > new Date() ? (
                          <span className="text-muted-foreground">
                            {formatDistanceToNow(new Date(invitation.expires_at), {
                              addSuffix: true,
                            })}
                          </span>
                        ) : (
                          <span className="text-red-600">Expired</span>
                        )}
                      </TableCell>
                      <TableCell>
                        <span className="text-muted-foreground">
                          {formatDistanceToNow(new Date(invitation.created_at), { addSuffix: true })}
                        </span>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          {invitation.status === 'pending' && (
                            <>
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => handleCopyLink(invitation.token)}
                              >
                                <Copy className="size-4 mr-1" />
                                Copy Link
                              </Button>
                              <Button
                                variant="ghost"
                                size="sm"
                                className="text-destructive"
                                onClick={() => handleRevoke(invitation.id)}
                              >
                                <XCircle className="size-4" />
                              </Button>
                            </>
                          )}
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </ProtectedRoute>
  );
}
