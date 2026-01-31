/**
 * Active Plan Widget Component
 * Dashboard widget for participants to see their active NDIS plan
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
import { NDISPlanCard } from './NDISPlanCard';
import { useNDISPlans, useDownloadNDISPlan } from '../api/ndis-plans.queries';
import type { NDISPlan } from '../types/ndis-plan.types';
import { useToast } from '@/hooks/use-toast';

interface ActivePlanWidgetProps {
  /** Participant ID to fetch plan for */
  participantId: string;
}

export function ActivePlanWidget({ participantId }: ActivePlanWidgetProps) {
  const { toast } = useToast();

  // Fetch active plan
  const { data: plansData, isLoading } = useNDISPlans({
    participant_id: participantId,
    status: 'active',
    limit: 1,
  });

  const downloadMutation = useDownloadNDISPlan();

  const activePlan = plansData?.plans?.[0];

  const handleDownload = (plan: NDISPlan) => {
    downloadMutation.mutate(plan, {
      onError: (error: any) => {
        toast({
          title: 'Download Failed',
          description: error?.message || 'Failed to download plan',
          variant: 'error',
        });
      },
    });
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
        <div>
          <CardTitle>Your NDIS Plan</CardTitle>
          <CardDescription className="mt-1.5">
            Your current active plan details
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
        ) : activePlan ? (
          <NDISPlanCard
            plan={activePlan}
            onDownload={handleDownload}
            showActions
          />
        ) : (
          <div className="flex flex-col items-center justify-center py-8 text-center">
            <div className="flex size-12 items-center justify-center rounded-full bg-muted mb-3">
              <FileText className="h-6 w-6 text-muted-foreground" />
            </div>
            <p className="text-sm text-muted-foreground mb-4">
              No active NDIS plan found
            </p>
            <Button variant="outline" size="sm" asChild>
              <Link to="/plans">
                View All Plans
                <ChevronRight className="h-4 w-4 ml-1" />
              </Link>
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
