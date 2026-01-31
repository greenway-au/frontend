/**
 * NDIS Plans Feature
 * Re-exports for clean imports
 */

// Types
export type {
  NDISPlan,
  PlanStatus,
  SupportCategory,
  BudgetBreakdown,
  UploadPlanPayload,
  UpdateBudgetPayload,
  PlanFilters,
  PlansListResponse,
} from './types/ndis-plan.types';

// API
export { ndisPlansApi } from './api/ndis-plans.api';

// Query hooks
export {
  ndisPlansKeys,
  useNDISPlans,
  useNDISPlan,
  useUploadNDISPlan,
  useUpdatePlanBudget,
  useDeleteNDISPlan,
  useDownloadNDISPlan,
} from './api/ndis-plans.queries';

// Components
export { NDISPlanUpload } from './components/NDISPlanUpload';
export { NDISPlanCard } from './components/NDISPlanCard';
export { NDISPlanList } from './components/NDISPlanList';
export { NDISPlanBudgetForm } from './components/NDISPlanBudgetForm';
export { NDISPlansSection } from './components/NDISPlansSection';
export { RecentPlansWidget } from './components/RecentPlansWidget';
export { ActivePlanWidget } from './components/ActivePlanWidget';
