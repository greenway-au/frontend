/**
 * Dashboard Filters Component
 * Filter controls for coordinator dashboard
 */

import { useState } from 'react';
import { Filter, Users, Calendar, Tags } from 'lucide-react';
import { Button } from '@workspace/ui/components/button';
import { Label } from '@workspace/ui/components/label';
import { Input } from '@workspace/ui/components/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@workspace/ui/components/select';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@workspace/ui/components/card';
import type { DashboardFilters as Filters } from '../types/dashboard.types';

interface DashboardFiltersProps {
  filters: Filters;
  onFiltersChange: (filters: Filters) => void;
  participants?: Array<{ id: string; full_name?: string; ndis_number?: string }>;
  participantsLoading?: boolean;
}

export function DashboardFilters({
  filters,
  onFiltersChange,
  participants = [],
  participantsLoading = false,
}: DashboardFiltersProps) {
  const [localFilters, setLocalFilters] = useState<Filters>(filters);

  const handleApply = () => {
    onFiltersChange(localFilters);
  };

  const handleReset = () => {
    const resetFilters: Filters = {
      participant_id: undefined,
      start_date: undefined,
      end_date: undefined,
      support_category: undefined,
    };
    setLocalFilters(resetFilters);
    onFiltersChange(resetFilters);
  };

  const hasActiveFilters =
    localFilters.participant_id ||
    localFilters.start_date ||
    localFilters.end_date ||
    localFilters.support_category;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Filter className="size-5" />
          Filters
        </CardTitle>
        <CardDescription>Filter dashboard data by participant, date, or category</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Participant Filter */}
        <div className="space-y-2">
          <Label htmlFor="participant-filter" className="flex items-center gap-2">
            <Users className="size-4" />
            Participant
          </Label>
          <Select
            value={localFilters.participant_id || 'all'}
            onValueChange={(value) =>
              setLocalFilters((prev) => ({ ...prev, participant_id: value === 'all' ? undefined : value }))
            }
          >
            <SelectTrigger id="participant-filter">
              <SelectValue placeholder="All participants" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All participants</SelectItem>
              {participantsLoading ? (
                <SelectItem value="loading" disabled>
                  Loading...
                </SelectItem>
              ) : (
                participants.map((p) => (
                  <SelectItem key={p.id} value={p.id}>
                    {p.full_name || p.ndis_number || 'Unnamed Participant'}
                  </SelectItem>
                ))
              )}
            </SelectContent>
          </Select>
        </div>

        {/* Date Range */}
        <div className="space-y-2">
          <Label className="flex items-center gap-2">
            <Calendar className="size-4" />
            Date Range
          </Label>
          <div className="grid grid-cols-2 gap-2">
            <div className="space-y-1">
              <Label htmlFor="start-date" className="text-xs text-muted-foreground">
                From
              </Label>
              <Input
                id="start-date"
                type="date"
                value={localFilters.start_date || ''}
                onChange={(e) =>
                  setLocalFilters((prev) => ({ ...prev, start_date: e.target.value || undefined }))
                }
              />
            </div>
            <div className="space-y-1">
              <Label htmlFor="end-date" className="text-xs text-muted-foreground">
                To
              </Label>
              <Input
                id="end-date"
                type="date"
                value={localFilters.end_date || ''}
                onChange={(e) =>
                  setLocalFilters((prev) => ({ ...prev, end_date: e.target.value || undefined }))
                }
              />
            </div>
          </div>
        </div>

        {/* Support Category */}
        <div className="space-y-2">
          <Label htmlFor="category-filter" className="flex items-center gap-2">
            <Tags className="size-4" />
            Support Category
          </Label>
          <Select
            value={localFilters.support_category || 'all'}
            onValueChange={(value) =>
              setLocalFilters((prev) => ({ ...prev, support_category: value === 'all' ? undefined : value }))
            }
          >
            <SelectTrigger id="category-filter">
              <SelectValue placeholder="All categories" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All categories</SelectItem>
              <SelectItem value="core_supports">Core Supports</SelectItem>
              <SelectItem value="capital_supports">Capital Supports</SelectItem>
              <SelectItem value="capacity_building">Capacity Building</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Actions */}
        <div className="flex gap-2 pt-2">
          <Button onClick={handleApply} className="flex-1">
            Apply Filters
          </Button>
          {hasActiveFilters && (
            <Button variant="outline" onClick={handleReset}>
              Reset
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
