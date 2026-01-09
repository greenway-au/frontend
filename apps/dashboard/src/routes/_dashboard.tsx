/**
 * Dashboard Layout Route
 * Wraps authenticated dashboard pages with the layout
 */

import { createFileRoute } from '@tanstack/react-router';
import { DashboardLayout } from '@/components/layouts/DashboardLayout';

export const Route = createFileRoute('/_dashboard')({
  component: DashboardLayoutComponent,
});

function DashboardLayoutComponent() {
  return <DashboardLayout />;
}
