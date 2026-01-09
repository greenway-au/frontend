/**
 * UI Store
 * Jotai atoms for UI state management
 */

import { atom } from 'jotai';
import { atomWithStorage } from 'jotai/utils';

// ============================================================================
// Theme
// ============================================================================

export type Theme = 'light' | 'dark' | 'system';

/** Theme preference - persisted */
export const themeAtom = atomWithStorage<Theme>('ui:theme', 'system');

// ============================================================================
// Sidebar
// ============================================================================

/** Sidebar collapsed state - persisted */
export const sidebarCollapsedAtom = atomWithStorage('ui:sidebar:collapsed', false);

/** Sidebar mobile open state */
export const sidebarMobileOpenAtom = atom(false);

// ============================================================================
// Modals
// ============================================================================

/** Generic modal state structure */
interface ModalState<T = unknown> {
  isOpen: boolean;
  data: T | null;
}

/** Factory to create modal atoms */
export function createModalAtom<T>() {
  const baseAtom = atom<ModalState<T>>({ isOpen: false, data: null });

  return atom(
    (get) => get(baseAtom),
    (_get, set, action: { type: 'open'; data: T } | { type: 'close' }) => {
      if (action.type === 'open') {
        set(baseAtom, { isOpen: true, data: action.data });
      } else {
        set(baseAtom, { isOpen: false, data: null });
      }
    }
  );
}

/** Confirm dialog data */
export interface ConfirmDialogData {
  title: string;
  message: string;
  confirmLabel?: string;
  cancelLabel?: string;
  variant?: 'default' | 'destructive';
  onConfirm: () => void | Promise<void>;
  onCancel?: () => void;
}

/** Confirm dialog atom */
export const confirmDialogAtom = createModalAtom<ConfirmDialogData>();

// ============================================================================
// Toasts
// ============================================================================

/** Toast notification structure */
export interface Toast {
  id: string;
  title: string;
  description?: string;
  variant?: 'default' | 'success' | 'error' | 'warning';
  duration?: number;
}

/** Active toasts */
export const toastsAtom = atom<Toast[]>([]);

/** Add a toast notification */
export const addToastAtom = atom(
  null,
  (get, set, toast: Omit<Toast, 'id'>) => {
    const id = Math.random().toString(36).slice(2, 11);
    const newToast: Toast = { ...toast, id };

    set(toastsAtom, [...get(toastsAtom), newToast]);

    // Auto-remove after duration
    const duration = toast.duration ?? 5000;
    if (duration > 0) {
      setTimeout(() => {
        set(toastsAtom, (prev) => prev.filter((t) => t.id !== id));
      }, duration);
    }

    return id;
  }
);

/** Remove a toast by ID */
export const removeToastAtom = atom(null, (get, set, id: string) => {
  set(toastsAtom, get(toastsAtom).filter((t) => t.id !== id));
});

/** Clear all toasts */
export const clearToastsAtom = atom(null, (_get, set) => {
  set(toastsAtom, []);
});

// ============================================================================
// Loading States
// ============================================================================

/** Global loading overlay */
export const globalLoadingAtom = atom(false);

/** Page transition loading */
export const pageLoadingAtom = atom(false);
