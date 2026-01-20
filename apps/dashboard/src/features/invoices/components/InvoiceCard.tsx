/**
 * Invoice Card Component
 * Displays a document card with status badge and validation results
 */

import { formatDistanceToNow } from 'date-fns';
import { FileText, Loader2, CheckCircle, XCircle, Trash2 } from 'lucide-react';
import { Card, CardContent, CardFooter } from '@workspace/ui/components/card';
import { Badge } from '@workspace/ui/components/badge';
import { Button } from '@workspace/ui/components/button';
import type { Document, DocumentStatus } from '../types/invoice.types';
import { useDeleteDocument } from '../api/invoices.queries';
import { useToast } from '@/hooks/use-toast';

interface InvoiceCardProps {
  document: Document;
}

const statusConfig: Record<
  DocumentStatus,
  { label: string; variant: 'default' | 'secondary' | 'success' | 'destructive'; icon: any }
> = {
  pending: { label: 'Pending', variant: 'secondary', icon: Loader2 },
  processing: { label: 'Processing', variant: 'default', icon: Loader2 },
  completed: { label: 'Completed', variant: 'success', icon: CheckCircle },
  failed: { label: 'Failed', variant: 'destructive', icon: XCircle },
};

export function InvoiceCard({ document }: InvoiceCardProps) {
  const { toast } = useToast();
  const deleteMutation = useDeleteDocument();

  const config = statusConfig[document.status];
  const StatusIcon = config.icon;
  const isProcessing = document.status === 'pending' || document.status === 'processing';

  const handleDelete = () => {
    if (window.confirm('Are you sure you want to delete this document?')) {
      deleteMutation.mutate(document.id, {
        onSuccess: () => {
          toast({
            title: 'Document Deleted',
            description: 'The document has been removed successfully.',
          });
        },
        onError: () => {
          toast({
            title: 'Delete Failed',
            description: 'Failed to delete the document. Please try again.',
            variant: 'destructive',
          });
        },
      });
    }
  };

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardContent className="pt-6">
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-start gap-3 flex-1 min-w-0">
            <FileText className="h-10 w-10 text-gray-400 flex-shrink-0" />
            <div className="flex-1 min-w-0">
              <h3 className="font-medium text-gray-900 truncate">{document.filename}</h3>
              <p className="text-sm text-gray-500 mt-1">
                {formatFileSize(document.file_size)} •{' '}
                {formatDistanceToNow(new Date(document.created_at), { addSuffix: true })}
              </p>
              <div className="mt-2">
                <Badge variant={config.variant} className="flex items-center gap-1 w-fit">
                  <StatusIcon className={`h-3 w-3 ${isProcessing ? 'animate-spin' : ''}`} />
                  {config.label}
                </Badge>
              </div>
            </div>
          </div>
          <Button variant="ghost" size="icon" onClick={handleDelete} disabled={deleteMutation.isPending}>
            <Trash2 className="h-4 w-4 text-gray-500" />
          </Button>
        </div>

        {/* Validation Results */}
        {document.validation_result && document.status === 'completed' && (
          <div className="mt-4 p-3 bg-gray-50 rounded-md">
            <div className="flex items-center gap-2 mb-2">
              {document.validation_result.is_valid ? (
                <CheckCircle className="h-4 w-4 text-green-600" />
              ) : (
                <XCircle className="h-4 w-4 text-red-600" />
              )}
              <span className="text-sm font-medium">
                {document.validation_result.is_valid ? 'Valid Invoice' : 'Invalid Invoice'}
              </span>
            </div>

            {document.validation_result.errors && document.validation_result.errors.length > 0 && (
              <div className="text-sm text-red-600 space-y-1">
                {document.validation_result.errors.map((error, idx) => (
                  <p key={idx}>• {error}</p>
                ))}
              </div>
            )}

            {document.validation_result.warnings && document.validation_result.warnings.length > 0 && (
              <div className="text-sm text-yellow-600 space-y-1 mt-2">
                {document.validation_result.warnings.map((warning, idx) => (
                  <p key={idx}>• {warning}</p>
                ))}
              </div>
            )}
          </div>
        )}

        {document.status === 'failed' && document.validation_result?.errors && (
          <div className="mt-4 p-3 bg-red-50 rounded-md">
            <p className="text-sm text-red-600">{document.validation_result.errors[0] || 'Processing failed'}</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
