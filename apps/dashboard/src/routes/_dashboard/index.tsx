/**
 * Dashboard Home Route
 * Main dashboard page - renders role-specific views
 */

import { createFileRoute } from '@tanstack/react-router';
import { useAtomValue } from 'jotai';
import { userAtom } from '@/stores/auth';
import { AdminDashboard, ProviderDashboard, ClientDashboard, CoordinatorDashboard } from '@/features/dashboard';

export const Route = createFileRoute('/_dashboard/')({
  component: DashboardHome,
});

function DashboardHome() {
  const user = useAtomValue(userAtom);
  const firstName = user?.name.split(' ')[0] || 'there';

  // Render role-specific dashboard
  const renderDashboard = () => {
    switch (user?.userType) {
      case 'admin':
        return <AdminDashboard />;
      case 'provider':
        return <ProviderDashboard />;
      case 'coordinator':
        return <CoordinatorDashboard />;
      case 'client':
      default:
        return <ClientDashboard />;
    }
  };

  return (
    <div className="space-y-8">
      {/* Welcome Section */}
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Welcome back, {firstName}</h1>
        <p className="text-muted-foreground mt-1">
          {getUserTypeDescription(user?.userType)}
        </p>
      </div>

      {/* Role-specific Dashboard */}
      {renderDashboard()}
    </div>
  );
}

function getUserTypeDescription(userType?: string): string {
  switch (userType) {
    case 'admin':
      return 'Manage participants, providers, and system settings';
    case 'provider':
      return 'Submit and track your NDIS invoices';
    case 'coordinator':
      return 'Manage your assigned participants';
    case 'client':
    default:
      return 'View your NDIS plan and invoices';
  }
}
