/**
 * Provider Dashboard
 * Dashboard view for provider users showing their invoices and participants
 */

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@workspace/ui/components/card';
import { Button } from '@workspace/ui/components/button';
import { Link } from '@tanstack/react-router';
import { FileText, Upload, DollarSign, Clock, CheckCircle2, TrendingUp, Users, AlertCircle, Loader2 } from 'lucide-react';
import { useAtomValue } from 'jotai';
import { userAtom } from '@/stores/auth';
import { useMyParticipantsAsProvider } from '@/features/admin/api/relationships.queries';
import { Badge } from '@workspace/ui/components/badge';

export function ProviderDashboard() {
  const user = useAtomValue(userAtom);

  // Fetch linked participants using the role-specific "me" endpoint
  const {
    data: relationships,
    isLoading: isLoadingParticipants,
    isError: isParticipantsError,
    error: participantsError,
  } = useMyParticipantsAsProvider();

  // Calculate stats
  const stats = {
    totalInvoices: 0, // TODO: Integrate with invoices
    pendingInvoices: 0,
    approvedInvoices: 0,
    paidAmount: 0,
    linkedParticipants: relationships?.length ?? 0,
  };

  return (
    <div className="space-y-8">
      {/* Stats Grid */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
        <StatCard
          title="Linked Participants"
          value={stats.linkedParticipants.toString()}
          icon={Users}
          description="Participants you serve"
        />
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

      {/* Linked Participants */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base flex items-center gap-2">
            <Users className="size-4" />
            Your Participants
          </CardTitle>
          <CardDescription>Participants you are linked to provide services for</CardDescription>
        </CardHeader>
        <CardContent>
          {isLoadingParticipants ? (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <Loader2 className="size-8 animate-spin text-muted-foreground mb-4" />
              <p className="text-sm text-muted-foreground">Loading participants...</p>
            </div>
          ) : isParticipantsError ? (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <div className="flex size-12 items-center justify-center rounded-full bg-red-100 mb-4">
                <AlertCircle className="size-6 text-red-600" />
              </div>
              <p className="text-sm font-medium text-red-600">Failed to load participants</p>
              <p className="text-xs text-muted-foreground mt-1">
                {participantsError instanceof Error ? participantsError.message : 'Please try again later'}
              </p>
            </div>
          ) : relationships && relationships.length > 0 ? (
            <div className="space-y-3">
              {relationships.map((relationship) => (
                <div
                  key={relationship.id}
                  className="flex items-center justify-between p-4 rounded-lg border bg-card hover:bg-muted/50 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <div className="flex size-10 items-center justify-center rounded-full bg-primary/10">
                      <Users className="size-5 text-primary" />
                    </div>
                    <div>
                      <p className="text-sm font-medium">Participant</p>
                      <p className="text-xs text-muted-foreground">
                        ID: {relationship.participant_id.slice(0, 8)}...
                      </p>
                    </div>
                  </div>
                  <Badge
                    variant={relationship.status === 'active' ? 'default' : 'secondary'}
                    className="text-xs"
                  >
                    {relationship.status}
                  </Badge>
                </div>
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <div className="flex size-12 items-center justify-center rounded-full bg-muted mb-4">
                <Users className="size-6 text-muted-foreground" />
              </div>
              <p className="text-sm font-medium text-muted-foreground">No participants linked</p>
              <p className="text-xs text-muted-foreground mt-1">
                Participants will appear here when linked by an admin
              </p>
            </div>
          )}
        </CardContent>
      </Card>

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
                  Your provider account is linked and ready. You can submit invoices for your linked participants.
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
