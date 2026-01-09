/**
 * Documents Route
 * Document management placeholder
 */

import { createFileRoute } from '@tanstack/react-router';
import { PageHeader } from '@/components/common/PageHeader';
import { EmptyState } from '@/components/common/EmptyState';
import { FileText } from 'lucide-react';

export const Route = createFileRoute('/_dashboard/documents')({
  component: DocumentsPage,
});

function DocumentsPage() {
  return (
    <div className="space-y-6">
      <PageHeader
        title="Documents"
        description="Manage NDIS documents and files"
        action={{
          label: 'Upload Document',
          onClick: () => console.log('Upload clicked'),
        }}
      />

      <EmptyState
        icon={<FileText className="size-6 text-muted-foreground" />}
        title="No documents yet"
        description="Upload your first document to get started with document management."
        action={{
          label: 'Upload Document',
          onClick: () => console.log('Upload clicked'),
        }}
      />
    </div>
  );
}
