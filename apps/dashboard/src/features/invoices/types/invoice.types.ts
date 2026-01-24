/**
 * Invoice/Document Types
 * Type definitions for invoice entities
 */

/** Invoice status (lifecycle) */
export type InvoiceStatus = 'pending' | 'approved' | 'paid' | 'rejected';

/** Validation status from AI */
export type ValidationStatus = 'valid' | 'invalid' | 'old_pricing' | 'pending';

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

/** Invoice metadata (flexible JSONB field) */
export interface InvoiceMetadata {
  [key: string]: unknown;
  invoice_number?: string;
  invoice_date?: string;
  due_date?: string;
  amount?: number;
  description?: string;
  line_items?: Array<{
    item_code?: string;
    description?: string;
    quantity?: number;
    unit_price?: number;
    total?: number;
  }>;
}

/** Invoice entity (matches backend) */
export interface Invoice {
  id: string;
  provider_id: string;
  participant_id: string;
  document_id?: string | null;
  metadata: InvoiceMetadata;
  status: InvoiceStatus;
  validation_result?: ValidationResult | null;
  validated_at?: string | null;
  created_at: string;
  updated_at: string;
  // Populated from joins (optional)
  provider_name?: string;
  participant_name?: string;
}

/** Create invoice payload */
export interface CreateInvoicePayload {
  provider_id: string;
  participant_id: string;
  document_id?: string;
  metadata: InvoiceMetadata;
}

/** Update invoice status payload (admin only) */
export interface UpdateInvoiceStatusPayload {
  status: InvoiceStatus;
}

/** Invoice filters */
export interface InvoiceFilters {
  provider_id?: string;
  participant_id?: string;
  status?: InvoiceStatus;
  limit?: number;
  offset?: number;
}

/** Invoices list response */
export interface InvoicesListResponse {
  invoices: Invoice[];
  total: number;
  limit: number;
  offset: number;
}

// ============================================
// Legacy Document types (for document uploads)
// ============================================

/** Document processing status */
export type DocumentStatus = 'pending' | 'processing' | 'completed' | 'failed';

/** Document entity (for file uploads) */
export interface Document {
  id: string;
  user_id: string;
  filename: string;
  s3_key: string;
  content_type: string;
  file_size: number;
  status: DocumentStatus;
  validation_result?: ValidationResult;
  processed_at?: string;
  created_at: string;
  updated_at: string;
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
