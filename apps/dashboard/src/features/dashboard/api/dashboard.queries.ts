/**
 * Dashboard Query Hooks
 * TanStack Query hooks for dashboard analytics
 */

import { useQuery } from '@tanstack/react-query';
import { dashboardApi } from './dashboard.api';
import type { DashboardFilters } from '../types/dashboard.types';

/** Query key factory for dashboard */
export const dashboardKeys = {
  all: ['dashboard'] as const,
  coordinator: () => [...dashboardKeys.all, 'coordinator'] as const,
  coordinatorData: (filters: DashboardFilters) => [...dashboardKeys.coordinator(), filters] as const,
} as const;

/** Get coordinator dashboard data */
export function useCoordinatorDashboard(filters: DashboardFilters = {}) {
  return useQuery({
    queryKey: dashboardKeys.coordinatorData(filters),
    queryFn: () => dashboardApi.getCoordinatorDashboard(filters),
    placeholderData: (previousData) => previousData,
  });
}
