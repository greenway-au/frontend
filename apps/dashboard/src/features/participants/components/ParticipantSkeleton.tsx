/**
 * Participant Skeletons
 * Loading placeholders for participant components
 */

import { Skeleton } from '@workspace/ui/components/skeleton';
import { Card, CardContent, CardHeader } from '@workspace/ui/components/card';

/** Single card skeleton */
export function ParticipantCardSkeleton() {
  return (
    <Card>
      <CardHeader className="flex flex-row items-start justify-between space-y-0 pb-2">
        <div className="flex items-center gap-3">
          <Skeleton className="size-10 rounded-full" />
          <div className="space-y-2">
            <Skeleton className="h-4 w-32" />
            <Skeleton className="h-3 w-24" />
          </div>
        </div>
        <Skeleton className="h-6 w-16 rounded-full" />
      </CardHeader>
      <CardContent className="space-y-3">
        <Skeleton className="h-4 w-48" />
        <Skeleton className="h-4 w-32" />
        <Skeleton className="h-16 w-full rounded-lg" />
        <Skeleton className="h-9 w-full" />
      </CardContent>
    </Card>
  );
}

/** List item skeleton */
export function ParticipantListItemSkeleton() {
  return (
    <Card>
      <CardContent className="flex items-center gap-4 py-4">
        <Skeleton className="size-10 rounded-full" />
        <div className="flex-1 space-y-2">
          <Skeleton className="h-4 w-48" />
          <Skeleton className="h-3 w-32" />
        </div>
        <Skeleton className="h-6 w-16 rounded-full" />
        <Skeleton className="h-9 w-24" />
      </CardContent>
    </Card>
  );
}

/** Grid/list skeleton container */
interface ParticipantSkeletonProps {
  count?: number;
  viewMode?: 'grid' | 'list';
}

export function ParticipantSkeleton({
  count = 6,
  viewMode = 'grid',
}: ParticipantSkeletonProps) {
  const SkeletonComponent =
    viewMode === 'grid' ? ParticipantCardSkeleton : ParticipantListItemSkeleton;

  return (
    <div
      className={
        viewMode === 'grid'
          ? 'grid gap-4 sm:grid-cols-2 lg:grid-cols-3'
          : 'space-y-3'
      }
    >
      {Array.from({ length: count }).map((_, i) => (
        <SkeletonComponent key={i} />
      ))}
    </div>
  );
}

/** Detail page skeleton */
export function ParticipantDetailSkeleton() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-start gap-4">
        <Skeleton className="size-16 rounded-full" />
        <div className="space-y-2">
          <Skeleton className="h-8 w-64" />
          <Skeleton className="h-4 w-32" />
        </div>
      </div>

      {/* Info cards */}
      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <Skeleton className="h-5 w-32" />
          </CardHeader>
          <CardContent className="space-y-3">
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-3/4" />
            <Skeleton className="h-4 w-1/2" />
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <Skeleton className="h-5 w-32" />
          </CardHeader>
          <CardContent className="space-y-3">
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-3/4" />
            <Skeleton className="h-4 w-1/2" />
          </CardContent>
        </Card>
      </div>

      {/* Plans section */}
      <Card>
        <CardHeader>
          <Skeleton className="h-5 w-24" />
        </CardHeader>
        <CardContent className="space-y-4">
          {Array.from({ length: 2 }).map((_, i) => (
            <div key={i} className="flex items-center justify-between rounded-lg border p-4">
              <div className="space-y-2">
                <Skeleton className="h-4 w-32" />
                <Skeleton className="h-3 w-48" />
              </div>
              <Skeleton className="h-8 w-24" />
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}
