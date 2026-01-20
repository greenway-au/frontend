/**
 * Invoices API
 * API calls for document/invoice endpoints
 */

import { api } from '@/lib/api';
import type { PaginatedResponse } from '@/types/api';
import type { Document, DocumentFilters, UploadDocumentPayload } from '../types/invoice.types';

const BASE_PATH = '/api/v1/documents';

export const invoicesApi = {
  /** Upload a document */
  upload: (payload: UploadDocumentPayload): Promise<Document> => {
    const formData = new FormData();
    formData.append('file', payload.file);

    // Note: Don't set Content-Type header - browser will set it with boundary
    return api.post<Document>(`${BASE_PATH}/upload`, formData);
  },

  /** Get list of documents */
  list: (filters: DocumentFilters = {}): Promise<PaginatedResponse<Document>> => {
    return api.get<PaginatedResponse<Document>>(BASE_PATH, {
      params: {
        status: filters.status,
        page: filters.page,
        limit: filters.limit,
      },
    });
  },

  /** Get single document by ID */
  get: (id: string): Promise<Document> => {
    return api.get<Document>(`${BASE_PATH}/${id}`);
  },

  /** Delete document */
  delete: (id: string): Promise<void> => {
    return api.delete(`${BASE_PATH}/${id}`);
  },
} as const;
