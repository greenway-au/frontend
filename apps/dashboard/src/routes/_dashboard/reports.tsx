/**
 * Reports Route
 * Report generation placeholder
 */

import { createFileRoute } from '@tanstack/react-router';
import { PageHeader } from '@/components/common/PageHeader';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@workspace/ui/components/card';
import { Button } from '@workspace/ui/components/button';
import { FileBarChart, Users, DollarSign, Calendar } from 'lucide-react';

export const Route = createFileRoute('/_dashboard/reports')({
  component: ReportsPage,
});

const reportTypes = [
  {
    title: 'Participant Summary',
    description: 'Overview of all participants with status and plan details',
    icon: Users,
  },
  {
    title: 'Budget Report',
    description: 'Detailed breakdown of budget utilization across plans',
    icon: DollarSign,
  },
  {
    title: 'Activity Report',
    description: 'Service delivery and activity logs',
    icon: Calendar,
  },
  {
    title: 'Custom Report',
    description: 'Build a custom report with selected metrics',
    icon: FileBarChart,
  },
];

function ReportsPage() {
  return (
    <div className="space-y-6">
      <PageHeader
        title="Reports"
        description="Generate and download NDIS reports"
      />

      <div className="grid gap-4 md:grid-cols-2">
        {reportTypes.map((report) => (
          <Card key={report.title} className="hover:shadow-md transition-shadow">
            <CardHeader className="flex flex-row items-start gap-4">
              <div className="flex size-10 items-center justify-center rounded-lg bg-primary/10">
                <report.icon className="size-5 text-primary" />
              </div>
              <div className="flex-1">
                <CardTitle className="text-base">{report.title}</CardTitle>
                <CardDescription>{report.description}</CardDescription>
              </div>
            </CardHeader>
            <CardContent>
              <Button variant="outline" className="w-full">
                Generate Report
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
