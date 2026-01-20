/**
 * Invoice Upload Component
 * Dropzone for uploading PDF invoices
 */

import { useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { Upload, FileText, AlertCircle } from 'lucide-react';
import { Card } from '@workspace/ui/components/card';
import { Alert, AlertDescription } from '@workspace/ui/components/alert';
import { useUploadDocument } from '../api/invoices.queries';
import { useToast } from '@/hooks/use-toast';

export function InvoiceUpload() {
  const { toast } = useToast();
  const uploadMutation = useUploadDocument();

  const onDrop = useCallback(
    (acceptedFiles: File[], rejectedFiles: any[]) => {
      // Handle rejected files
      if (rejectedFiles.length > 0) {
        const errors = rejectedFiles.map((f) => f.errors.map((e: any) => e.message).join(', '));
        toast({
          title: 'Upload Failed',
          description: `Invalid files: ${errors.join(', ')}`,
          variant: 'destructive',
        });
        return;
      }

      // Upload the first file
      if (acceptedFiles.length > 0) {
        const file = acceptedFiles[0];
        uploadMutation.mutate(
          { file },
          {
            onSuccess: () => {
              toast({
                title: 'Upload Successful',
                description: `${file.name} has been uploaded and is being processed.`,
              });
            },
            onError: (error: any) => {
              toast({
                title: 'Upload Failed',
                description: error?.message || 'Failed to upload document',
                variant: 'destructive',
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
    <div className="space-y-4">
      <Card
        {...getRootProps()}
        className={`
          border-2 border-dashed p-8 transition-colors cursor-pointer
          ${isDragActive ? 'border-blue-500 bg-blue-50' : 'border-gray-300 hover:border-gray-400'}
          ${uploadMutation.isPending ? 'opacity-50 cursor-not-allowed' : ''}
        `}
      >
        <input {...getInputProps()} />
        <div className="flex flex-col items-center justify-center gap-4 text-center">
          {uploadMutation.isPending ? (
            <>
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500" />
              <p className="text-sm text-gray-600">Uploading...</p>
            </>
          ) : (
            <>
              {isDragActive ? (
                <Upload className="h-12 w-12 text-blue-500" />
              ) : (
                <FileText className="h-12 w-12 text-gray-400" />
              )}
              <div>
                <p className="text-lg font-medium text-gray-900">
                  {isDragActive ? 'Drop your PDF here' : 'Upload Invoice PDF'}
                </p>
                <p className="text-sm text-gray-500 mt-1">Drag and drop or click to select a PDF file (max 32MB)</p>
              </div>
            </>
          )}
        </div>
      </Card>

      {uploadMutation.isError && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>Failed to upload document. Please try again.</AlertDescription>
        </Alert>
      )}
    </div>
  );
}
