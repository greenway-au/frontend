/**
 * Dashboard Types
 * Type definitions for coordinator dashboard analytics
 */

/** Dashboard summary statistics */
export interface DashboardSummary {
  total_participants: number;
  total_budget: number;
  total_spent: number;
  total_remaining: number;
}

/** Support category breakdown */
export interface SupportBreakdown {
  category: 'core_supports' | 'capital_supports' | 'capacity_building';
  budget: number;
  spent: number;
}

/** Spending by day of week */
export interface SpendingByDay {
  day: string;
  amount: number;
}

/** Complete dashboard data response */
export interface DashboardData {
  summary: DashboardSummary;
  support_breakdown: SupportBreakdown[];
  spending_by_day: SpendingByDay[];
}

/** Dashboard filters */
export interface DashboardFilters {
  participant_id?: string;
  start_date?: string;
  end_date?: string;
  support_category?: string;
}
