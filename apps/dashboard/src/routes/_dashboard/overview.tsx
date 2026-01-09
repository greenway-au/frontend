/**
 * Overview Route
 * Dashboard overview with analytics
 */

import { createFileRoute } from '@tanstack/react-router';
import { PageHeader } from '@/components/common/PageHeader';
import { Card, CardContent, CardHeader, CardTitle } from '@workspace/ui/components/card';

export const Route = createFileRoute('/_dashboard/overview')({
  component: OverviewPage,
});

function OverviewPage() {
  return (
    <div className="space-y-6">
      <PageHeader
        title="Overview"
        description="Analytics and insights for your NDIS platform"
      />

      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Participant Growth</CardTitle>
          </CardHeader>
          <CardContent className="h-64 flex items-center justify-center text-muted-foreground">
            Chart coming soon...
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Budget Utilization</CardTitle>
          </CardHeader>
          <CardContent className="h-64 flex items-center justify-center text-muted-foreground">
            Chart coming soon...
          </CardContent>
        </Card>

        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle>Plan Status Distribution</CardTitle>
          </CardHeader>
          <CardContent className="h-64 flex items-center justify-center text-muted-foreground">
            Chart coming soon...
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
