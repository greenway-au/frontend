/**
 * Invoice Query Hooks
 * TanStack Query hooks for invoice and document operations
 */

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useAtomValue } from 'jotai';
import { userAtom } from '@/stores/auth';
import { invoicesApi, invoiceApi } from './invoices.api';
import type {
  DocumentFilters,
  UploadDocumentPayload,
  InvoiceFilters,
  CreateInvoicePayload,
  UpdateInvoiceStatusPayload,
} from '../types/invoice.types';

// ============================================
// Invoice Query Keys & Hooks (new invoice model)
// ============================================

/** Query key factory for invoices */
export const invoiceKeys = {
  all: ['invoices'] as const,
  lists: () => [...invoiceKeys.all, 'list'] as const,
  list: (filters: InvoiceFilters) => [...invoiceKeys.lists(), filters] as const,
  details: () => [...invoiceKeys.all, 'detail'] as const,
  detail: (id: string) => [...invoiceKeys.details(), id] as const,
} as const;

/** Get list of invoices with role-based filtering */
export function useInvoices(filters: InvoiceFilters = {}) {
  const user = useAtomValue(userAtom);

  // Apply role-based filtering
  const roleFilters: InvoiceFilters = { ...filters };

  if (user?.userType === 'provider' && user.providerId) {
    // Providers only see their own invoices
    roleFilters.provider_id = user.providerId;
  } else if (user?.userType === 'client' && user.participantId) {
    // Clients only see invoices sent to them
    roleFilters.participant_id = user.participantId;
  }
  // Admins see all (no additional filter)

  return useQuery({
    queryKey: invoiceKeys.list(roleFilters),
    queryFn: () => invoiceApi.list(roleFilters),
    placeholderData: (previousData) => previousData,
  });
}

/** Get single invoice by ID */
export function useInvoice(id: string) {
  return useQuery({
    queryKey: invoiceKeys.detail(id),
    queryFn: () => invoiceApi.get(id),
    enabled: !!id,
  });
}

/** Create new invoice */
export function useCreateInvoice() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateInvoicePayload) => invoiceApi.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: invoiceKeys.lists() });
    },
  });
}

/** Update invoice status (admin only) */
export function useUpdateInvoiceStatus() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateInvoiceStatusPayload }) =>
      invoiceApi.updateStatus(id, data),
    onSuccess: (updatedInvoice) => {
      // Update the specific invoice in cache
      queryClient.setQueryData(invoiceKeys.detail(updatedInvoice.id), updatedInvoice);
      // Invalidate lists to refetch
      queryClient.invalidateQueries({ queryKey: invoiceKeys.lists() });
    },
  });
}

/** Revalidate invoice (admin only) */
export function useRevalidateInvoice() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => invoiceApi.revalidate(id),
    onSuccess: (updatedInvoice) => {
      queryClient.setQueryData(invoiceKeys.detail(updatedInvoice.id), updatedInvoice);
      queryClient.invalidateQueries({ queryKey: invoiceKeys.lists() });
    },
  });
}

/** Delete invoice */
export function useDeleteInvoice() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => invoiceApi.delete(id),
    onSuccess: (_, id) => {
      queryClient.removeQueries({ queryKey: invoiceKeys.detail(id) });
      queryClient.invalidateQueries({ queryKey: invoiceKeys.lists() });
    },
  });
}

// ============================================
// Document Query Keys & Hooks (legacy uploads)
// ============================================

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
      const hasPendingDocs = data?.documents?.some((doc) => doc.status === 'pending' || doc.status === 'processing');
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
