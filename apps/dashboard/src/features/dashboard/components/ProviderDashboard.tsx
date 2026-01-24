/**
 * Provider Dashboard
 * Dashboard view for provider users showing their invoices and participants
 */

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@workspace/ui/components/card';
import { Button } from '@workspace/ui/components/button';
import { Link } from '@tanstack/react-router';
import { FileText, Upload, DollarSign, Clock, CheckCircle2, TrendingUp } from 'lucide-react';
import { useAtomValue } from 'jotai';
import { userAtom } from '@/stores/auth';

export function ProviderDashboard() {
  const user = useAtomValue(userAtom);

  // In the future, we'll fetch invoices for this provider using user.providerId
  // For now, show placeholder stats
  const stats = {
    totalInvoices: 0,
    pendingInvoices: 0,
    approvedInvoices: 0,
    paidAmount: 0,
  };

  return (
    <div className="space-y-8">
      {/* Stats Grid */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="Total Invoices"
          value={stats.totalInvoices.toString()}
          icon={FileText}
          description="All submitted invoices"
        />
        <StatCard
          title="Pending Review"
          value={stats.pendingInvoices.toString()}
          icon={Clock}
          description="Awaiting approval"
          variant="warning"
        />
        <StatCard
          title="Approved"
          value={stats.approvedInvoices.toString()}
          icon={CheckCircle2}
          description="Ready for payment"
          variant="success"
        />
        <StatCard
          title="Total Paid"
          value={`$${stats.paidAmount.toLocaleString()}`}
          icon={DollarSign}
          description="This month"
        />
      </div>

      {/* Quick Actions */}
      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <Upload className="size-4" />
              Submit Invoice
            </CardTitle>
            <CardDescription>Upload a new invoice for validation</CardDescription>
          </CardHeader>
          <CardContent>
            <Button asChild className="w-full">
              <Link to="/invoices">
                <Upload className="size-4 mr-2" />
                Upload Invoice
              </Link>
            </Button>
            <p className="text-xs text-muted-foreground mt-3 text-center">
              AI-powered validation will check your invoice automatically
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <FileText className="size-4" />
              View All Invoices
            </CardTitle>
            <CardDescription>Track and manage your submitted invoices</CardDescription>
          </CardHeader>
          <CardContent>
            <Button asChild variant="outline" className="w-full">
              <Link to="/invoices">
                <FileText className="size-4 mr-2" />
                View Invoices
              </Link>
            </Button>
            <p className="text-xs text-muted-foreground mt-3 text-center">
              See status updates and validation results
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Recent Activity Placeholder */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base flex items-center gap-2">
            <TrendingUp className="size-4" />
            Recent Activity
          </CardTitle>
          <CardDescription>Your latest invoice submissions</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <div className="flex size-12 items-center justify-center rounded-full bg-muted mb-4">
              <FileText className="size-6 text-muted-foreground" />
            </div>
            <p className="text-sm font-medium text-muted-foreground">No invoices yet</p>
            <p className="text-xs text-muted-foreground mt-1">
              Upload your first invoice to get started
            </p>
            <Button asChild className="mt-4">
              <Link to="/invoices">
                <Upload className="size-4 mr-2" />
                Upload Invoice
              </Link>
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Provider Info */}
      {user?.providerId && (
        <Card className="border-primary/20 bg-primary/5">
          <CardContent className="p-6">
            <div className="flex items-start gap-4">
              <div className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-primary/10">
                <CheckCircle2 className="size-5 text-primary" />
              </div>
              <div className="space-y-1">
                <p className="text-sm font-medium">Provider Account Active</p>
                <p className="text-sm text-muted-foreground">
                  Your provider account is linked and ready. You can submit invoices for your participants.
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
