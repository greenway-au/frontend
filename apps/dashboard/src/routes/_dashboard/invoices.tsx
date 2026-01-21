/**
 * Invoices Route
 * Provider-only invoice upload and validation page
 * Modern, professional design with improved UX
 */

import { createFileRoute } from '@tanstack/react-router';
import { PageHeader } from '@/components/common/PageHeader';
import { Alert, AlertDescription } from '@workspace/ui/components/alert';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@workspace/ui/components/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@workspace/ui/components/tabs';
import { AlertCircle, Upload, FileText, CheckCircle2, Clock, XCircle } from 'lucide-react';
import { useIsProvider } from '@/features/auth';
import { InvoiceUpload, InvoiceList } from '@/features/invoices';
import { useDocuments } from '@/features/invoices/api/invoices.queries';

export const Route = createFileRoute('/_dashboard/invoices')({
  component: InvoicesPage,
});

function InvoicesPage() {
  const isProvider = useIsProvider();
  const { data: documentsData } = useDocuments({ limit: 100 });

  const stats = {
    total: documentsData?.total || 0,
    completed: documentsData?.documents?.filter((d) => d.status === 'completed').length || 0,
    processing:
      documentsData?.documents?.filter((d) => d.status === 'processing' || d.status === 'pending').length || 0,
    failed: documentsData?.documents?.filter((d) => d.status === 'failed').length || 0,
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Invoice Management"
        description="Upload and validate NDIS invoices automatically with AI-powered validation"
      />

      {!isProvider ? (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            Only providers can access invoice management. Please log in with a provider account.
          </AlertDescription>
        </Alert>
      ) : (
        <>
          {/* Stats Overview */}
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <StatCard
              icon={FileText}
              label="Total Invoices"
              value={stats.total}
              iconClassName="text-primary"
              bgClassName="bg-primary/10"
            />
            <StatCard
              icon={CheckCircle2}
              label="Validated"
              value={stats.completed}
              iconClassName="text-green-600"
              bgClassName="bg-green-50"
            />
            <StatCard
              icon={Clock}
              label="Processing"
              value={stats.processing}
              iconClassName="text-yellow-600"
              bgClassName="bg-yellow-50"
            />
            <StatCard
              icon={XCircle}
              label="Failed"
              value={stats.failed}
              iconClassName="text-red-600"
              bgClassName="bg-red-50"
            />
          </div>

          {/* Main Content */}
          <div className="grid gap-6 lg:grid-cols-3">
            {/* Upload Section - Takes 1 column */}
            <div className="lg:col-span-1">
              <Card className="sticky top-6">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Upload className="size-5" />
                    Upload Invoice
                  </CardTitle>
                  <CardDescription>Upload PDF invoices for automatic NDIS compliance validation</CardDescription>
                </CardHeader>
                <CardContent>
                  <InvoiceUpload />
                </CardContent>
              </Card>
            </div>

            {/* Documents List - Takes 2 columns */}
            <div className="lg:col-span-2">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <FileText className="size-5" />
                    Your Invoices
                  </CardTitle>
                  <CardDescription>View and manage your uploaded invoices</CardDescription>
                </CardHeader>
                <CardContent>
                  <Tabs defaultValue="all" className="w-full">
                    <TabsList className="grid w-full grid-cols-4">
                      <TabsTrigger value="all">All ({stats.total})</TabsTrigger>
                      <TabsTrigger value="completed">Validated ({stats.completed})</TabsTrigger>
                      <TabsTrigger value="processing">Processing ({stats.processing})</TabsTrigger>
                      <TabsTrigger value="failed">Failed ({stats.failed})</TabsTrigger>
                    </TabsList>

                    <TabsContent value="all" className="mt-6">
                      <InvoiceList />
                    </TabsContent>
                    <TabsContent value="completed" className="mt-6">
                      <InvoiceList statusFilter="completed" />
                    </TabsContent>
                    <TabsContent value="processing" className="mt-6">
                      <InvoiceList statusFilter="processing" />
                    </TabsContent>
                    <TabsContent value="failed" className="mt-6">
                      <InvoiceList statusFilter="failed" />
                    </TabsContent>
                  </Tabs>
                </CardContent>
              </Card>
            </div>
          </div>
        </>
      )}
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
      <CardContent className="p-6">
        <div className="flex items-center gap-4">
          <div className={`flex size-12 shrink-0 items-center justify-center rounded-lg ${bgClassName}`}>
            <Icon className={`size-6 ${iconClassName}`} />
          </div>
          <div>
            <p className="text-2xl font-bold">{value}</p>
            <p className="text-sm text-muted-foreground">{label}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
