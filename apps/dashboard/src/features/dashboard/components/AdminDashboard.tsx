/**
 * Admin Dashboard
 * Dashboard view for admin users showing system-wide stats
 */

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@workspace/ui/components/card';
import { Button } from '@workspace/ui/components/button';
import { Link } from '@tanstack/react-router';
import { Users, Building2, UserCog, Mail, FileText, TrendingUp, Plus } from 'lucide-react';
import { useParticipants } from '@/features/admin';
import { useProviders } from '@/features/admin';
import { useCoordinators } from '@/features/admin';
import { useInvitations } from '@/features/admin';

export function AdminDashboard() {
  const { data: participantsData } = useParticipants({ limit: 1 });
  const { data: providersData } = useProviders({ limit: 1 });
  const { data: coordinatorsData } = useCoordinators({ limit: 1 });
  const { data: invitationsData } = useInvitations({ limit: 100 });

  const pendingInvitations = invitationsData?.invitations?.filter(i => i.status === 'pending').length ?? 0;

  return (
    <div className="space-y-8">
      {/* Stats Grid */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="Participants"
          value={participantsData?.total ?? 0}
          icon={Users}
          href="/admin/participants"
        />
        <StatCard
          title="Providers"
          value={providersData?.total ?? 0}
          icon={Building2}
          href="/admin/providers"
        />
        <StatCard
          title="Coordinators"
          value={coordinatorsData?.total ?? 0}
          icon={UserCog}
          href="/admin/coordinators"
        />
        <StatCard
          title="Pending Invitations"
          value={pendingInvitations}
          icon={Mail}
          href="/admin/invitations"
          highlight={pendingInvitations > 0}
        />
      </div>

      {/* Quick Actions */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Add Participant</CardTitle>
            <CardDescription>Create a new participant record</CardDescription>
          </CardHeader>
          <CardContent>
            <Button asChild className="w-full">
              <Link to="/admin/participants">
                <Plus className="size-4 mr-2" />
                Add Participant
              </Link>
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">Add Provider</CardTitle>
            <CardDescription>Register a new service provider</CardDescription>
          </CardHeader>
          <CardContent>
            <Button asChild className="w-full">
              <Link to="/admin/providers">
                <Plus className="size-4 mr-2" />
                Add Provider
              </Link>
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">View Invoices</CardTitle>
            <CardDescription>Review and manage all invoices</CardDescription>
          </CardHeader>
          <CardContent>
            <Button asChild variant="outline" className="w-full">
              <Link to="/invoices">
                <FileText className="size-4 mr-2" />
                View Invoices
              </Link>
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* System Status */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base flex items-center gap-2">
            <TrendingUp className="size-4" />
            System Overview
          </CardTitle>
          <CardDescription>Platform statistics at a glance</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <div className="text-center p-4 rounded-lg bg-muted/50">
              <div className="text-2xl font-bold text-green-600">
                {participantsData?.participants?.filter(p => p.user_id).length ?? 0}
              </div>
              <div className="text-sm text-muted-foreground">Active Accounts</div>
            </div>
            <div className="text-center p-4 rounded-lg bg-muted/50">
              <div className="text-2xl font-bold text-yellow-600">
                {participantsData?.participants?.filter(p => !p.user_id).length ?? 0}
              </div>
              <div className="text-sm text-muted-foreground">Pending Setup</div>
            </div>
            <div className="text-center p-4 rounded-lg bg-muted/50">
              <div className="text-2xl font-bold text-blue-600">
                {providersData?.providers?.filter(p => p.status === 'active').length ?? 0}
              </div>
              <div className="text-sm text-muted-foreground">Active Providers</div>
            </div>
            <div className="text-center p-4 rounded-lg bg-muted/50">
              <div className="text-2xl font-bold text-purple-600">
                {invitationsData?.invitations?.filter(i => i.status === 'accepted').length ?? 0}
              </div>
              <div className="text-sm text-muted-foreground">Accepted Invites</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

interface StatCardProps {
  title: string;
  value: number;
  icon: React.ComponentType<{ className?: string }>;
  href: string;
  highlight?: boolean;
}

function StatCard({ title, value, icon: Icon, href, highlight }: StatCardProps) {
  return (
    <Link to={href}>
      <Card className={`hover:border-primary/50 transition-colors cursor-pointer ${highlight ? 'border-yellow-500/50 bg-yellow-50/50' : ''}`}>
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div className={`flex size-10 items-center justify-center rounded-lg ${highlight ? 'bg-yellow-100' : 'bg-muted'}`}>
              <Icon className={`size-5 ${highlight ? 'text-yellow-600' : 'text-muted-foreground'}`} />
            </div>
          </div>
          <div className="mt-4">
            <div className="text-3xl font-bold">{value}</div>
            <p className="text-sm text-muted-foreground mt-1">{title}</p>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}
