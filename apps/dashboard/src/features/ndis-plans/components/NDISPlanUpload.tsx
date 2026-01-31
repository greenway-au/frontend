/**
 * NDIS Plan Upload Component
 * Dropzone for uploading NDIS plan PDFs
 */

import { useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { Upload, FileText, CheckCircle2, FileSearch } from 'lucide-react';
import { useUploadNDISPlan } from '../api/ndis-plans.queries';
import { useToast } from '@/hooks/use-toast';

interface NDISPlanUploadProps {
  participantId: string;
  onSuccess?: () => void;
}

export function NDISPlanUpload({ participantId, onSuccess }: NDISPlanUploadProps) {
  const { toast } = useToast();
  const uploadMutation = useUploadNDISPlan();

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
          { file, participant_id: participantId },
          {
            onSuccess: () => {
              toast({
                title: 'Plan Uploaded',
                description: `${file.name} has been uploaded successfully`,
              });
              onSuccess?.();
            },
            onError: (error: any) => {
              toast({
                title: 'Upload Failed',
                description: error?.message || 'Failed to upload NDIS plan',
                variant: 'error',
              });
            },
          },
        );
      }
    },
    [uploadMutation, participantId, toast, onSuccess],
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'application/pdf': ['.pdf'],
    },
    maxFiles: 1,
    maxSize: 32 * 1024 * 1024,
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
              <FileSearch className="absolute inset-0 m-auto h-6 w-6 text-primary animate-pulse" />
            </div>
            <div>
              <p className="font-medium text-foreground">Uploading Plan...</p>
              <p className="text-sm text-muted-foreground mt-1">Please wait</p>
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
                {isDragActive ? 'Drop your plan here' : 'Upload NDIS Plan'}
              </p>
              <p className="text-sm text-muted-foreground">Drag & drop or click to select</p>
              <p className="text-xs text-muted-foreground">PDF only • Max 32MB</p>
            </div>

            <div className="flex items-center gap-2 pt-2">
              <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                <CheckCircle2 className="h-3.5 w-3.5 text-green-600" />
                <span>Secure Upload</span>
              </div>
              <span className="text-muted-foreground">•</span>
              <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                <CheckCircle2 className="h-3.5 w-3.5 text-green-600" />
                <span>Enter Budget Later</span>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
