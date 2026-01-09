/**
 * Participant List
 * Grid/list view of participants with filtering
 */

import { useState } from 'react';
import { Input } from '@workspace/ui/components/input';
import { Button } from '@workspace/ui/components/button';
import { Search, LayoutGrid, List } from 'lucide-react';
import { useParticipants, usePrefetchParticipant } from '../api/participants.queries';
import { ParticipantCard } from './ParticipantCard';
import { ParticipantSkeleton } from './ParticipantSkeleton';
import { EmptyState } from '@/components/common/EmptyState';
import { ErrorFallback } from '@/components/common/ErrorFallback';
import type { ParticipantFilters, ParticipantStatus } from '../types/participant.types';

interface ParticipantListProps {
  initialFilters?: ParticipantFilters;
}

export function ParticipantList({ initialFilters = {} }: ParticipantListProps) {
  const [filters, setFilters] = useState<ParticipantFilters>(initialFilters);
  const [searchInput, setSearchInput] = useState(filters.search ?? '');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  const { data, isLoading, isError, error, refetch } = useParticipants(filters);
  const prefetchParticipant = usePrefetchParticipant();

  const handleSearch = () => {
    setFilters((prev) => ({ ...prev, search: searchInput, page: 1 }));
  };

  const handleStatusFilter = (status: ParticipantStatus | undefined) => {
    setFilters((prev) => ({ ...prev, status, page: 1 }));
  };

  if (isError) {
    return <ErrorFallback error={error} onRetry={refetch} />;
  }

  return (
    <div className="space-y-6">
      {/* Filters */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-1 gap-2">
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search participants..."
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
              className="pl-9"
            />
          </div>
          <Button onClick={handleSearch} variant="secondary">
            Search
          </Button>
        </div>

        <div className="flex items-center gap-2">
          {/* Status filters */}
          <div className="flex gap-1">
            {(['active', 'inactive', 'pending_approval'] as const).map((status) => (
              <Button
                key={status}
                variant={filters.status === status ? 'default' : 'outline'}
                size="sm"
                onClick={() =>
                  handleStatusFilter(filters.status === status ? undefined : status)
                }
              >
                {status === 'pending_approval' ? 'Pending' : status.charAt(0).toUpperCase() + status.slice(1)}
              </Button>
            ))}
          </div>

          {/* View toggle */}
          <div className="flex rounded-md border">
            <Button
              variant={viewMode === 'grid' ? 'default' : 'ghost'}
              size="sm"
              className="rounded-r-none"
              onClick={() => setViewMode('grid')}
            >
              <LayoutGrid className="size-4" />
            </Button>
            <Button
              variant={viewMode === 'list' ? 'default' : 'ghost'}
              size="sm"
              className="rounded-l-none"
              onClick={() => setViewMode('list')}
            >
              <List className="size-4" />
            </Button>
          </div>
        </div>
      </div>

      {/* Content */}
      {isLoading ? (
        <ParticipantSkeleton count={6} viewMode={viewMode} />
      ) : !data?.items.length ? (
        <EmptyState
          title="No participants found"
          description={
            filters.search || filters.status
              ? 'Try adjusting your filters'
              : 'Get started by adding your first participant'
          }
          action={
            !filters.search && !filters.status
              ? { label: 'Add Participant', href: '/participants/new' }
              : undefined
          }
        />
      ) : (
        <>
          <div
            className={
              viewMode === 'grid'
                ? 'grid gap-4 sm:grid-cols-2 lg:grid-cols-3'
                : 'space-y-3'
            }
          >
            {data.items.map((participant) => (
              <ParticipantCard
                key={participant.id}
                participant={participant}
                onMouseEnter={() => prefetchParticipant(participant.id)}
              />
            ))}
          </div>

          {/* Pagination */}
          {data.meta.totalPages > 1 && (
            <div className="flex items-center justify-between">
              <p className="text-sm text-muted-foreground">
                Showing {data.items.length} of {data.meta.total} participants
              </p>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  disabled={!data.meta.page || data.meta.page <= 1}
                  onClick={() =>
                    setFilters((prev) => ({ ...prev, page: (prev.page ?? 1) - 1 }))
                  }
                >
                  Previous
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  disabled={data.meta.page >= data.meta.totalPages}
                  onClick={() =>
                    setFilters((prev) => ({ ...prev, page: (prev.page ?? 1) + 1 }))
                  }
                >
                  Next
                </Button>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}
