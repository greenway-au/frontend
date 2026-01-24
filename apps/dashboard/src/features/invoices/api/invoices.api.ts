/**
 * Invoices API
 * API calls for invoice and document endpoints
 */

import { api } from '@/lib/api';
import type {
  Document,
  DocumentFilters,
  UploadDocumentPayload,
  DocumentsListResponse,
  Invoice,
  InvoiceFilters,
  InvoicesListResponse,
  CreateInvoicePayload,
  UpdateInvoiceStatusPayload,
} from '../types/invoice.types';

const DOCUMENTS_PATH = '/api/v1/documents';
const INVOICES_PATH = '/api/v1/invoices';

// ============================================
// Invoice API (new invoice model)
// ============================================

export const invoiceApi = {
  /** Get list of invoices with optional filtering */
  list: (filters: InvoiceFilters = {}): Promise<InvoicesListResponse> => {
    return api.get<InvoicesListResponse>(INVOICES_PATH, {
      params: {
        provider_id: filters.provider_id,
        participant_id: filters.participant_id,
        status: filters.status,
        limit: filters.limit,
        offset: filters.offset,
      },
    });
  },

  /** Get single invoice by ID */
  get: (id: string): Promise<Invoice> => {
    return api.get<Invoice>(`${INVOICES_PATH}/${id}`);
  },

  /** Create new invoice */
  create: (data: CreateInvoicePayload): Promise<Invoice> => {
    return api.post<Invoice>(INVOICES_PATH, data);
  },

  /** Update invoice status (admin only) */
  updateStatus: (id: string, data: UpdateInvoiceStatusPayload): Promise<Invoice> => {
    return api.patch<Invoice>(`${INVOICES_PATH}/${id}/status`, data);
  },

  /** Trigger revalidation of invoice (admin only) */
  revalidate: (id: string): Promise<Invoice> => {
    return api.post<Invoice>(`${INVOICES_PATH}/${id}/revalidate`, {});
  },

  /** Delete invoice */
  delete: (id: string): Promise<void> => {
    return api.delete(`${INVOICES_PATH}/${id}`);
  },
} as const;

// ============================================
// Document API (legacy document uploads)
// ============================================

export const invoicesApi = {
  /** Upload a document */
  upload: (payload: UploadDocumentPayload): Promise<Document> => {
    const formData = new FormData();
    formData.append('file', payload.file);

    // Note: Don't set Content-Type header - browser will set it with boundary
    return api.post<Document>(`${DOCUMENTS_PATH}/upload`, formData);
  },

  /** Get list of documents */
  list: (filters: DocumentFilters = {}): Promise<DocumentsListResponse> => {
    return api.get<DocumentsListResponse>(DOCUMENTS_PATH, {
      params: {
        status: filters.status,
        page: filters.page,
        limit: filters.limit,
      },
    });
  },

  /** Get single document by ID */
  get: (id: string): Promise<Document> => {
    return api.get<Document>(`${DOCUMENTS_PATH}/${id}`);
  },

  /** Delete document */
  delete: (id: string): Promise<void> => {
    return api.delete(`${DOCUMENTS_PATH}/${id}`);
  },
} as const;
