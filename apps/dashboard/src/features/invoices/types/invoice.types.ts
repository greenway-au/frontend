/**
 * Invoice/Document Types
 * Type definitions for invoice document entities
 */

import type { BaseEntity } from '@/types/common';

/** Document processing status */
export type DocumentStatus = 'pending' | 'processing' | 'completed' | 'failed';

/** Validation result from AI agent */
export interface ValidationResult {
  is_valid: boolean;
  errors?: string[];
  warnings?: string[];
  details?: Record<string, any>;
}

/** Document entity */
export interface Document extends BaseEntity {
  user_id: string;
  filename: string;
  s3_key: string;
  content_type: string;
  file_size: number;
  status: DocumentStatus;
  validation_result?: ValidationResult;
  processed_at?: string;
}

/** Upload document payload */
export interface UploadDocumentPayload {
  file: File;
}

/** Document filters */
export interface DocumentFilters {
  status?: DocumentStatus;
  page?: number;
  limit?: number;
}
