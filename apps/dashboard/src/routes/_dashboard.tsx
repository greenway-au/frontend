/**
 * Dashboard Layout Route
 * Wraps authenticated dashboard pages with the layout
 */

import { createFileRoute } from '@tanstack/react-router';
import { DashboardLayout } from '@/components/layouts/DashboardLayout';
import { ProtectedRoute } from '@/features/auth';

export const Route = createFileRoute('/_dashboard')({
  component: DashboardLayoutComponent,
});

function DashboardLayoutComponent() {
  return (
    <ProtectedRoute>
      <DashboardLayout />
    </ProtectedRoute>
  );
}
