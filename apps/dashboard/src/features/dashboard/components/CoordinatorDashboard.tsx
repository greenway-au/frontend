/**
 * Coordinator Dashboard
 * Dashboard view for support coordinators with analytics, charts, and participant management
 */

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@workspace/ui/components/card';
import { Users, DollarSign, TrendingUp, TrendingDown } from 'lucide-react';
import { useAtomValue } from 'jotai';
import { userAtom } from '@/stores/auth';
import { useMyParticipantsAsCoordinator } from '@/features/admin/api/relationships.queries';
import { useCoordinatorDashboard, FundingDonutChart, SpendingBarChart, DashboardFilters } from '@/features/dashboard';
import type { DashboardFilters as Filters } from '@/features/dashboard';
import { RecentPlansWidget } from '@/features/ndis-plans';

function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('en-AU', {
    style: 'currency',
    currency: 'AUD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
}

export function CoordinatorDashboard() {
  const user = useAtomValue(userAtom);

  // Fetch assigned participants
  const { data: participantsData, isLoading: participantsLoading } = useMyParticipantsAsCoordinator();
  const participants = participantsData?.participants || [];

  // Dashboard filters state
  const [filters, setFilters] = useState<Filters>({});

  // Fetch dashboard data with filters
  const { data: dashboardData, isLoading: dashboardLoading } = useCoordinatorDashboard(filters);

  const summary = dashboardData?.summary;
  const supportBreakdown = dashboardData?.support_breakdown || [];
  const spendingByDay = dashboardData?.spending_by_day || [];

  return (
    <div className="space-y-6">
      {/* Summary Stats */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="Total Participants"
          value={summary?.total_participants?.toString() || '0'}
          icon={Users}
          description="Under your care"
        />
        <StatCard
          title="Total Budget"
          value={formatCurrency(summary?.total_budget || 0)}
          icon={DollarSign}
          description="Allocated funding"
          variant="default"
        />
        <StatCard
          title="Total Spent"
          value={formatCurrency(summary?.total_spent || 0)}
          icon={TrendingUp}
          description="Utilized so far"
          variant={summary && summary.total_spent > summary.total_budget * 0.8 ? 'warning' : 'success'}
        />
        <StatCard
          title="Remaining"
          value={formatCurrency(summary?.total_remaining || 0)}
          icon={TrendingDown}
          description="Available funds"
        />
      </div>

      {/* Main Content Grid */}
      <div className="grid gap-6 lg:grid-cols-3">
        {/* Left Column - Filters */}
        <div className="lg:col-span-1">
          <DashboardFilters
            filters={filters}
            onFiltersChange={setFilters}
            participants={participants}
            participantsLoading={participantsLoading}
          />
        </div>

        {/* Right Column - Charts */}
        <div className="lg:col-span-2 space-y-6">
          {/* Funding Donut Chart */}
          <FundingDonutChart data={supportBreakdown} isLoading={dashboardLoading} />

          {/* Spending Bar Chart */}
          <SpendingBarChart data={spendingByDay} isLoading={dashboardLoading} />

          {/* Recent Plans Widget */}
          <RecentPlansWidget participantId={filters.participant_id} />
        </div>
      </div>
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
    default: 'bg-primary/10 text-primary',
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
          <div className="text-2xl font-bold">{value}</div>
          <p className="text-sm font-medium mt-1">{title}</p>
          <p className="text-xs text-muted-foreground">{description}</p>
        </div>
      </CardContent>
    </Card>
  );
}
