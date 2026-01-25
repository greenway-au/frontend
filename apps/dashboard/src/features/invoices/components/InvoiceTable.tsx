/**
 * Invoice Table
 * Table view for invoices with role-based columns and actions
 */

import { useAtomValue } from 'jotai';
import { userAtom } from '@/stores/auth';
import { Card, CardContent } from '@workspace/ui/components/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@workspace/ui/components/table';
import { FileText } from 'lucide-react';
import { InvoiceStatusBadge } from './InvoiceStatusBadge';
import { InvoiceActions } from './InvoiceActions';
import { ValidationStatusBadge } from './ValidationStatusBadge';
import type { Invoice } from '../types/invoice.types';
import { formatDistanceToNow } from 'date-fns';

interface InvoiceTableProps {
  invoices: Invoice[];
  isLoading?: boolean;
}

export function InvoiceTable({ invoices, isLoading }: InvoiceTableProps) {
  const user = useAtomValue(userAtom);
  const isAdmin = user?.userType === 'admin';
  const isProvider = user?.userType === 'provider';
  const isClient = user?.userType === 'client';

  if (isLoading) {
    return (
      <Card>
        <CardContent className="py-12">
          <div className="flex flex-col items-center justify-center text-center">
            <div className="size-8 border-2 border-primary border-t-transparent rounded-full animate-spin mb-4" />
            <p className="text-sm text-muted-foreground">Loading invoices...</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!invoices?.length) {
    return (
      <Card>
        <CardContent className="py-12">
          <div className="flex flex-col items-center justify-center text-center">
            <div className="flex size-12 items-center justify-center rounded-full bg-muted mb-4">
              <FileText className="size-6 text-muted-foreground" />
            </div>
            <p className="text-sm font-medium text-muted-foreground">No invoices found</p>
            <p className="text-xs text-muted-foreground mt-1">
              {isProvider
                ? 'Create your first invoice to get started'
                : isClient
                  ? 'Invoices from your providers will appear here'
                  : 'Invoices will appear here once created'}
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardContent className="p-0">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Invoice</TableHead>
              {/* Show provider column for admins and clients */}
              {(isAdmin || isClient) && <TableHead>Provider</TableHead>}
              {/* Show participant column for admins and providers */}
              {(isAdmin || isProvider) && <TableHead>Participant</TableHead>}
              <TableHead>Amount</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Validation</TableHead>
              <TableHead>Created</TableHead>
              {isAdmin && <TableHead className="text-right">Actions</TableHead>}
            </TableRow>
          </TableHeader>
          <TableBody>
            {invoices.map((invoice) => (
              <TableRow key={invoice.id}>
                <TableCell>
                  <div className="flex flex-col">
                    <span className="font-medium">
                      {invoice.metadata?.invoice_number || `INV-${invoice.id.slice(0, 8)}`}
                    </span>
                    {invoice.metadata?.description && (
                      <span className="text-xs text-muted-foreground truncate max-w-[200px]">
                        {invoice.metadata.description}
                      </span>
                    )}
                  </div>
                </TableCell>

                {(isAdmin || isClient) && (
                  <TableCell>
                    <span className="text-sm">
                      {invoice.provider_name || invoice.provider_id.slice(0, 8)}
                    </span>
                  </TableCell>
                )}

                {(isAdmin || isProvider) && (
                  <TableCell>
                    <span className="text-sm">
                      {invoice.participant_name || invoice.participant_id.slice(0, 8)}
                    </span>
                  </TableCell>
                )}

                <TableCell>
                  <span className="font-medium">
                    {invoice.metadata?.amount
                      ? `$${invoice.metadata.amount.toLocaleString('en-AU', {
                          minimumFractionDigits: 2,
                          maximumFractionDigits: 2,
                        })}`
                      : '-'}
                  </span>
                </TableCell>

                <TableCell>
                  <InvoiceStatusBadge status={invoice.status} />
                </TableCell>

                <TableCell>
                  {invoice.validation_result ? (
                    <ValidationStatusBadge status={invoice.validation_result.status} />
                  ) : (
                    <span className="text-xs text-muted-foreground">Not validated</span>
                  )}
                </TableCell>

                <TableCell>
                  <span className="text-sm text-muted-foreground">
                    {formatDistanceToNow(new Date(invoice.created_at), { addSuffix: true })}
                  </span>
                </TableCell>

                {isAdmin && (
                  <TableCell className="text-right">
                    <InvoiceActions invoice={invoice} />
                  </TableCell>
                )}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
