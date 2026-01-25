/**
 * Invoice Status Badge
 * Displays invoice status with appropriate styling
 */

import { Badge } from '@workspace/ui/components/badge';
import { Clock, CheckCircle2, DollarSign, XCircle } from 'lucide-react';
import type { InvoiceStatus } from '../types/invoice.types';

interface InvoiceStatusBadgeProps {
  status: InvoiceStatus;
  showIcon?: boolean;
}

const statusConfig: Record<InvoiceStatus, {
  label: string;
  variant: 'default' | 'secondary' | 'destructive' | 'outline';
  className: string;
  icon: React.ComponentType<{ className?: string }>;
}> = {
  pending: {
    label: 'Pending',
    variant: 'secondary',
    className: 'bg-yellow-100 text-yellow-800 border-yellow-200',
    icon: Clock,
  },
  approved: {
    label: 'Approved',
    variant: 'default',
    className: 'bg-green-100 text-green-800 border-green-200',
    icon: CheckCircle2,
  },
  paid: {
    label: 'Paid',
    variant: 'default',
    className: 'bg-blue-100 text-blue-800 border-blue-200',
    icon: DollarSign,
  },
  rejected: {
    label: 'Rejected',
    variant: 'destructive',
    className: 'bg-red-100 text-red-800 border-red-200',
    icon: XCircle,
  },
};

export function InvoiceStatusBadge({ status, showIcon = true }: InvoiceStatusBadgeProps) {
  const config = statusConfig[status];
  const Icon = config.icon;

  return (
    <Badge variant="outline" className={config.className}>
      {showIcon && <Icon className="size-3 mr-1" />}
      {config.label}
    </Badge>
  );
}
