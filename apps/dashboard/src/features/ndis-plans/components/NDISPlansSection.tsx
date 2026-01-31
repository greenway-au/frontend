/**
 * NDIS Plans Section Component
 * Reusable section for displaying NDIS plans on detail pages
 * Shows plans with upload, edit, download, and delete capabilities based on permissions
 */

import { useState } from 'react';
import { Upload, FileText } from 'lucide-react';
import { Button } from '@workspace/ui/components/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@workspace/ui/components/card';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@workspace/ui/components/dialog';
import { NDISPlanCard } from './NDISPlanCard';
import { NDISPlanBudgetForm } from './NDISPlanBudgetForm';
import { NDISPlanUpload } from './NDISPlanUpload';
import {
  useNDISPlans,
  useDeleteNDISPlan,
  useDownloadNDISPlan,
} from '../api/ndis-plans.queries';
import type { NDISPlan } from '../types/ndis-plan.types';
import { useToast } from '@/hooks/use-toast';

interface NDISPlansSectionProps {
  /** Participant ID to fetch plans for */
  participantId: string;
  /** Whether user can upload plans */
  canUpload?: boolean;
  /** Whether user can edit/delete plans */
  canEdit?: boolean;
}

export function NDISPlansSection({
  participantId,
  canUpload = false,
  canEdit = false,
}: NDISPlansSectionProps) {
  const { toast } = useToast();

  // Fetch plans for this participant
  const { data: plansData, isLoading } = useNDISPlans({
    participant_id: participantId,
  });

  // Mutations
  const deleteMutation = useDeleteNDISPlan();
  const downloadMutation = useDownloadNDISPlan();

  // Dialog states
  const [isUploadOpen, setIsUploadOpen] = useState(false);
  const [editingPlan, setEditingPlan] = useState<NDISPlan | null>(null);
  const [isBudgetFormOpen, setIsBudgetFormOpen] = useState(false);

  const plans = plansData?.plans || [];

  // Handlers
  const handleEdit = (plan: NDISPlan) => {
    setEditingPlan(plan);
    setIsBudgetFormOpen(true);
  };

  const handleDelete = (id: string) => {
    if (!confirm('Are you sure you want to delete this plan?')) return;

    deleteMutation.mutate(id, {
      onSuccess: () => {
        toast({
          title: 'Plan Deleted',
          description: 'The NDIS plan has been removed',
        });
      },
      onError: (error: any) => {
        toast({
          title: 'Delete Failed',
          description: error?.message || 'Failed to delete plan',
          variant: 'error',
        });
      },
    });
  };

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
    <>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
          <div>
            <CardTitle>NDIS Plans</CardTitle>
            <CardDescription className="mt-1.5">
              Uploaded NDIS plan documents
            </CardDescription>
          </div>
          {canUpload && (
            <Button onClick={() => setIsUploadOpen(true)}>
              <Upload className="h-4 w-4 mr-2" />
              Upload Plan
            </Button>
          )}
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex items-center justify-center py-12">
              <div className="size-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
            </div>
          ) : plans.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <div className="flex size-16 items-center justify-center rounded-full bg-muted mb-4">
                <FileText className="h-8 w-8 text-muted-foreground" />
              </div>
              <p className="text-sm text-muted-foreground mb-4">
                No NDIS plans uploaded yet
              </p>
              {canUpload && (
                <Button variant="outline" onClick={() => setIsUploadOpen(true)}>
                  <Upload className="h-4 w-4 mr-2" />
                  Upload First Plan
                </Button>
              )}
            </div>
          ) : (
            <div className="grid gap-4 md:grid-cols-2">
              {plans.map((plan) => (
                <NDISPlanCard
                  key={plan.id}
                  plan={plan}
                  onEdit={canEdit ? handleEdit : undefined}
                  onDelete={canEdit ? handleDelete : undefined}
                  onDownload={handleDownload}
                  showActions
                />
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Upload Dialog */}
      <Dialog open={isUploadOpen} onOpenChange={setIsUploadOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Upload NDIS Plan</DialogTitle>
            <DialogDescription>
              Upload a new NDIS plan document (PDF format)
            </DialogDescription>
          </DialogHeader>
          <NDISPlanUpload
            participantId={participantId}
            onSuccess={() => setIsUploadOpen(false)}
          />
        </DialogContent>
      </Dialog>

      {/* Budget Edit Dialog */}
      <NDISPlanBudgetForm
        plan={editingPlan}
        open={isBudgetFormOpen}
        onOpenChange={(open) => {
          setIsBudgetFormOpen(open);
          if (!open) setEditingPlan(null);
        }}
      />
    </>
  );
}
