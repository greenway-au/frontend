/**
 * NDIS Plan List Component
 * Displays a list of NDIS plans
 */

import { FileText, Loader2 } from 'lucide-react';
import { NDISPlanCard } from './NDISPlanCard';
import type { NDISPlan } from '../types/ndis-plan.types';

interface NDISPlanListProps {
  plans: NDISPlan[];
  isLoading?: boolean;
  onEdit?: (plan: NDISPlan) => void;
  onDelete?: (id: string) => void;
  onDownload?: (plan: NDISPlan) => void;
  showActions?: boolean;
  emptyMessage?: string;
}

export function NDISPlanList({
  plans,
  isLoading,
  onEdit,
  onDelete,
  onDownload,
  showActions = true,
  emptyMessage = 'No NDIS plans found',
}: NDISPlanListProps) {
  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (plans.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-center">
        <div className="flex size-16 items-center justify-center rounded-full bg-muted mb-4">
          <FileText className="h-8 w-8 text-muted-foreground" />
        </div>
        <p className="text-muted-foreground">{emptyMessage}</p>
      </div>
    );
  }

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      {plans.map((plan) => (
        <NDISPlanCard
          key={plan.id}
          plan={plan}
          onEdit={onEdit}
          onDelete={onDelete}
          onDownload={onDownload}
          showActions={showActions}
        />
      ))}
    </div>
  );
}
