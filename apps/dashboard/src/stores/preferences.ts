/**
 * User Preferences Store
 * Jotai atoms for user preferences (persisted)
 */

import { atom } from 'jotai';
import { atomWithStorage } from 'jotai/utils';

/** User preferences structure */
export interface UserPreferences {
  /** Locale for formatting dates, numbers */
  language: string;
  /** Timezone for date display */
  timezone: string;
  /** Date format pattern */
  dateFormat: 'dd/MM/yyyy' | 'MM/dd/yyyy' | 'yyyy-MM-dd';
  /** Items per page in lists */
  itemsPerPage: 10 | 20 | 50 | 100;
  /** Notification preferences */
  notifications: {
    email: boolean;
    push: boolean;
    inApp: boolean;
  };
  /** Accessibility preferences */
  accessibility: {
    reduceMotion: boolean;
    highContrast: boolean;
  };
}

/** Default preferences */
const defaultPreferences: UserPreferences = {
  language: 'en-AU',
  timezone: 'Australia/Sydney',
  dateFormat: 'dd/MM/yyyy',
  itemsPerPage: 20,
  notifications: {
    email: true,
    push: false,
    inApp: true,
  },
  accessibility: {
    reduceMotion: false,
    highContrast: false,
  },
};

/** User preferences atom - persisted to localStorage */
export const userPreferencesAtom = atomWithStorage<UserPreferences>(
  'user:preferences',
  defaultPreferences
);

/** Update a specific preference */
export const updatePreferenceAtom = atom(
  null,
  (get, set, updates: Partial<UserPreferences>) => {
    const current = get(userPreferencesAtom);
    set(userPreferencesAtom, { ...current, ...updates });
  }
);

/** Reset preferences to defaults */
export const resetPreferencesAtom = atom(null, (_get, set) => {
  set(userPreferencesAtom, defaultPreferences);
});

// ============================================================================
// Derived Preference Atoms
// ============================================================================

/** Items per page preference */
export const itemsPerPageAtom = atom((get) => get(userPreferencesAtom).itemsPerPage);

/** Date format preference */
export const dateFormatAtom = atom((get) => get(userPreferencesAtom).dateFormat);

/** Reduce motion preference */
export const reduceMotionAtom = atom((get) => get(userPreferencesAtom).accessibility.reduceMotion);
