/**
 * Invoice List Component
 * Displays a list of user's documents
 */

import { InvoiceCard } from './InvoiceCard';
import { LoadingSpinner } from '@/components/common/LoadingSpinner';
import { EmptyState } from '@/components/common/EmptyState';
import { useDocuments } from '../api/invoices.queries';
import { FileText } from 'lucide-react';

export function InvoiceList() {
  const { data, isLoading, error } = useDocuments({ limit: 50 });

  if (isLoading) {
    return (
      <div className="flex justify-center py-12">
        <LoadingSpinner />
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <p className="text-red-600">Failed to load documents. Please try again.</p>
      </div>
    );
  }

  if (!data?.data || data.data.length === 0) {
    return (
      <EmptyState
        icon={<FileText className="size-6 text-muted-foreground" />}
        title="No invoices yet"
        description="Upload your first invoice PDF to get started with validation."
      />
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-medium text-gray-900">Your Documents ({data.total})</h3>
      </div>
      <div className="grid gap-4">
        {data.data.map((document) => (
          <InvoiceCard key={document.id} document={document} />
        ))}
      </div>
    </div>
  );
}
