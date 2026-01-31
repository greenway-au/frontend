/**
 * NDIS Plan Types
 * Type definitions for NDIS plan entities
 */

/** Plan status */
export type PlanStatus = 'active' | 'inactive' | 'expired';

/** Support category types */
export type SupportCategory = 'core_supports' | 'capital_supports' | 'capacity_building';

/** Budget breakdown by category */
export interface BudgetBreakdown {
  core_supports: number;
  capital_supports: number;
  capacity_building: number;
}

/** NDIS Plan entity */
export interface NDISPlan {
  id: string;
  participant_id: string;
  uploaded_by: string;
  filename: string;
  s3_key: string;
  content_type: string;
  file_size: number;
  plan_number?: string;
  start_date?: string;
  end_date?: string;
  budget: BudgetBreakdown;
  total_budget: number;
  status: PlanStatus;
  created_at: string;
  updated_at: string;
}

/** Upload plan payload */
export interface UploadPlanPayload {
  file: File;
  participant_id: string;
}

/** Update budget payload */
export interface UpdateBudgetPayload {
  plan_number?: string;
  start_date?: string;
  end_date?: string;
  core_supports_budget: number;
  capital_supports_budget: number;
  capacity_building_budget: number;
}

/** Plan filters */
export interface PlanFilters {
  participant_id?: string;
  status?: PlanStatus;
  limit?: number;
  offset?: number;
}

/** Plans list response */
export interface PlansListResponse {
  plans: NDISPlan[];
  total: number;
  offset: number;
  limit: number;
}
