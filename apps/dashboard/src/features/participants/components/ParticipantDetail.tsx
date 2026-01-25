/**
 * Participant Detail
 * Full participant view with actions
 */

import { Card, CardContent, CardHeader, CardTitle } from '@workspace/ui/components/card';
import { Button } from '@workspace/ui/components/button';
import { Badge } from '@workspace/ui/components/badge';
import { Edit, Trash2, Calendar, DollarSign, User } from 'lucide-react';
import type { Participant } from '../types/participant.types';

interface ParticipantDetailProps {
  participant: Participant;
  onEdit?: () => void;
  onDelete?: () => void;
}

export function ParticipantDetail({
  participant,
  onEdit,
  onDelete,
}: ParticipantDetailProps) {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div className="flex items-start gap-4">
          <div className="flex size-16 items-center justify-center rounded-full bg-muted">
            <User className="size-8 text-muted-foreground" />
          </div>
          <div>
            <div className="flex items-center gap-3">
              <h1 className="text-2xl font-bold">
                {participant.full_name || 'Unnamed Participant'}
              </h1>
              <Badge variant={participant.status === 'active' ? 'default' : 'secondary'}>
                {participant.status}
              </Badge>
            </div>
            <p className="text-muted-foreground">
              {participant.ndis_number ? `NDIS: ${participant.ndis_number}` : 'No NDIS number'}
            </p>
          </div>
        </div>

        <div className="flex gap-2">
          <Button variant="outline" onClick={onEdit}>
            <Edit className="mr-2 size-4" />
            Edit
          </Button>
          <Button variant="destructive" onClick={onDelete}>
            <Trash2 className="mr-2 size-4" />
            Delete
          </Button>
        </div>
      </div>

      {/* Info Cards */}
      <div className="grid gap-4 md:grid-cols-2">
        {/* Participant Information */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Participant Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground">Full Name</span>
              <span className="font-medium">{participant.full_name || 'N/A'}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground">NDIS Number</span>
              <span className="font-mono text-sm">{participant.ndis_number || 'N/A'}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground">Status</span>
              <Badge variant={participant.status === 'active' ? 'default' : 'secondary'}>
                {participant.status}
              </Badge>
            </div>
          </CardContent>
        </Card>

        {/* Plan Information */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <Calendar className="size-4" />
              Plan Details
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Plan Start Date</span>
                <span className="font-medium">
                  {participant.plan_start_date || 'N/A'}
                </span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Plan End Date</span>
                <span className="font-medium">
                  {participant.plan_end_date || 'N/A'}
                </span>
              </div>
            </div>

            {participant.starting_funding_amount != null && (
              <div className="rounded-lg bg-muted p-4">
                <div className="flex items-center gap-2 text-sm text-muted-foreground mb-1">
                  <DollarSign className="size-4" />
                  <span>Starting Funding Amount</span>
                </div>
                <p className="text-2xl font-bold">
                  ${participant.starting_funding_amount.toLocaleString('en-AU', {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                  })}
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Metadata */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Record Information</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">Created</span>
            <span>{new Date(participant.created_at).toLocaleString('en-AU')}</span>
          </div>
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">Last Updated</span>
            <span>{new Date(participant.updated_at).toLocaleString('en-AU')}</span>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
