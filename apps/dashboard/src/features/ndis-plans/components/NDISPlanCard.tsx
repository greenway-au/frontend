/**
 * NDIS Plan Card Component
 * Displays a single NDIS plan with budget info
 */

import { FileText, Calendar, DollarSign, Trash2, Edit, Download } from 'lucide-react';
import { Button } from '@workspace/ui/components/button';
import { Badge } from '@workspace/ui/components/badge';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@workspace/ui/components/card';
import type { NDISPlan } from '../types/ndis-plan.types';

interface NDISPlanCardProps {
  plan: NDISPlan;
  onEdit?: (plan: NDISPlan) => void;
  onDelete?: (id: string) => void;
  onDownload?: (plan: NDISPlan) => void;
  showActions?: boolean;
}

function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('en-AU', {
    style: 'currency',
    currency: 'AUD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
}

function formatDate(dateStr: string | undefined): string {
  if (!dateStr) return 'Not set';
  return new Date(dateStr).toLocaleDateString('en-AU', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });
}

function formatFileSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

const statusStyles: Record<string, string> = {
  active: 'bg-green-100 text-green-800 border-green-200',
  inactive: 'bg-gray-100 text-gray-800 border-gray-200',
  expired: 'bg-red-100 text-red-800 border-red-200',
};

export function NDISPlanCard({
  plan,
  onEdit,
  onDelete,
  onDownload,
  showActions = true,
}: NDISPlanCardProps) {
  const hasBudget = plan.total_budget > 0;

  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div className="flex size-10 items-center justify-center rounded-lg bg-primary/10">
              <FileText className="h-5 w-5 text-primary" />
            </div>
            <div>
              <CardTitle className="text-base font-medium">
                {plan.plan_number || 'NDIS Plan'}
              </CardTitle>
              <CardDescription className="text-sm">
                {plan.filename} • {formatFileSize(plan.file_size)}
              </CardDescription>
            </div>
          </div>
          <Badge className={statusStyles[plan.status] || statusStyles.inactive}>
            {plan.status}
          </Badge>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Date Range */}
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Calendar className="h-4 w-4" />
          <span>
            {formatDate(plan.start_date)} - {formatDate(plan.end_date)}
          </span>
        </div>

        {/* Budget Breakdown */}
        {hasBudget ? (
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Total Budget</span>
              <span className="text-lg font-semibold text-primary">
                {formatCurrency(plan.total_budget)}
              </span>
            </div>

            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Core Supports</span>
                <span>{formatCurrency(plan.budget.core_supports)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Capital Supports</span>
                <span>{formatCurrency(plan.budget.capital_supports)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Capacity Building</span>
                <span>{formatCurrency(plan.budget.capacity_building)}</span>
              </div>
            </div>
          </div>
        ) : (
          <div className="flex items-center gap-2 text-sm text-amber-600 bg-amber-50 rounded-md p-3">
            <DollarSign className="h-4 w-4" />
            <span>Budget not entered yet</span>
          </div>
        )}

        {/* Actions */}
        {showActions && (
          <div className="flex gap-2 pt-2">
            {onDownload && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => onDownload(plan)}
                className="flex-1"
              >
                <Download className="h-4 w-4 mr-1" />
                Download PDF
              </Button>
            )}
            {onEdit && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => onEdit(plan)}
                className="flex-1"
              >
                <Edit className="h-4 w-4 mr-1" />
                {hasBudget ? 'Edit Budget' : 'Enter Budget'}
              </Button>
            )}
            {onDelete && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => onDelete(plan.id)}
                className="text-destructive hover:text-destructive"
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
