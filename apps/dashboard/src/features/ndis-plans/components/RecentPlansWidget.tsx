/**
 * Recent Plans Widget Component
 * Dashboard widget for coordinators to see recent NDIS plan uploads
 */

import { FileText, ChevronRight } from 'lucide-react';
import { Link } from '@tanstack/react-router';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@workspace/ui/components/card';
import { Button } from '@workspace/ui/components/button';
import { Badge } from '@workspace/ui/components/badge';
import { useNDISPlans } from '../api/ndis-plans.queries';

interface RecentPlansWidgetProps {
  /** Optional participant filter */
  participantId?: string;
  /** Number of plans to display (default: 3) */
  limit?: number;
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
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(0)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

const statusStyles: Record<string, string> = {
  active: 'bg-green-100 text-green-800 border-green-200',
  inactive: 'bg-gray-100 text-gray-800 border-gray-200',
  expired: 'bg-red-100 text-red-800 border-red-200',
};

export function RecentPlansWidget({
  participantId,
  limit = 3,
}: RecentPlansWidgetProps) {
  const { data: plansData, isLoading } = useNDISPlans({
    participant_id: participantId,
    limit,
  });

  const plans = plansData?.plans || [];

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
        <div>
          <CardTitle>Recent NDIS Plans</CardTitle>
          <CardDescription className="mt-1.5">
            Latest plan uploads{participantId ? ' for selected participant' : ''}
          </CardDescription>
        </div>
        <Button variant="ghost" size="sm" asChild>
          <Link to="/plans">
            View All
            <ChevronRight className="h-4 w-4 ml-1" />
          </Link>
        </Button>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="flex items-center justify-center py-8">
            <div className="size-6 border-2 border-primary border-t-transparent rounded-full animate-spin" />
          </div>
        ) : plans.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-8 text-center">
            <div className="flex size-12 items-center justify-center rounded-full bg-muted mb-3">
              <FileText className="h-6 w-6 text-muted-foreground" />
            </div>
            <p className="text-sm text-muted-foreground">
              {participantId
                ? 'No plans uploaded for this participant'
                : 'No recent plans'}
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {plans.map((plan) => (
              <div
                key={plan.id}
                className="flex items-start gap-3 p-3 rounded-lg border bg-card hover:bg-accent/50 transition-colors"
              >
                <div className="flex size-10 items-center justify-center rounded-md bg-primary/10 shrink-0">
                  <FileText className="h-5 w-5 text-primary" />
                </div>
                <div className="flex-1 min-w-0 space-y-1">
                  <div className="flex items-center gap-2">
                    <p className="text-sm font-medium truncate">
                      {plan.plan_number || 'NDIS Plan'}
                    </p>
                    <Badge
                      className={`${statusStyles[plan.status] || statusStyles.inactive} shrink-0`}
                      variant="outline"
                    >
                      {plan.status}
                    </Badge>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    {plan.filename} • {formatFileSize(plan.file_size)}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {formatDate(plan.start_date)} - {formatDate(plan.end_date)}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
