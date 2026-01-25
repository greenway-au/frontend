/**
 * Invoices Route
 * Invoice management page with role-based content
 * - Admin: View all invoices, approve/reject, upload
 * - Provider: View and create invoices
 * - Client: View invoices (read-only)
 */

import { createFileRoute } from '@tanstack/react-router';
import { useAtomValue } from 'jotai';
import { userAtom } from '@/stores/auth';
import { PageHeader } from '@/components/common/PageHeader';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@workspace/ui/components/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@workspace/ui/components/tabs';
import { Upload, FileText, CheckCircle2, Clock, XCircle, DollarSign } from 'lucide-react';
import { InvoiceUpload, InvoiceTable, useInvoices } from '@/features/invoices';

export const Route = createFileRoute('/_dashboard/invoices')({
  component: InvoicesPage,
});

function InvoicesPage() {
  const user = useAtomValue(userAtom);
  const { data: invoicesData, isLoading } = useInvoices({ limit: 100 });

  const isAdmin = user?.userType === 'admin';
  const isProvider = user?.userType === 'provider';
  const isClient = user?.userType === 'client';

  // Calculate stats from invoice data
  const stats = {
    total: invoicesData?.total || 0,
    pending: invoicesData?.invoices?.filter((i) => i.status === 'pending').length || 0,
    approved: invoicesData?.invoices?.filter((i) => i.status === 'approved').length || 0,
    paid: invoicesData?.invoices?.filter((i) => i.status === 'paid').length || 0,
    rejected: invoicesData?.invoices?.filter((i) => i.status === 'rejected').length || 0,
  };

  // Filter invoices by status for tabs
  const allInvoices = invoicesData?.invoices || [];
  const pendingInvoices = allInvoices.filter((i) => i.status === 'pending');
  const approvedInvoices = allInvoices.filter((i) => i.status === 'approved');
  const paidInvoices = allInvoices.filter((i) => i.status === 'paid');
  const rejectedInvoices = allInvoices.filter((i) => i.status === 'rejected');

  const getPageDescription = () => {
    if (isAdmin) return 'View all invoices, approve, reject, or mark as paid';
    if (isProvider) return 'View and manage your submitted invoices';
    if (isClient) return 'View invoices from your service providers';
    return 'Manage your invoices';
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Invoices"
        description={getPageDescription()}
      />

      {/* Stats Overview */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
        <StatCard
          icon={FileText}
          label="Total"
          value={stats.total}
          iconClassName="text-primary"
          bgClassName="bg-primary/10"
        />
        <StatCard
          icon={Clock}
          label="Pending"
          value={stats.pending}
          iconClassName="text-yellow-600"
          bgClassName="bg-yellow-50"
        />
        <StatCard
          icon={CheckCircle2}
          label="Approved"
          value={stats.approved}
          iconClassName="text-green-600"
          bgClassName="bg-green-50"
        />
        <StatCard
          icon={DollarSign}
          label="Paid"
          value={stats.paid}
          iconClassName="text-blue-600"
          bgClassName="bg-blue-50"
        />
        <StatCard
          icon={XCircle}
          label="Rejected"
          value={stats.rejected}
          iconClassName="text-red-600"
          bgClassName="bg-red-50"
        />
      </div>

      {/* Main Content */}
      <div className="grid gap-6 lg:grid-cols-3">
        {/* Upload Section - Only for admins and providers */}
        {(isAdmin || isProvider) && (
          <div className="lg:col-span-1">
            <Card className="sticky top-6">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Upload className="size-5" />
                  Upload Invoice
                </CardTitle>
                <CardDescription>
                  Upload PDF invoices for automatic NDIS compliance validation
                </CardDescription>
              </CardHeader>
              <CardContent>
                <InvoiceUpload />
              </CardContent>
            </Card>
          </div>
        )}

        {/* Invoices List */}
        <div className={isAdmin || isProvider ? 'lg:col-span-2' : 'lg:col-span-3'}>
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="size-5" />
                {isAdmin ? 'All Invoices' : isProvider ? 'My Invoices' : 'My Invoices'}
              </CardTitle>
              <CardDescription>
                {isAdmin
                  ? 'Manage and review all invoices in the system'
                  : isProvider
                    ? 'Track the status of your submitted invoices'
                    : 'View invoices submitted by your providers'}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue="all" className="w-full">
                <TabsList className="grid w-full grid-cols-5">
                  <TabsTrigger value="all">All ({stats.total})</TabsTrigger>
                  <TabsTrigger value="pending">Pending ({stats.pending})</TabsTrigger>
                  <TabsTrigger value="approved">Approved ({stats.approved})</TabsTrigger>
                  <TabsTrigger value="paid">Paid ({stats.paid})</TabsTrigger>
                  <TabsTrigger value="rejected">Rejected ({stats.rejected})</TabsTrigger>
                </TabsList>

                <TabsContent value="all" className="mt-6">
                  <InvoiceTable invoices={allInvoices} isLoading={isLoading} />
                </TabsContent>
                <TabsContent value="pending" className="mt-6">
                  <InvoiceTable invoices={pendingInvoices} isLoading={isLoading} />
                </TabsContent>
                <TabsContent value="approved" className="mt-6">
                  <InvoiceTable invoices={approvedInvoices} isLoading={isLoading} />
                </TabsContent>
                <TabsContent value="paid" className="mt-6">
                  <InvoiceTable invoices={paidInvoices} isLoading={isLoading} />
                </TabsContent>
                <TabsContent value="rejected" className="mt-6">
                  <InvoiceTable invoices={rejectedInvoices} isLoading={isLoading} />
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

interface StatCardProps {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  value: number;
  iconClassName: string;
  bgClassName: string;
}

function StatCard({ icon: Icon, label, value, iconClassName, bgClassName }: StatCardProps) {
  return (
    <Card>
      <CardContent className="p-4">
        <div className="flex items-center gap-3">
          <div className={`flex size-10 shrink-0 items-center justify-center rounded-lg ${bgClassName}`}>
            <Icon className={`size-5 ${iconClassName}`} />
          </div>
          <div>
            <p className="text-xl font-bold">{value}</p>
            <p className="text-xs text-muted-foreground">{label}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
