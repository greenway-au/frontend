/**
 * Invoice Upload Component
 * Dropzone for uploading PDF invoices with enhanced UX
 */

import { useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { Upload, FileText, CheckCircle2, Sparkles } from 'lucide-react';
import { useUploadDocument } from '../api/invoices.queries';
import { useToast } from '@/hooks/use-toast';

export function InvoiceUpload() {
  const { toast } = useToast();
  const uploadMutation = useUploadDocument();

  const onDrop = useCallback(
    (acceptedFiles: File[], rejectedFiles: any[]) => {
      if (rejectedFiles.length > 0) {
        const errors = rejectedFiles.map((f) => f.errors.map((e: any) => e.message).join(', '));
        toast({
          title: 'Upload Failed',
          description: `Invalid files: ${errors.join(', ')}`,
          variant: 'error',
        });
        return;
      }

      if (acceptedFiles.length > 0) {
        const file = acceptedFiles[0];
        uploadMutation.mutate(
          { file },
          {
            onSuccess: () => {
              toast({
                title: 'Upload Successful',
                description: `${file.name} is being validated by AI`,
              });
            },
            onError: (error: any) => {
              toast({
                title: 'Upload Failed',
                description: error?.message || 'Failed to upload document',
                variant: 'error',
              });
            },
          },
        );
      }
    },
    [uploadMutation, toast],
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'application/pdf': ['.pdf'],
    },
    maxFiles: 1,
    maxSize: 32 * 1024 * 1024, // 32MB
    disabled: uploadMutation.isPending,
  });

  return (
    <div
      {...getRootProps()}
      className={`
        relative overflow-hidden
        border-2 border-dashed rounded-lg p-8
        transition-all duration-200 cursor-pointer
        ${
          isDragActive
            ? 'border-primary bg-primary/5 scale-[1.02]'
            : 'border-border hover:border-primary/50 hover:bg-accent/50'
        }
        ${uploadMutation.isPending ? 'opacity-60 cursor-not-allowed' : ''}
      `}
    >
      <input {...getInputProps()} />

      <div className="flex flex-col items-center justify-center gap-4 text-center">
        {uploadMutation.isPending ? (
          <>
            <div className="relative">
              <div className="animate-spin rounded-full h-14 w-14 border-4 border-primary/20 border-t-primary" />
              <Sparkles className="absolute inset-0 m-auto h-6 w-6 text-primary animate-pulse" />
            </div>
            <div>
              <p className="font-medium text-foreground">Processing Upload...</p>
              <p className="text-sm text-muted-foreground mt-1">AI validation in progress</p>
            </div>
          </>
        ) : (
          <>
            <div
              className={`
              flex size-14 items-center justify-center rounded-full
              transition-all duration-200
              ${isDragActive ? 'bg-primary/20 scale-110' : 'bg-primary/10'}
            `}
            >
              {isDragActive ? (
                <Upload className="h-7 w-7 text-primary" />
              ) : (
                <FileText className="h-7 w-7 text-primary" />
              )}
            </div>

            <div className="space-y-2">
              <p className="font-semibold text-foreground">
                {isDragActive ? 'Drop your invoice here' : 'Upload Invoice'}
              </p>
              <p className="text-sm text-muted-foreground">Drag & drop or click to select</p>
              <p className="text-xs text-muted-foreground">PDF only • Max 32MB</p>
            </div>

            {/* Feature highlights */}
            <div className="flex items-center gap-2 pt-2">
              <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                <CheckCircle2 className="h-3.5 w-3.5 text-green-600" />
                <span>AI Validation</span>
              </div>
              <span className="text-muted-foreground">•</span>
              <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                <CheckCircle2 className="h-3.5 w-3.5 text-green-600" />
                <span>NDIS Compliant</span>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
