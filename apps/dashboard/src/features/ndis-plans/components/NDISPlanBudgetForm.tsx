/**
 * NDIS Plan Budget Form Component
 * Form for entering/editing plan budget breakdown
 */

import { useState, useEffect } from 'react';
import { DollarSign, Calendar, Hash } from 'lucide-react';
import { Button } from '@workspace/ui/components/button';
import { Input } from '@workspace/ui/components/input';
import { Label } from '@workspace/ui/components/label';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@workspace/ui/components/dialog';
import { useUpdatePlanBudget } from '../api/ndis-plans.queries';
import { useToast } from '@/hooks/use-toast';
import type { NDISPlan, UpdateBudgetPayload } from '../types/ndis-plan.types';

interface NDISPlanBudgetFormProps {
  plan: NDISPlan | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function NDISPlanBudgetForm({
  plan,
  open,
  onOpenChange,
}: NDISPlanBudgetFormProps) {
  const { toast } = useToast();
  const updateMutation = useUpdatePlanBudget();

  const [formData, setFormData] = useState<UpdateBudgetPayload>({
    plan_number: '',
    start_date: '',
    end_date: '',
    core_supports_budget: 0,
    capital_supports_budget: 0,
    capacity_building_budget: 0,
  });

  useEffect(() => {
    if (plan) {
      setFormData({
        plan_number: plan.plan_number || '',
        start_date: plan.start_date?.split('T')[0] || '',
        end_date: plan.end_date?.split('T')[0] || '',
        core_supports_budget: plan.budget.core_supports,
        capital_supports_budget: plan.budget.capital_supports,
        capacity_building_budget: plan.budget.capacity_building,
      });
    }
  }, [plan]);

  const totalBudget =
    formData.core_supports_budget +
    formData.capital_supports_budget +
    formData.capacity_building_budget;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!plan) return;

    updateMutation.mutate(
      { id: plan.id, data: formData },
      {
        onSuccess: () => {
          toast({
            title: 'Budget Updated',
            description: 'Plan budget has been updated successfully',
          });
          onOpenChange(false);
        },
        onError: (error: any) => {
          toast({
            title: 'Update Failed',
            description: error?.message || 'Failed to update budget',
            variant: 'error',
          });
        },
      },
    );
  };

  const handleNumberChange = (field: keyof UpdateBudgetPayload) => (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const value = parseFloat(e.target.value) || 0;
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleTextChange = (field: keyof UpdateBudgetPayload) => (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    setFormData((prev) => ({ ...prev, [field]: e.target.value }));
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Update Plan Budget</DialogTitle>
          <DialogDescription>
            Enter the budget breakdown from the NDIS plan document.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Plan Number */}
          <div className="space-y-2">
            <Label htmlFor="plan_number" className="flex items-center gap-2">
              <Hash className="h-4 w-4" />
              Plan Number
            </Label>
            <Input
              id="plan_number"
              value={formData.plan_number}
              onChange={handleTextChange('plan_number')}
              placeholder="e.g., NDIS-123456"
            />
          </div>

          {/* Date Range */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="start_date" className="flex items-center gap-2">
                <Calendar className="h-4 w-4" />
                Start Date
              </Label>
              <Input
                id="start_date"
                type="date"
                value={formData.start_date}
                onChange={handleTextChange('start_date')}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="end_date" className="flex items-center gap-2">
                <Calendar className="h-4 w-4" />
                End Date
              </Label>
              <Input
                id="end_date"
                type="date"
                value={formData.end_date}
                onChange={handleTextChange('end_date')}
              />
            </div>
          </div>

          {/* Budget Breakdown */}
          <div className="space-y-4">
            <h4 className="font-medium flex items-center gap-2">
              <DollarSign className="h-4 w-4" />
              Budget Breakdown
            </h4>

            <div className="space-y-3">
              <div className="space-y-2">
                <Label htmlFor="core_supports">Core Supports</Label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                    $
                  </span>
                  <Input
                    id="core_supports"
                    type="number"
                    min="0"
                    step="0.01"
                    value={formData.core_supports_budget || ''}
                    onChange={handleNumberChange('core_supports_budget')}
                    className="pl-7"
                    placeholder="0.00"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="capital_supports">Capital Supports</Label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                    $
                  </span>
                  <Input
                    id="capital_supports"
                    type="number"
                    min="0"
                    step="0.01"
                    value={formData.capital_supports_budget || ''}
                    onChange={handleNumberChange('capital_supports_budget')}
                    className="pl-7"
                    placeholder="0.00"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="capacity_building">Capacity Building</Label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                    $
                  </span>
                  <Input
                    id="capacity_building"
                    type="number"
                    min="0"
                    step="0.01"
                    value={formData.capacity_building_budget || ''}
                    onChange={handleNumberChange('capacity_building_budget')}
                    className="pl-7"
                    placeholder="0.00"
                  />
                </div>
              </div>
            </div>

            {/* Total */}
            <div className="flex justify-between items-center pt-3 border-t">
              <span className="font-medium">Total Budget</span>
              <span className="text-xl font-semibold text-primary">
                ${totalBudget.toLocaleString('en-AU', { minimumFractionDigits: 2 })}
              </span>
            </div>
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={updateMutation.isPending}>
              {updateMutation.isPending ? 'Saving...' : 'Save Budget'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
