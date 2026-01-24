/**
 * Participant Card
 * Card component for displaying participant summary
 */

import { Card, CardContent, CardHeader, CardTitle } from '@workspace/ui/components/card';
import { Badge } from '@workspace/ui/components/badge';
import type { Participant } from '../types/participant.types';

interface ParticipantCardProps {
  participant: Participant;
  onMouseEnter?: () => void;
  onClick?: () => void;
}

export function ParticipantCard({ participant, onMouseEnter, onClick }: ParticipantCardProps) {
  return (
    <Card
      className="h-full transition-colors hover:bg-muted/50 cursor-pointer"
      onMouseEnter={onMouseEnter}
      onClick={onClick}
    >
      <CardHeader>
        <div className="flex items-start justify-between">
          <CardTitle className="text-lg">{participant.full_name || 'N/A'}</CardTitle>
          <Badge variant={participant.status === 'active' ? 'default' : 'secondary'}>
            {participant.status}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-2">
        <div className="flex justify-between text-sm">
          <span className="text-muted-foreground">NDIS Number</span>
          <span className="font-mono">{participant.ndis_number || 'N/A'}</span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-muted-foreground">Plan Period</span>
          <span className="font-medium">
            {participant.plan_start_date && participant.plan_end_date
              ? `${participant.plan_start_date} to ${participant.plan_end_date}`
              : 'N/A'}
          </span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-muted-foreground">Starting Funding</span>
          <span className="font-medium">
            {participant.starting_funding_amount != null
              ? `$${participant.starting_funding_amount.toLocaleString('en-AU', {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2,
                })}`
              : 'N/A'}
          </span>
        </div>
      </CardContent>
    </Card>
  );
}
