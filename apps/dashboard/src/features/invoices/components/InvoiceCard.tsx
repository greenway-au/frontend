/**
 * Invoice Card Component
 * Displays a document card with status badge and validation results
 * Enhanced with better visuals and download functionality
 */

import { formatDistanceToNow } from 'date-fns';
import { FileText, Loader2, CheckCircle2, XCircle, Trash2, Download, AlertTriangle, Clock } from 'lucide-react';
import { Card, CardContent } from '@workspace/ui/components/card';
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
  {
    label: string;
    variant: 'default' | 'secondary' | 'outline' | 'destructive';
    icon: any;
    bgColor: string;
    textColor: string;
  }
> = {
  pending: {
    label: 'Pending',
    variant: 'secondary',
    icon: Clock,
    bgColor: 'bg-yellow-50',
    textColor: 'text-yellow-700',
  },
  processing: {
    label: 'Processing',
    variant: 'default',
    icon: Loader2,
    bgColor: 'bg-blue-50',
    textColor: 'text-blue-700',
  },
  completed: {
    label: 'Completed',
    variant: 'outline',
    icon: CheckCircle2,
    bgColor: 'bg-green-50',
    textColor: 'text-green-700',
  },
  failed: {
    label: 'Failed',
    variant: 'destructive',
    icon: XCircle,
    bgColor: 'bg-red-50',
    textColor: 'text-red-700',
  },
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

  const handleDownload = async () => {
    try {
      const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080';
      const token = localStorage.getItem('token');

      const response = await fetch(
        `${API_BASE_URL}/api/v1/storage/download?key=${encodeURIComponent(document.s3_key)}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      if (!response.ok) throw new Error('Download failed');

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = window.document.createElement('a');
      a.href = url;
      a.download = document.filename;
      window.document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      window.document.body.removeChild(a);

      toast({
        title: 'Download Started',
        description: `Downloading ${document.filename}`,
      });
    } catch (error) {
      toast({
        title: 'Download Failed',
        description: 'Failed to download the document. Please try again.',
        variant: 'destructive',
      });
    }
  };

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  return (
    <Card className="hover:shadow-md transition-all hover:border-primary/40">
      <CardContent className="p-5">
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-start gap-4 flex-1 min-w-0">
            {/* PDF Icon */}
            <div className={`flex size-12 shrink-0 items-center justify-center rounded-lg ${config.bgColor}`}>
              <FileText className={`size-6 ${config.textColor}`} />
            </div>

            {/* Document Info */}
            <div className="flex-1 min-w-0 space-y-2">
              <div>
                <h3 className="font-semibold text-base truncate">{document.filename}</h3>
                <div className="flex items-center gap-3 mt-1 text-sm text-muted-foreground">
                  <span>{formatFileSize(document.file_size)}</span>
                  <span>•</span>
                  <span>{formatDistanceToNow(new Date(document.created_at), { addSuffix: true })}</span>
                </div>
              </div>

              {/* Status Badge */}
              <Badge variant={config.variant} className="flex items-center gap-1.5 w-fit">
                <StatusIcon className={`h-3.5 w-3.5 ${isProcessing ? 'animate-spin' : ''}`} />
                {config.label}
              </Badge>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-1">
            {document.status === 'completed' && (
              <Button variant="ghost" size="icon" onClick={handleDownload} title="Download invoice">
                <Download className="h-4 w-4" />
              </Button>
            )}
            <Button
              variant="ghost"
              size="icon"
              onClick={handleDelete}
              disabled={deleteMutation.isPending}
              title="Delete invoice"
            >
              <Trash2 className="h-4 w-4 text-muted-foreground hover:text-red-600" />
            </Button>
          </div>
        </div>

        {/* Validation Results */}
        {document.validation_result && document.status === 'completed' && (
          <div
            className={`mt-4 p-4 rounded-lg border ${
              document.validation_result.is_valid ? 'bg-green-50 border-green-200' : 'bg-red-50 border-red-200'
            }`}
          >
            <div className="flex items-center gap-2 mb-3">
              {document.validation_result.is_valid ? (
                <CheckCircle2 className="h-5 w-5 text-green-600" />
              ) : (
                <XCircle className="h-5 w-5 text-red-600" />
              )}
              <span
                className={`text-sm font-semibold ${
                  document.validation_result.is_valid ? 'text-green-900' : 'text-red-900'
                }`}
              >
                {document.validation_result.is_valid ? 'Valid NDIS Invoice' : 'Validation Failed'}
              </span>
            </div>

            {document.validation_result.errors && document.validation_result.errors.length > 0 && (
              <div className="space-y-1.5 text-sm">
                {document.validation_result.errors.map((error, idx) => (
                  <div key={idx} className="flex items-start gap-2 text-red-700">
                    <XCircle className="h-4 w-4 mt-0.5 shrink-0" />
                    <span>{error}</span>
                  </div>
                ))}
              </div>
            )}

            {document.validation_result.warnings && document.validation_result.warnings.length > 0 && (
              <div className="space-y-1.5 text-sm mt-3">
                {document.validation_result.warnings.map((warning, idx) => (
                  <div key={idx} className="flex items-start gap-2 text-yellow-700">
                    <AlertTriangle className="h-4 w-4 mt-0.5 shrink-0" />
                    <span>{warning}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Failed Status Error */}
        {document.status === 'failed' && document.validation_result?.errors && (
          <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg">
            <div className="flex items-start gap-2">
              <XCircle className="h-5 w-5 text-red-600 mt-0.5 shrink-0" />
              <div>
                <p className="text-sm font-semibold text-red-900 mb-1">Processing Failed</p>
                <p className="text-sm text-red-700">
                  {document.validation_result.errors[0] || 'An error occurred during processing'}
                </p>
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
