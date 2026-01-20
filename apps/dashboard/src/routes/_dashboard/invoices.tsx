/**
 * Invoices Route
 * Provider-only invoice upload and validation page
 */

import { createFileRoute } from '@tanstack/react-router';
import { PageHeader } from '@/components/common/PageHeader';
import { Alert, AlertDescription } from '@workspace/ui/components/alert';
import { AlertCircle } from 'lucide-react';
import { useIsProvider } from '@/features/auth';
import { InvoiceUpload, InvoiceList } from '@/features/invoices';

export const Route = createFileRoute('/_dashboard/invoices')({
  component: InvoicesPage,
});

function InvoicesPage() {
  const isProvider = useIsProvider();

  return (
    <div className="space-y-6">
      <PageHeader title="Invoice Management" description="Upload and validate NDIS invoices automatically" />

      {/* Provider-only check */}
      {!isProvider ? (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            Only providers can access invoice management. Please log in with a provider account.
          </AlertDescription>
        </Alert>
      ) : (
        <div className="grid gap-6 lg:grid-cols-2">
          {/* Upload Section */}
          <div>
            <h2 className="text-lg font-semibold mb-4">Upload Invoice</h2>
            <InvoiceUpload />
          </div>

          {/* Documents List */}
          <div>
            <h2 className="text-lg font-semibold mb-4">Your Documents</h2>
            <InvoiceList />
          </div>
        </div>
      )}
    </div>
  );
}
