/**
 * Confirm Dialog Hook
 * Hook for showing confirmation dialogs
 */

import { useSetAtom, useAtomValue } from 'jotai';
import { confirmDialogAtom, type ConfirmDialogData } from '@/stores/ui';

export function useConfirm() {
  const setConfirmDialog = useSetAtom(confirmDialogAtom);

  /** Show a confirmation dialog */
  const confirm = (options: Omit<ConfirmDialogData, 'onConfirm'> & {
    onConfirm?: () => void | Promise<void>;
  }): Promise<boolean> => {
    return new Promise((resolve) => {
      setConfirmDialog({
        type: 'open',
        data: {
          ...options,
          onConfirm: async () => {
            await options.onConfirm?.();
            setConfirmDialog({ type: 'close' });
            resolve(true);
          },
          onCancel: () => {
            options.onCancel?.();
            setConfirmDialog({ type: 'close' });
            resolve(false);
          },
        },
      });
    });
  };

  /** Close the confirm dialog */
  const close = () => {
    setConfirmDialog({ type: 'close' });
  };

  return { confirm, close };
}

/** Hook to read confirm dialog state */
export function useConfirmDialogState() {
  return useAtomValue(confirmDialogAtom);
}
