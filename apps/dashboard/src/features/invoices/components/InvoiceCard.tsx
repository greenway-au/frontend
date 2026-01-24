/**
 * Invoice Card Component
 * Displays a document card with status badge and validation results
 * Enhanced with better visuals and download functionality
 */

import { formatDistanceToNow } from 'date-fns';
import {
  FileText,
  Loader2,
  CheckCircle2,
  XCircle,
  Trash2,
  Download,
  AlertTriangle,
  Clock,
  ShieldAlert,
  ShieldCheck,
} from 'lucide-react';
import { Card, CardContent } from '@workspace/ui/components/card';
import { Badge } from '@workspace/ui/components/badge';
import { Button } from '@workspace/ui/components/button';
import type { Document, DocumentStatus, ValidationResult } from '../types/invoice.types';
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
            variant: 'error',
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
        variant: 'error',
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
          <ValidationResultDisplay validationResult={document.validation_result} />
        )}

        {/* Failed Status Error */}
        {document.status === 'failed' && document.validation_result?.reason && (
          <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg">
            <div className="flex items-start gap-2">
              <XCircle className="h-5 w-5 text-red-600 mt-0.5 shrink-0" />
              <div>
                <p className="text-sm font-semibold text-red-900 mb-1">Processing Failed</p>
                <p className="text-sm text-red-700">
                  {document.validation_result.reason || 'An error occurred during processing'}
                </p>
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

/**
 * ValidationResultDisplay Component
 * Displays validation results with clear distinction between valid, invalid, and old pricing
 */
interface ValidationResultDisplayProps {
  validationResult: ValidationResult;
}

function ValidationResultDisplay({ validationResult }: ValidationResultDisplayProps) {
  const { status, reason, checks } = validationResult;

  if (status === 'valid') {
    // Valid invoice
    return (
      <div className="mt-4 p-4 rounded-lg border border-green-200 bg-green-50">
        <div className="flex items-center gap-2 mb-2">
          <ShieldCheck className="h-6 w-6 text-green-600" />
          <div>
            <p className="text-sm font-bold text-green-900">Valid NDIS Invoice</p>
            <p className="text-xs text-green-700">{reason}</p>
          </div>
        </div>

        {/* Show check details if available */}
        {checks && checks.length > 0 && (
          <div className="mt-3 pt-3 border-t border-green-200 space-y-1.5">
            <p className="text-xs font-semibold text-green-900">Item Checks:</p>
            {checks.map((check, idx) => (
              <div key={idx} className="flex items-start gap-2 text-xs">
                <CheckCircle2 className="h-3.5 w-3.5 text-green-600 mt-0.5 shrink-0" />
                <div>
                  <span className="font-medium text-green-900">{check.item_code}:</span>{' '}
                  <span className="text-green-700">{check.message}</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    );
  }

  if (status === 'old_pricing') {
    // Old pricing detected - warning style
    return (
      <div className="mt-4 p-4 rounded-lg border border-yellow-200 bg-yellow-50">
        <div className="flex items-start gap-3 mb-3">
          <div className="flex size-10 shrink-0 items-center justify-center rounded-full bg-yellow-100">
            <AlertTriangle className="h-6 w-6 text-yellow-600" />
          </div>
          <div>
            <p className="text-base font-bold text-yellow-900">Old Pricing Detected</p>
            <p className="text-sm text-yellow-700 mt-0.5">{reason}</p>
          </div>
        </div>

        {/* Show check details */}
        {checks && checks.length > 0 && (
          <div className="space-y-2 text-sm">
            {checks.map((check, idx) => {
              const isOldPricing = check.status === 'old_pricing';
              const Icon = isOldPricing ? AlertTriangle : check.status === 'valid' ? CheckCircle2 : XCircle;
              const colorClass = isOldPricing
                ? 'text-yellow-700'
                : check.status === 'valid'
                  ? 'text-green-700'
                  : 'text-red-700';

              return (
                <div key={idx} className="flex items-start gap-2">
                  <Icon className={`h-4 w-4 mt-0.5 shrink-0 ${colorClass}`} />
                  <div className={colorClass}>
                    <span className="font-medium">{check.item_code}:</span> {check.message}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    );
  }

  if (status === 'invalid') {
    // Invalid invoice - could be fraud or validation errors
    const isFraud = reason.toUpperCase().includes('FRAUD');

    return (
      <div
        className={`mt-4 p-4 rounded-lg ${isFraud ? 'border-2 border-red-400 bg-red-50' : 'border border-red-200 bg-red-50'}`}
      >
        <div className="flex items-start gap-3 mb-3">
          <div className="flex size-10 shrink-0 items-center justify-center rounded-full bg-red-100">
            <ShieldAlert className="h-6 w-6 text-red-600" />
          </div>
          <div>
            <p className="text-base font-bold text-red-900">{isFraud ? '⚠️ FRAUD DETECTED' : 'Invalid Invoice'}</p>
            <p className="text-sm text-red-700 mt-0.5">{reason}</p>
          </div>
        </div>

        {/* Show check details */}
        {checks && checks.length > 0 && (
          <div className="space-y-2 text-sm">
            <p className="font-semibold text-red-900">Item Checks:</p>
            {checks.map((check, idx) => {
              const Icon =
                check.status === 'valid'
                  ? CheckCircle2
                  : check.status === 'not_found'
                    ? AlertTriangle
                    : XCircle;
              const colorClass =
                check.status === 'valid'
                  ? 'text-green-700'
                  : check.status === 'not_found'
                    ? 'text-yellow-700'
                    : 'text-red-700';

              return (
                <div key={idx} className="flex items-start gap-2">
                  <Icon className={`h-4 w-4 mt-0.5 shrink-0 ${colorClass}`} />
                  <div className={colorClass}>
                    <span className="font-medium">{check.item_code}:</span> {check.message}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    );
  }

  // Fallback for unknown status
  return null;
}
