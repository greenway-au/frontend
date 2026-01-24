/**
 * Invoice Actions
 * Admin-only actions for managing invoice status
 */

import { useState } from 'react';
import { Button } from '@workspace/ui/components/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@workspace/ui/components/dropdown-menu';
import { MoreHorizontal, CheckCircle2, XCircle, DollarSign, RefreshCw, Loader2 } from 'lucide-react';
import { useUpdateInvoiceStatus, useRevalidateInvoice } from '../api/invoices.queries';
import type { Invoice, InvoiceStatus } from '../types/invoice.types';
import { useToast } from '@/hooks/use-toast';

interface InvoiceActionsProps {
  invoice: Invoice;
}

export function InvoiceActions({ invoice }: InvoiceActionsProps) {
  const { toast } = useToast();
  const updateStatus = useUpdateInvoiceStatus();
  const revalidate = useRevalidateInvoice();
  const [isOpen, setIsOpen] = useState(false);

  const isLoading = updateStatus.isPending || revalidate.isPending;

  const handleStatusChange = async (newStatus: InvoiceStatus) => {
    try {
      await updateStatus.mutateAsync({ id: invoice.id, data: { status: newStatus } });
      toast({
        title: 'Status Updated',
        description: `Invoice status changed to ${newStatus}`,
      });
      setIsOpen(false);
    } catch {
      toast({
        title: 'Error',
        description: 'Failed to update invoice status',
        variant: 'error',
      });
    }
  };

  const handleRevalidate = async () => {
    try {
      await revalidate.mutateAsync(invoice.id);
      toast({
        title: 'Revalidation Started',
        description: 'Invoice is being revalidated by AI',
      });
      setIsOpen(false);
    } catch {
      toast({
        title: 'Error',
        description: 'Failed to trigger revalidation',
        variant: 'error',
      });
    }
  };

  // Determine available actions based on current status
  const canApprove = invoice.status === 'pending';
  const canReject = invoice.status === 'pending' || invoice.status === 'approved';
  const canMarkPaid = invoice.status === 'approved';

  return (
    <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="sm" disabled={isLoading}>
          {isLoading ? (
            <Loader2 className="size-4 animate-spin" />
          ) : (
            <MoreHorizontal className="size-4" />
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        {canApprove && (
          <DropdownMenuItem onClick={() => handleStatusChange('approved')}>
            <CheckCircle2 className="size-4 mr-2 text-green-600" />
            Approve
          </DropdownMenuItem>
        )}
        {canMarkPaid && (
          <DropdownMenuItem onClick={() => handleStatusChange('paid')}>
            <DollarSign className="size-4 mr-2 text-blue-600" />
            Mark as Paid
          </DropdownMenuItem>
        )}
        {canReject && (
          <DropdownMenuItem onClick={() => handleStatusChange('rejected')}>
            <XCircle className="size-4 mr-2 text-red-600" />
            Reject
          </DropdownMenuItem>
        )}
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={handleRevalidate}>
          <RefreshCw className="size-4 mr-2" />
          Revalidate
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
