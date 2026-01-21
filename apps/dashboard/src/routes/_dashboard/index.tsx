/**
 * Dashboard Home Route
 * Main dashboard page with stats and overview
 * Premium, clean design with placeholder states
 */

import { createFileRoute } from '@tanstack/react-router';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@workspace/ui/components/card';
import { Users, FileText, DollarSign, TrendingUp, Activity, Sparkles } from 'lucide-react';
import { useAtomValue } from 'jotai';
import { userAtom } from '@/stores/auth';

export const Route = createFileRoute('/_dashboard/')({
  component: DashboardHome,
});

function DashboardHome() {
  const user = useAtomValue(userAtom);
  const firstName = user?.name.split(' ')[0] || 'there';

  return (
    <div className="space-y-8">
      {/* Welcome Section */}
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Welcome back, {firstName}</h1>
        <p className="text-muted-foreground mt-1">
          {user?.userType === 'provider' ? 'Manage your NDIS services and invoices' : 'Your NDIS dashboard overview'}
        </p>
      </div>

      {/* Stats Grid - Placeholder State */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <PlaceholderStatCard title="Total Participants" icon={Users} />
        <PlaceholderStatCard title="Active Plans" icon={FileText} />
        <PlaceholderStatCard title="Total Budget" icon={DollarSign} />
        <PlaceholderStatCard title="Growth Rate" icon={TrendingUp} />
      </div>

      {/* Overview Cards */}
      <div className="grid gap-4 md:grid-cols-2">
        {/* Recent Activity Placeholder */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base font-semibold flex items-center gap-2">
              <Activity className="size-4" />
              Recent Activity
            </CardTitle>
            <CardDescription>Latest updates will appear here</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <div className="flex size-12 items-center justify-center rounded-full bg-muted mb-4">
                <Sparkles className="size-6 text-muted-foreground" />
              </div>
              <p className="text-sm font-medium text-muted-foreground">No activity yet</p>
              <p className="text-xs text-muted-foreground mt-1">Your recent activity will be displayed here</p>
            </div>
          </CardContent>
        </Card>

        {/* Quick Actions / Info Placeholder */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base font-semibold flex items-center gap-2">
              <Sparkles className="size-4" />
              Quick Actions
            </CardTitle>
            <CardDescription>Shortcuts and information</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <div className="flex size-12 items-center justify-center rounded-full bg-muted mb-4">
                <TrendingUp className="size-6 text-muted-foreground" />
              </div>
              <p className="text-sm font-medium text-muted-foreground">Coming Soon</p>
              <p className="text-xs text-muted-foreground mt-1">Quick actions and shortcuts will be available here</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Info Banner */}
      <Card className="border-primary/20 bg-primary/5">
        <CardContent className="p-6">
          <div className="flex items-start gap-4">
            <div className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-primary/10">
              <Sparkles className="size-5 text-primary" />
            </div>
            <div className="space-y-1">
              <p className="text-sm font-medium">Dashboard Setup in Progress</p>
              <p className="text-sm text-muted-foreground">
                We're building out your personalized dashboard experience. Real-time data and analytics will be
                available soon.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

interface PlaceholderStatCardProps {
  title: string;
  icon: React.ComponentType<{ className?: string }>;
}

function PlaceholderStatCard({ title, icon: Icon }: PlaceholderStatCardProps) {
  return (
    <Card>
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div className="flex size-10 items-center justify-center rounded-lg bg-muted">
            <Icon className="size-5 text-muted-foreground" />
          </div>
        </div>
        <div className="mt-4">
          <div className="h-8 w-24 rounded-md bg-muted animate-pulse" />
          <p className="text-sm text-muted-foreground mt-2">{title}</p>
        </div>
      </CardContent>
    </Card>
  );
}
