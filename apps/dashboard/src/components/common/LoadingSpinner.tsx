/**
 * Loading Spinner
 * Animated loading indicator
 */

import { cn } from '@workspace/ui/lib/utils';
import { Loader2 } from 'lucide-react';

interface LoadingSpinnerProps {
  /** Size variant */
  size?: 'sm' | 'md' | 'lg';
  /** Optional label */
  label?: string;
  /** Center in container */
  centered?: boolean;
  /** Additional className */
  className?: string;
}

const sizeClasses = {
  sm: 'size-4',
  md: 'size-6',
  lg: 'size-8',
};

export function LoadingSpinner({
  size = 'md',
  label,
  centered = false,
  className,
}: LoadingSpinnerProps) {
  const spinner = (
    <div className={cn('flex items-center gap-2', className)}>
      <Loader2 className={cn('animate-spin text-muted-foreground', sizeClasses[size])} />
      {label && <span className="text-sm text-muted-foreground">{label}</span>}
    </div>
  );

  if (centered) {
    return (
      <div className="flex min-h-[200px] items-center justify-center">
        {spinner}
      </div>
    );
  }

  return spinner;
}

/** Full page loading overlay */
export function LoadingOverlay({ label }: { label?: string }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm">
      <LoadingSpinner size="lg" label={label ?? 'Loading...'} />
    </div>
  );
}
