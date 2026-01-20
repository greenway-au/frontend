/**
 * Dashboard Home Route
 * Main dashboard page with stats and overview
 * Premium, clean design
 */

import { createFileRoute } from '@tanstack/react-router';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@workspace/ui/components/card';
import { Users, FileText, DollarSign, TrendingUp, ArrowUpRight, Clock } from 'lucide-react';
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
        <p className="text-muted-foreground mt-1">Here's an overview of your NDIS platform</p>
        {/* Debug info - shows current user type */}
        {user && (
          <div className="mt-2 inline-flex items-center gap-2 text-xs px-2 py-1 rounded-md bg-muted">
            <span className="text-muted-foreground">Account type:</span>
            <span className="font-semibold capitalize">{user.userType}</span>
          </div>
        )}
      </div>

      {/* Stats Grid */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard title="Total Participants" value="2,350" change="+20.1%" trend="up" icon={Users} />
        <StatCard title="Active Plans" value="1,892" change="+15.3%" trend="up" icon={FileText} />
        <StatCard title="Total Budget" value="$45,231" change="+5.2%" trend="up" icon={DollarSign} />
        <StatCard title="Growth Rate" value="12.5%" change="+2.5%" trend="up" icon={TrendingUp} />
      </div>

      {/* Recent Activity */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base font-semibold">Recent Activity</CardTitle>
          <CardDescription>Latest updates from your platform</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {activityItems.map((item, i) => (
              <div key={i} className="flex items-start gap-4">
                <div className={`mt-0.5 flex size-8 shrink-0 items-center justify-center rounded-full ${item.iconBg}`}>
                  <item.icon className={`size-4 ${item.iconColor}`} />
                </div>
                <div className="flex-1 space-y-1">
                  <p className="text-sm font-medium leading-none">{item.title}</p>
                  <p className="text-sm text-muted-foreground">{item.description}</p>
                </div>
                <div className="flex items-center text-xs text-muted-foreground">
                  <Clock className="mr-1 size-3" />
                  {item.time}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

const activityItems = [
  {
    icon: Users,
    iconBg: 'bg-primary/10',
    iconColor: 'text-primary',
    title: 'New participant enrolled',
    description: 'Sarah Johnson was added to the platform',
    time: '2h ago',
  },
  {
    icon: FileText,
    iconBg: 'bg-secondary/10',
    iconColor: 'text-secondary',
    title: 'Document uploaded',
    description: 'Service agreement for Michael Chen',
    time: '4h ago',
  },
  {
    icon: DollarSign,
    iconBg: 'bg-primary/10',
    iconColor: 'text-primary',
    title: 'Plan updated',
    description: 'Budget allocation for Emma Williams',
    time: '6h ago',
  },
  {
    icon: TrendingUp,
    iconBg: 'bg-secondary/10',
    iconColor: 'text-secondary',
    title: 'Report generated',
    description: 'Monthly summary for December 2025',
    time: '1d ago',
  },
];

interface StatCardProps {
  title: string;
  value: string;
  change: string;
  trend: 'up' | 'down';
  icon: React.ComponentType<{ className?: string }>;
}

function StatCard({ title, value, change, trend, icon: Icon }: StatCardProps) {
  return (
    <Card>
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div className="flex size-10 items-center justify-center rounded-lg bg-primary/10">
            <Icon className="size-5 text-primary" />
          </div>
          <div
            className={`flex items-center text-sm font-medium ${trend === 'up' ? 'text-green-600' : 'text-red-600'}`}
          >
            {change}
            <ArrowUpRight className={`ml-0.5 size-4 ${trend === 'down' ? 'rotate-180' : ''}`} />
          </div>
        </div>
        <div className="mt-4">
          <p className="text-2xl font-semibold">{value}</p>
          <p className="text-sm text-muted-foreground">{title}</p>
        </div>
      </CardContent>
    </Card>
  );
}
