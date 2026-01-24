/**
 * Client/Participant Dashboard
 * Dashboard view for participants showing their plan and invoices
 */

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@workspace/ui/components/card';
import { DollarSign, Calendar, FileText, TrendingDown, CheckCircle2, Clock } from 'lucide-react';
import { useAtomValue } from 'jotai';
import { userAtom } from '@/stores/auth';

export function ClientDashboard() {
  const user = useAtomValue(userAtom);

  // In the future, we'll fetch participant data and their invoices
  // using user.participantId
  const planData = {
    totalBudget: 0,
    usedBudget: 0,
    remainingBudget: 0,
    planEndDate: null as string | null,
    invoicesCount: 0,
  };

  const budgetPercentage = planData.totalBudget > 0
    ? Math.round((planData.usedBudget / planData.totalBudget) * 100)
    : 0;

  return (
    <div className="space-y-8">
      {/* Budget Overview */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="Total Budget"
          value={`$${planData.totalBudget.toLocaleString()}`}
          icon={DollarSign}
          description="Your NDIS plan allocation"
        />
        <StatCard
          title="Budget Used"
          value={`$${planData.usedBudget.toLocaleString()}`}
          icon={TrendingDown}
          description={`${budgetPercentage}% of total`}
          variant={budgetPercentage > 80 ? 'warning' : 'default'}
        />
        <StatCard
          title="Remaining"
          value={`$${planData.remainingBudget.toLocaleString()}`}
          icon={CheckCircle2}
          description="Available funds"
          variant="success"
        />
        <StatCard
          title="Invoices"
          value={planData.invoicesCount.toString()}
          icon={FileText}
          description="Total invoices received"
        />
      </div>

      {/* Plan Status */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base flex items-center gap-2">
            <Calendar className="size-4" />
            Your NDIS Plan
          </CardTitle>
          <CardDescription>Plan details and timeline</CardDescription>
        </CardHeader>
        <CardContent>
          {planData.planEndDate ? (
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">Plan End Date</span>
                <span className="font-medium">{planData.planEndDate}</span>
              </div>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Budget Utilization</span>
                  <span>{budgetPercentage}%</span>
                </div>
                <div className="h-2 bg-muted rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all ${
                      budgetPercentage > 80 ? 'bg-yellow-500' : 'bg-primary'
                    }`}
                    style={{ width: `${budgetPercentage}%` }}
                  />
                </div>
              </div>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-8 text-center">
              <div className="flex size-12 items-center justify-center rounded-full bg-muted mb-4">
                <Calendar className="size-6 text-muted-foreground" />
              </div>
              <p className="text-sm font-medium text-muted-foreground">Plan details loading</p>
              <p className="text-xs text-muted-foreground mt-1">
                Your plan information will appear here
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Recent Invoices */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base flex items-center gap-2">
            <FileText className="size-4" />
            Recent Invoices
          </CardTitle>
          <CardDescription>Invoices submitted by your service providers</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <div className="flex size-12 items-center justify-center rounded-full bg-muted mb-4">
              <FileText className="size-6 text-muted-foreground" />
            </div>
            <p className="text-sm font-medium text-muted-foreground">No invoices yet</p>
            <p className="text-xs text-muted-foreground mt-1">
              Invoices from your providers will appear here
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Participant Info */}
      {user?.participantId && (
        <Card className="border-primary/20 bg-primary/5">
          <CardContent className="p-6">
            <div className="flex items-start gap-4">
              <div className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-primary/10">
                <CheckCircle2 className="size-5 text-primary" />
              </div>
              <div className="space-y-1">
                <p className="text-sm font-medium">Participant Account Active</p>
                <p className="text-sm text-muted-foreground">
                  Your NDIS participant account is set up. You can view invoices submitted by your providers.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {!user?.participantId && (
        <Card className="border-yellow-500/20 bg-yellow-50/50">
          <CardContent className="p-6">
            <div className="flex items-start gap-4">
              <div className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-yellow-100">
                <Clock className="size-5 text-yellow-600" />
              </div>
              <div className="space-y-1">
                <p className="text-sm font-medium">Account Setup Pending</p>
                <p className="text-sm text-muted-foreground">
                  Your participant profile is being set up. Contact your plan manager if you need assistance.
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
