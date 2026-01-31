/**
 * Dashboard API
 * API calls for coordinator dashboard analytics
 */

import { api } from '@/lib/api';
import type { DashboardData, DashboardFilters } from '../types/dashboard.types';

const DASHBOARD_PATH = '/api/v1/coordinators/me/dashboard';

export const dashboardApi = {
  /** Get coordinator dashboard data with optional filters */
  getCoordinatorDashboard: (filters: DashboardFilters = {}): Promise<DashboardData> => {
    return api.get<DashboardData>(DASHBOARD_PATH, {
      params: {
        participant_id: filters.participant_id,
        start_date: filters.start_date,
        end_date: filters.end_date,
        support_category: filters.support_category,
      },
    });
  },
} as const;
