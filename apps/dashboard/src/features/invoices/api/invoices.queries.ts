/**
 * Invoice Query Hooks
 * TanStack Query hooks for invoice/document operations with polling
 */

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { invoicesApi } from './invoices.api';
import type {
  DocumentFilters,
  UploadDocumentPayload,
} from '../types/invoice.types';

/** Query key factory for documents */
export const documentKeys = {
  all: ['documents'] as const,
  lists: () => [...documentKeys.all, 'list'] as const,
  list: (filters: DocumentFilters) => [...documentKeys.lists(), filters] as const,
  details: () => [...documentKeys.all, 'detail'] as const,
  detail: (id: string) => [...documentKeys.details(), id] as const,
} as const;

/** Get list of documents with automatic polling for pending documents */
export function useDocuments(filters: DocumentFilters = {}) {
  return useQuery({
    queryKey: documentKeys.list(filters),
    queryFn: () => invoicesApi.list(filters),
    placeholderData: (previousData) => previousData,
    // Poll every 5 seconds to check for status updates
    refetchInterval: (query) => {
      const data = query.state.data;
      // Only poll if there are pending or processing documents
      const hasPendingDocs = data?.data?.some(
        (doc) => doc.status === 'pending' || doc.status === 'processing'
      );
      return hasPendingDocs ? 5000 : false;
    },
    refetchIntervalInBackground: false,
  });
}

/** Get single document by ID with polling for pending status */
export function useDocument(id: string) {
  return useQuery({
    queryKey: documentKeys.detail(id),
    queryFn: () => invoicesApi.get(id),
    enabled: !!id,
    // Poll every 3 seconds if document is pending or processing
    refetchInterval: (query) => {
      const status = query.state.data?.status;
      return status === 'pending' || status === 'processing' ? 3000 : false;
    },
    refetchIntervalInBackground: false,
  });
}

/** Upload new document */
export function useUploadDocument() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: UploadDocumentPayload) => invoicesApi.upload(payload),
    onSuccess: () => {
      // Invalidate all list queries to refetch
      queryClient.invalidateQueries({ queryKey: documentKeys.lists() });
    },
  });
}

/** Delete document */
export function useDeleteDocument() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => invoicesApi.delete(id),
    onSuccess: (_, id) => {
      // Remove from cache
      queryClient.removeQueries({ queryKey: documentKeys.detail(id) });
      // Invalidate lists
      queryClient.invalidateQueries({ queryKey: documentKeys.lists() });
    },
  });
}
