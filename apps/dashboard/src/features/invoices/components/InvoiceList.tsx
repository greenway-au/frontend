/**
 * Invoice List Component
 * Displays a list of user's documents with optional status filtering
 */

import { InvoiceCard } from './InvoiceCard';
import { LoadingSpinner } from '@/components/common/LoadingSpinner';
import { EmptyState } from '@/components/common/EmptyState';
import { useDocuments } from '../api/invoices.queries';
import { FileText, Filter } from 'lucide-react';
import type { DocumentStatus } from '../types/invoice.types';

interface InvoiceListProps {
  statusFilter?: 'completed' | 'processing' | 'failed';
}

export function InvoiceList({ statusFilter }: InvoiceListProps) {
  const { data, isLoading, error } = useDocuments({ limit: 100 });

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

  let filteredDocuments = data?.documents || [];

  if (statusFilter) {
    filteredDocuments = filteredDocuments.filter((doc) => {
      if (statusFilter === 'processing') {
        return doc.status === 'processing' || doc.status === 'pending';
      }
      return doc.status === statusFilter;
    });
  }

  if (filteredDocuments.length === 0) {
    const emptyMessages = {
      completed: { title: 'No validated invoices', description: 'Completed invoices will appear here' },
      processing: { title: 'No processing invoices', description: 'Invoices being processed will appear here' },
      failed: { title: 'No failed invoices', description: 'Failed invoices will appear here' },
      default: {
        title: 'No invoices yet',
        description: 'Upload your first invoice PDF to get started with validation',
      },
    };

    const message = statusFilter ? emptyMessages[statusFilter] : emptyMessages.default;

    return (
      <EmptyState
        icon={<FileText className="size-6 text-muted-foreground" />}
        title={message.title}
        description={message.description}
      />
    );
  }

  return (
    <div className="space-y-4">
      <div className="grid gap-3">
        {filteredDocuments.map((document) => (
          <InvoiceCard key={document.id} document={document} />
        ))}
      </div>
    </div>
  );
}
