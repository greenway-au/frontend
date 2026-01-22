/**
 * Invoice/Document Types
 * Type definitions for invoice document entities
 */

import type { BaseEntity } from '@/types/common';

/** Document processing status */
export type DocumentStatus = 'pending' | 'processing' | 'completed' | 'failed';

/** Validation status of the invoice */
export type ValidationStatus = 'valid' | 'invalid' | 'old_pricing';

/** Check status for individual items */
export type CheckStatus = 'valid' | 'invalid' | 'not_found' | 'old_pricing';

/** Individual item check result */
export interface CheckResult {
  item_code: string;
  status: CheckStatus;
  message: string;
}

/** Validation result from AI agent */
export interface ValidationResult {
  status: ValidationStatus;
  reason: string;
  checks?: CheckResult[];
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

/** Documents list response from API */
export interface DocumentsListResponse {
  documents: Document[];
  total: number;
  offset: number;
  limit: number;
}
