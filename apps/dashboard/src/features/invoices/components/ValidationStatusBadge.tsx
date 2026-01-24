/**
 * Validation Status Badge
 * Displays AI validation status with appropriate styling
 */

import { Badge } from '@workspace/ui/components/badge';
import { CheckCircle2, XCircle, AlertTriangle, Clock } from 'lucide-react';
import type { ValidationStatus } from '../types/invoice.types';

interface ValidationStatusBadgeProps {
  status: ValidationStatus;
  showIcon?: boolean;
}

const statusConfig: Record<ValidationStatus, {
  label: string;
  className: string;
  icon: React.ComponentType<{ className?: string }>;
}> = {
  valid: {
    label: 'Valid',
    className: 'bg-green-100 text-green-800 border-green-200',
    icon: CheckCircle2,
  },
  invalid: {
    label: 'Invalid',
    className: 'bg-red-100 text-red-800 border-red-200',
    icon: XCircle,
  },
  old_pricing: {
    label: 'Old Pricing',
    className: 'bg-yellow-100 text-yellow-800 border-yellow-200',
    icon: AlertTriangle,
  },
  pending: {
    label: 'Pending',
    className: 'bg-gray-100 text-gray-800 border-gray-200',
    icon: Clock,
  },
};

export function ValidationStatusBadge({ status, showIcon = true }: ValidationStatusBadgeProps) {
  const config = statusConfig[status];
  const Icon = config.icon;

  return (
    <Badge variant="outline" className={config.className}>
      {showIcon && <Icon className="size-3 mr-1" />}
      {config.label}
    </Badge>
  );
}
