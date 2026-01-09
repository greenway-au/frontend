/**
 * Dashboard Home Route
 * Main dashboard page with stats and quick actions
 */

import { createFileRoute, Link } from '@tanstack/react-router';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@workspace/ui/components/card';
import { Button } from '@workspace/ui/components/button';
import { Users, FileText, DollarSign, TrendingUp, Plus } from 'lucide-react';

export const Route = createFileRoute('/_dashboard/')({
  component: DashboardHome,
});

function DashboardHome() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Welcome back!</h2>
        <p className="text-muted-foreground">
          Here's what's happening with your NDIS platform today.
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="Total Participants"
          value="2,350"
          change="+20.1% from last month"
          icon={Users}
          iconBg="bg-primary/10"
          iconColor="text-primary"
        />
        <StatCard
          title="Active Plans"
          value="1,892"
          change="+15.3% from last month"
          icon={FileText}
          iconBg="bg-secondary/10"
          iconColor="text-secondary"
        />
        <StatCard
          title="Total Budget"
          value="$45,231.89"
          change="+5.2% from last month"
          icon={DollarSign}
          iconBg="bg-primary/10"
          iconColor="text-primary"
        />
        <StatCard
          title="Growth Rate"
          value="+12.5%"
          change="+2.5% from last month"
          icon={TrendingUp}
          iconBg="bg-secondary/10"
          iconColor="text-secondary"
        />
      </div>

      {/* Recent Activity */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        <Card className="col-span-4">
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
            <CardDescription>
              Latest updates from your NDIS platform
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="flex items-center gap-4">
                  <div className="size-2 rounded-full bg-primary" />
                  <div className="flex-1">
                    <p className="text-sm font-medium">
                      New participant enrolled
                    </p>
                    <p className="text-xs text-muted-foreground">2 hours ago</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card className="col-span-3">
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
            <CardDescription>Common tasks and shortcuts</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <Button variant="outline" className="w-full justify-start" asChild>
                <Link to="/participants/new">
                  <Plus className="mr-2 size-4" />
                  Add New Participant
                </Link>
              </Button>
              <Button variant="outline" className="w-full justify-start" asChild>
                <Link to="/documents">
                  <FileText className="mr-2 size-4" />
                  Manage Documents
                </Link>
              </Button>
              <Button variant="outline" className="w-full justify-start" asChild>
                <Link to="/reports">
                  <TrendingUp className="mr-2 size-4" />
                  Generate Report
                </Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

interface StatCardProps {
  title: string;
  value: string;
  change: string;
  icon: React.ComponentType<{ className?: string }>;
  iconBg: string;
  iconColor: string;
}

function StatCard({
  title,
  value,
  change,
  icon: Icon,
  iconBg,
  iconColor,
}: StatCardProps) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        <div className={`rounded-lg p-2 ${iconBg}`}>
          <Icon className={`size-4 ${iconColor}`} />
        </div>
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
        <p className="text-xs text-muted-foreground">{change}</p>
      </CardContent>
    </Card>
  );
}
