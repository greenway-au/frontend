/**
 * Participant Detail
 * Full participant view with plans and actions
 */

import { Link } from '@tanstack/react-router';
import { Card, CardContent, CardHeader, CardTitle } from '@workspace/ui/components/card';
import { Button } from '@workspace/ui/components/button';
import {
  User,
  Mail,
  Phone,
  MapPin,
  Calendar,
  Edit,
  Trash2,
  FileText,
} from 'lucide-react';
import { cn } from '@workspace/ui/lib/utils';
import type { Participant } from '../types/participant.types';

interface ParticipantDetailProps {
  participant: Participant;
  onEdit?: () => void;
  onDelete?: () => void;
}

const statusStyles = {
  active: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400',
  inactive: 'bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-400',
  pending_approval: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400',
};

const planStatusStyles = {
  active: 'bg-green-100 text-green-800',
  expired: 'bg-red-100 text-red-800',
  pending: 'bg-yellow-100 text-yellow-800',
};

export function ParticipantDetail({
  participant,
  onEdit,
  onDelete,
}: ParticipantDetailProps) {
  const activePlan = participant.plans.find((p) => p.status === 'active');

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
                {participant.firstName} {participant.lastName}
              </h1>
              <span
                className={cn(
                  'rounded-full px-2 py-1 text-xs font-medium',
                  statusStyles[participant.status]
                )}
              >
                {participant.status === 'pending_approval'
                  ? 'Pending'
                  : participant.status.charAt(0).toUpperCase() + participant.status.slice(1)}
              </span>
            </div>
            <p className="text-muted-foreground">NDIS: {participant.ndisNumber}</p>
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
        {/* Contact Information */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Contact Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {participant.email && (
              <div className="flex items-center gap-3">
                <Mail className="size-4 text-muted-foreground" />
                <span>{participant.email}</span>
              </div>
            )}
            {participant.phone && (
              <div className="flex items-center gap-3">
                <Phone className="size-4 text-muted-foreground" />
                <span>{participant.phone}</span>
              </div>
            )}
            <div className="flex items-start gap-3">
              <MapPin className="size-4 text-muted-foreground mt-0.5" />
              <div>
                <p>{participant.address.street}</p>
                <p>
                  {participant.address.suburb}, {participant.address.state}{' '}
                  {participant.address.postcode}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Calendar className="size-4 text-muted-foreground" />
              <span>
                DOB: {new Date(participant.dateOfBirth).toLocaleDateString('en-AU')}
              </span>
            </div>
          </CardContent>
        </Card>

        {/* Active Plan Summary */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Active Plan</CardTitle>
          </CardHeader>
          <CardContent>
            {activePlan ? (
              <div className="space-y-4">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Period</span>
                  <span>
                    {new Date(activePlan.startDate).toLocaleDateString('en-AU')} -{' '}
                    {new Date(activePlan.endDate).toLocaleDateString('en-AU')}
                  </span>
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Budget Used</span>
                    <span>
                      ${activePlan.usedBudget.toLocaleString()} / $
                      {activePlan.totalBudget.toLocaleString()}
                    </span>
                  </div>
                  <div className="h-2 rounded-full bg-muted overflow-hidden">
                    <div
                      className="h-full bg-primary transition-all"
                      style={{
                        width: `${Math.min(
                          (activePlan.usedBudget / activePlan.totalBudget) * 100,
                          100
                        )}%`,
                      }}
                    />
                  </div>
                </div>
                <div className="rounded-lg bg-muted p-3">
                  <p className="text-sm text-muted-foreground">Remaining Budget</p>
                  <p className="text-2xl font-bold">
                    ${activePlan.remainingBudget.toLocaleString()}
                  </p>
                </div>
              </div>
            ) : (
              <p className="text-muted-foreground">No active plan</p>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Plans History */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="text-base">Plan History</CardTitle>
          <Button variant="outline" size="sm">
            <FileText className="mr-2 size-4" />
            View All Plans
          </Button>
        </CardHeader>
        <CardContent>
          {participant.plans.length > 0 ? (
            <div className="space-y-3">
              {participant.plans.map((plan) => (
                <div
                  key={plan.id}
                  className="flex items-center justify-between rounded-lg border p-4"
                >
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-medium">
                        {new Date(plan.startDate).toLocaleDateString('en-AU')} -{' '}
                        {new Date(plan.endDate).toLocaleDateString('en-AU')}
                      </span>
                      <span
                        className={cn(
                          'rounded-full px-2 py-0.5 text-xs font-medium',
                          planStatusStyles[plan.status]
                        )}
                      >
                        {plan.status.charAt(0).toUpperCase() + plan.status.slice(1)}
                      </span>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      Total Budget: ${plan.totalBudget.toLocaleString()}
                    </p>
                  </div>
                  <Button variant="ghost" size="sm">
                    View
                  </Button>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-muted-foreground">No plans recorded</p>
          )}
        </CardContent>
      </Card>

      {/* Notes */}
      {participant.notes && (
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Notes</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="whitespace-pre-wrap text-muted-foreground">
              {participant.notes}
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
