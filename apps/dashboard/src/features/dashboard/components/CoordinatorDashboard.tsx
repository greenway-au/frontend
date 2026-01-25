/**
 * Coordinator Dashboard
 * Dashboard view for support coordinators showing their assigned participants
 */

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@workspace/ui/components/card';
import { Users, Calendar, FileText, CheckCircle2, Clock, Sparkles } from 'lucide-react';
import { useAtomValue } from 'jotai';
import { userAtom } from '@/stores/auth';

export function CoordinatorDashboard() {
  const user = useAtomValue(userAtom);

  // In the future, we'll fetch assigned participants
  // using user.coordinatorId and the relationships table
  const stats = {
    assignedParticipants: 0,
    activePlans: 0,
    pendingReviews: 0,
    upcomingRenewals: 0,
  };

  return (
    <div className="space-y-8">
      {/* Stats Grid */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="Assigned Participants"
          value={stats.assignedParticipants.toString()}
          icon={Users}
          description="Participants you manage"
        />
        <StatCard
          title="Active Plans"
          value={stats.activePlans.toString()}
          icon={FileText}
          description="Current NDIS plans"
          variant="success"
        />
        <StatCard
          title="Pending Reviews"
          value={stats.pendingReviews.toString()}
          icon={Clock}
          description="Invoices to review"
          variant={stats.pendingReviews > 0 ? 'warning' : 'default'}
        />
        <StatCard
          title="Upcoming Renewals"
          value={stats.upcomingRenewals.toString()}
          icon={Calendar}
          description="Plans ending soon"
        />
      </div>

      {/* Assigned Participants */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base flex items-center gap-2">
            <Users className="size-4" />
            Your Participants
          </CardTitle>
          <CardDescription>Participants assigned to your care</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <div className="flex size-12 items-center justify-center rounded-full bg-muted mb-4">
              <Users className="size-6 text-muted-foreground" />
            </div>
            <p className="text-sm font-medium text-muted-foreground">No participants assigned</p>
            <p className="text-xs text-muted-foreground mt-1">
              Participants will appear here when assigned by an admin
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Recent Activity */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base flex items-center gap-2">
            <Sparkles className="size-4" />
            Recent Activity
          </CardTitle>
          <CardDescription>Latest updates from your participants</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <div className="flex size-12 items-center justify-center rounded-full bg-muted mb-4">
              <Sparkles className="size-6 text-muted-foreground" />
            </div>
            <p className="text-sm font-medium text-muted-foreground">No recent activity</p>
            <p className="text-xs text-muted-foreground mt-1">
              Activity from your participants will appear here
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Coordinator Info */}
      {user?.coordinatorId && (
        <Card className="border-primary/20 bg-primary/5">
          <CardContent className="p-6">
            <div className="flex items-start gap-4">
              <div className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-primary/10">
                <CheckCircle2 className="size-5 text-primary" />
              </div>
              <div className="space-y-1">
                <p className="text-sm font-medium">Coordinator Account Active</p>
                <p className="text-sm text-muted-foreground">
                  Your support coordinator account is set up. You'll see your assigned participants here once assigned.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {!user?.coordinatorId && (
        <Card className="border-yellow-500/20 bg-yellow-50/50">
          <CardContent className="p-6">
            <div className="flex items-start gap-4">
              <div className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-yellow-100">
                <Clock className="size-5 text-yellow-600" />
              </div>
              <div className="space-y-1">
                <p className="text-sm font-medium">Account Setup Pending</p>
                <p className="text-sm text-muted-foreground">
                  Your coordinator profile is being set up. Contact your administrator if you need assistance.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

interface StatCardProps {
  title: string;
  value: string;
  icon: React.ComponentType<{ className?: string }>;
  description: string;
  variant?: 'default' | 'success' | 'warning' | 'error';
}

function StatCard({ title, value, icon: Icon, description, variant = 'default' }: StatCardProps) {
  const variantStyles = {
    default: 'bg-muted text-muted-foreground',
    success: 'bg-green-100 text-green-600',
    warning: 'bg-yellow-100 text-yellow-600',
    error: 'bg-red-100 text-red-600',
  };

  return (
    <Card>
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div className={`flex size-10 items-center justify-center rounded-lg ${variantStyles[variant]}`}>
            <Icon className="size-5" />
          </div>
        </div>
        <div className="mt-4">
          <div className="text-3xl font-bold">{value}</div>
          <p className="text-sm font-medium mt-1">{title}</p>
          <p className="text-xs text-muted-foreground">{description}</p>
        </div>
      </CardContent>
    </Card>
  );
}
