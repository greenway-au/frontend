/**
 * Toast Hook
 * Convenient hook for showing toast notifications
 */

import { useSetAtom } from 'jotai';
import { addToastAtom, removeToastAtom, clearToastsAtom, type Toast } from '@/stores/ui';

export function useToast() {
  const addToast = useSetAtom(addToastAtom);
  const removeToast = useSetAtom(removeToastAtom);
  const clearToasts = useSetAtom(clearToastsAtom);

  return {
    /** Show a toast notification */
    toast: (options: Omit<Toast, 'id'>) => addToast(options),

    /** Show a success toast */
    success: (title: string, description?: string) =>
      addToast({ title, description, variant: 'success' }),

    /** Show an error toast */
    error: (title: string, description?: string) =>
      addToast({ title, description, variant: 'error' }),

    /** Show a warning toast */
    warning: (title: string, description?: string) =>
      addToast({ title, description, variant: 'warning' }),

    /** Show an info toast */
    info: (title: string, description?: string) =>
      addToast({ title, description, variant: 'default' }),

    /** Dismiss a specific toast */
    dismiss: (id: string) => removeToast(id),

    /** Clear all toasts */
    clear: () => clearToasts(),
  };
}
