/**
 * Dashboard Store
 * Jotai atoms for dashboard filter state
 */

import { atom } from 'jotai';
import type { DashboardFilters } from '@/features/dashboard/types/dashboard.types';

/** Dashboard filters atom */
export const dashboardFiltersAtom = atom<DashboardFilters>({
  participant_id: undefined,
  start_date: undefined,
  end_date: undefined,
  support_category: undefined,
});

/** Selected participant ID atom (for convenience) */
export const selectedParticipantAtom = atom(
  (get) => get(dashboardFiltersAtom).participant_id,
  (get, set, participantId: string | undefined) => {
    set(dashboardFiltersAtom, { ...get(dashboardFiltersAtom), participant_id: participantId });
  }
);
