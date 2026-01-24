/**
 * Participant List
 * Grid/list view of participants with filtering
 */

import { useState } from 'react';
import { Link } from '@tanstack/react-router';
import { Button } from '@workspace/ui/components/button';
import { Badge } from '@workspace/ui/components/badge';
import { useParticipants } from '../api/participants.queries';
import { ParticipantSkeleton } from './ParticipantSkeleton';
import { EmptyState } from '@/components/common/EmptyState';
import { ErrorFallback } from '@/components/common/ErrorFallback';

export function ParticipantList() {
  const [params, setParams] = useState({ limit: 20, offset: 0 });

  const { data, isLoading, isError, error, refetch } = useParticipants(params);

  const handleNext = () => {
    setParams((prev) => ({ ...prev, offset: prev.offset + prev.limit }));
  };

  const handlePrevious = () => {
    setParams((prev) => ({
      ...prev,
      offset: Math.max(0, prev.offset - prev.limit),
    }));
  };

  if (isError) {
    return <ErrorFallback error={error} onRetry={refetch} />;
  }

  if (isLoading) {
    return <ParticipantSkeleton count={6} />;
  }

  if (!data || data.participants.length === 0) {
    return (
      <EmptyState
        title="No participants found"
        description="Get started by adding your first participant"
        action={{ label: 'Add Participant', href: '/participants/new' }}
      />
    );
  }

  const hasNext = data.offset + data.limit < data.total;
  const hasPrevious = data.offset > 0;

  return (
    <div className="space-y-6">
      {/* Admin notice */}
      <div className="rounded-md bg-blue-50 p-4 text-sm text-blue-800 dark:bg-blue-950 dark:text-blue-200">
        Admin-only access: Managing participants
      </div>

      {/* Table */}
      <div className="rounded-md border">
        <table className="w-full">
          <thead>
            <tr className="border-b bg-muted/50">
              <th className="p-3 text-left font-medium">Full Name</th>
              <th className="p-3 text-left font-medium">NDIS Number</th>
              <th className="p-3 text-left font-medium">Plan Dates</th>
              <th className="p-3 text-left font-medium">Funding</th>
              <th className="p-3 text-left font-medium">Status</th>
              <th className="p-3 text-left font-medium">Actions</th>
            </tr>
          </thead>
          <tbody>
            {data.participants.map((participant) => (
              <tr key={participant.id} className="border-b last:border-0">
                <td className="p-3">{participant.full_name || 'N/A'}</td>
                <td className="p-3 font-mono text-sm">{participant.ndis_number || 'N/A'}</td>
                <td className="p-3 text-sm">
                  {participant.plan_start_date && participant.plan_end_date ? (
                    <>
                      {participant.plan_start_date} to {participant.plan_end_date}
                    </>
                  ) : (
                    'N/A'
                  )}
                </td>
                <td className="p-3">
                  {participant.starting_funding_amount != null
                    ? `$${participant.starting_funding_amount.toLocaleString('en-AU', {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2,
                      })}`
                    : 'N/A'}
                </td>
                <td className="p-3">
                  <Badge variant={participant.status === 'active' ? 'default' : 'secondary'}>
                    {participant.status}
                  </Badge>
                </td>
                <td className="p-3">
                  <Link
                    to="/participants/$participantId"
                    params={{ participantId: participant.id }}
                  >
                    <Button variant="ghost" size="sm">
                      View
                    </Button>
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {data.total > data.limit && (
        <div className="flex items-center justify-between">
          <p className="text-sm text-muted-foreground">
            Showing {data.offset + 1} to {Math.min(data.offset + data.limit, data.total)} of{' '}
            {data.total} participants
          </p>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              disabled={!hasPrevious}
              onClick={handlePrevious}
            >
              Previous
            </Button>
            <Button variant="outline" size="sm" disabled={!hasNext} onClick={handleNext}>
              Next
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
