/**
 * NDIS Plans Route
 * Plan management page with role-based content
 * - Coordinators: View/upload/edit plans for assigned participants
 * - Participants: View their own plans
 */

import { useState } from 'react';
import { createFileRoute } from '@tanstack/react-router';
import { useAtomValue } from 'jotai';
import { userAtom } from '@/stores/auth';
import { PageHeader } from '@/components/common/PageHeader';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@workspace/ui/components/card';
import { Label } from '@workspace/ui/components/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@workspace/ui/components/select';
import { Upload, FileText, Users } from 'lucide-react';
import {
  NDISPlanUpload,
  NDISPlanList,
  NDISPlanBudgetForm,
  useNDISPlans,
  useDeleteNDISPlan,
  useDownloadNDISPlan,
  type NDISPlan,
} from '@/features/ndis-plans';
import { useMyParticipantsAsCoordinator } from '@/features/admin/api/relationships.queries';
import { useToast } from '@/hooks/use-toast';

export const Route = createFileRoute('/_dashboard/plans')({
  component: PlansPage,
});

function PlansPage() {
  const user = useAtomValue(userAtom);
  const { toast } = useToast();

  const isCoordinator = user?.userType === 'coordinator';
  const isParticipant = user?.userType === 'client';

  // For coordinators: get their assigned participants
  const { data: myParticipants, isLoading: participantsLoading } = useMyParticipantsAsCoordinator();

  // Selected participant for filtering
  const [selectedParticipantId, setSelectedParticipantId] = useState<string>('');

  // Determine which participant_id to use for fetching plans
  const participantIdForPlans = isCoordinator
    ? selectedParticipantId
    : user?.participantId || '';

  // Fetch plans
  const { data: plansData, isLoading: plansLoading } = useNDISPlans({
    participant_id: participantIdForPlans || undefined,
    limit: 50,
  });

  // Delete mutation
  const deleteMutation = useDeleteNDISPlan();

  // Download mutation
  const downloadMutation = useDownloadNDISPlan();

  // Budget form state
  const [editingPlan, setEditingPlan] = useState<NDISPlan | null>(null);
  const [budgetFormOpen, setBudgetFormOpen] = useState(false);

  const handleEdit = (plan: NDISPlan) => {
    setEditingPlan(plan);
    setBudgetFormOpen(true);
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

  const participants = myParticipants?.participants || [];
  const plans = plansData?.plans || [];

  const getPageDescription = () => {
    if (isCoordinator) return 'Upload and manage NDIS plans for your participants';
    if (isParticipant) return 'View your NDIS plan documents';
    return 'Manage NDIS plans';
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="NDIS Plans"
        description={getPageDescription()}
      />

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Left Column - Upload & Filter */}
        <div className="space-y-6">
          {/* Participant Selector (Coordinators only) */}
          {isCoordinator && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="size-5" />
                  Select Participant
                </CardTitle>
                <CardDescription>
                  Choose a participant to view or upload plans
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Label htmlFor="participant-select" className="sr-only">
                  Participant
                </Label>
                <Select
                  value={selectedParticipantId}
                  onValueChange={setSelectedParticipantId}
                >
                  <SelectTrigger id="participant-select">
                    <SelectValue placeholder="Select a participant..." />
                  </SelectTrigger>
                  <SelectContent>
                    {participantsLoading ? (
                      <SelectItem value="" disabled>
                        Loading...
                      </SelectItem>
                    ) : participants.length === 0 ? (
                      <SelectItem value="" disabled>
                        No participants assigned
                      </SelectItem>
                    ) : (
                      participants.map((p: any) => (
                        <SelectItem key={p.id} value={p.id}>
                          {p.full_name || p.ndis_number || 'Unnamed Participant'}
                        </SelectItem>
                      ))
                    )}
                  </SelectContent>
                </Select>
              </CardContent>
            </Card>
          )}

          {/* Upload Section */}
          {(isCoordinator || isParticipant) && participantIdForPlans && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Upload className="size-5" />
                  Upload Plan
                </CardTitle>
                <CardDescription>
                  Upload a new NDIS plan document (PDF)
                </CardDescription>
              </CardHeader>
              <CardContent>
                <NDISPlanUpload participantId={participantIdForPlans} />
              </CardContent>
            </Card>
          )}

          {/* No participant selected message */}
          {isCoordinator && !selectedParticipantId && (
            <Card>
              <CardContent className="py-8">
                <div className="flex flex-col items-center justify-center text-center">
                  <div className="flex size-12 items-center justify-center rounded-full bg-muted mb-3">
                    <Users className="h-6 w-6 text-muted-foreground" />
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Select a participant to view or upload plans
                  </p>
                </div>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Right Column - Plans List */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="size-5" />
                NDIS Plans
              </CardTitle>
              <CardDescription>
                {isCoordinator && selectedParticipantId
                  ? 'Plans for the selected participant'
                  : isParticipant
                    ? 'Your uploaded NDIS plans'
                    : 'Select a participant to view plans'}
              </CardDescription>
            </CardHeader>
            <CardContent>
              {!participantIdForPlans && isCoordinator ? (
                <div className="flex flex-col items-center justify-center py-12 text-center">
                  <div className="flex size-16 items-center justify-center rounded-full bg-muted mb-4">
                    <FileText className="h-8 w-8 text-muted-foreground" />
                  </div>
                  <p className="text-muted-foreground">
                    Select a participant to view their plans
                  </p>
                </div>
              ) : (
                <NDISPlanList
                  plans={plans}
                  isLoading={plansLoading}
                  onEdit={isCoordinator ? handleEdit : undefined}
                  onDelete={isCoordinator ? handleDelete : undefined}
                  onDownload={handleDownload}
                  showActions
                  emptyMessage={
                    isCoordinator
                      ? 'No plans uploaded for this participant'
                      : 'You have no NDIS plans uploaded'
                  }
                />
              )}
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Budget Edit Dialog */}
      <NDISPlanBudgetForm
        plan={editingPlan}
        open={budgetFormOpen}
        onOpenChange={(open) => {
          setBudgetFormOpen(open);
          if (!open) setEditingPlan(null);
        }}
      />
    </div>
  );
}
