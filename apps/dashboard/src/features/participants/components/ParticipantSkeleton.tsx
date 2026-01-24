/**
 * Participant Skeleton
 * Loading skeleton for participant cards
 */

import { Card, CardContent, CardHeader } from '@workspace/ui/components/card';
import { Skeleton } from '@workspace/ui/components/skeleton';

interface ParticipantSkeletonProps {
  count?: number;
}

export function ParticipantSkeleton({ count = 3 }: ParticipantSkeletonProps) {
  return (
    <div className="space-y-4">
      {Array.from({ length: count }).map((_, i) => (
        <Card key={i}>
          <CardHeader>
            <div className="flex items-start justify-between">
              <Skeleton className="h-6 w-48" />
              <Skeleton className="h-5 w-16" />
            </div>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex justify-between">
              <Skeleton className="h-4 w-24" />
              <Skeleton className="h-4 w-32" />
            </div>
            <div className="flex justify-between">
              <Skeleton className="h-4 w-20" />
              <Skeleton className="h-4 w-40" />
            </div>
            <div className="flex justify-between">
              <Skeleton className="h-4 w-28" />
              <Skeleton className="h-4 w-24" />
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
