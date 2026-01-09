/**
 * Participant Card
 * Card component for displaying participant summary
 */

import { Link } from '@tanstack/react-router';
import { Card, CardContent, CardHeader } from '@workspace/ui/components/card';
import { Button } from '@workspace/ui/components/button';
import { User, Mail, Phone, ChevronRight } from 'lucide-react';
import { cn } from '@workspace/ui/lib/utils';
import type { ParticipantListItem } from '../types/participant.types';

interface ParticipantCardProps {
  participant: ParticipantListItem;
  onMouseEnter?: () => void;
}

const statusStyles = {
  active: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400',
  inactive: 'bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-400',
  pending_approval: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400',
};

const statusLabels = {
  active: 'Active',
  inactive: 'Inactive',
  pending_approval: 'Pending',
};

export function ParticipantCard({ participant, onMouseEnter }: ParticipantCardProps) {
  return (
    <Card
      className="group transition-shadow hover:shadow-md"
      onMouseEnter={onMouseEnter}
    >
      <CardHeader className="flex flex-row items-start justify-between space-y-0 pb-2">
        <div className="flex items-center gap-3">
          <div className="flex size-10 items-center justify-center rounded-full bg-muted">
            <User className="size-5 text-muted-foreground" />
          </div>
          <div>
            <h3 className="font-semibold">
              {participant.firstName} {participant.lastName}
            </h3>
            <p className="text-sm text-muted-foreground">
              NDIS: {participant.ndisNumber}
            </p>
          </div>
        </div>
        <span
          className={cn(
            'rounded-full px-2 py-1 text-xs font-medium',
            statusStyles[participant.status]
          )}
        >
          {statusLabels[participant.status]}
        </span>
      </CardHeader>

      <CardContent className="space-y-3">
        {participant.email && (
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Mail className="size-4" />
            <span className="truncate">{participant.email}</span>
          </div>
        )}

        {participant.phone && (
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Phone className="size-4" />
            <span>{participant.phone}</span>
          </div>
        )}

        {participant.activePlanBudget !== undefined && (
          <div className="rounded-lg bg-muted p-3">
            <p className="text-xs text-muted-foreground">Active Plan Budget</p>
            <p className="text-lg font-semibold">
              ${participant.activePlanBudget.toLocaleString()}
            </p>
          </div>
        )}

        <Button variant="ghost" className="w-full justify-between" asChild>
          <Link to="/participants/$participantId" params={{ participantId: participant.id }}>
            View Details
            <ChevronRight className="size-4" />
          </Link>
        </Button>
      </CardContent>
    </Card>
  );
}
