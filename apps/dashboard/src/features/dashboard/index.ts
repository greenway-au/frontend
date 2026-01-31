/**
 * Dashboard Feature Index
 * Export all dashboard components
 */

export { AdminDashboard } from './components/AdminDashboard';
export { ProviderDashboard } from './components/ProviderDashboard';
export { ClientDashboard } from './components/ClientDashboard';
export { CoordinatorDashboard } from './components/CoordinatorDashboard';

// Analytics components
export { FundingDonutChart } from './components/FundingDonutChart';
export { SpendingBarChart } from './components/SpendingBarChart';
export { DashboardFilters } from './components/DashboardFilters';

// Types
export type {
  DashboardSummary,
  SupportBreakdown,
  SpendingByDay,
  DashboardData,
  DashboardFilters,
} from './types/dashboard.types';

// API
export { dashboardApi } from './api/dashboard.api';

// Query hooks
export { dashboardKeys, useCoordinatorDashboard } from './api/dashboard.queries';
