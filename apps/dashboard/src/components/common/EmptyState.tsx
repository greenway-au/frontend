/**
 * Empty State
 * Display component when no data is available
 */

import { Link } from '@tanstack/react-router';
import { Button } from '@workspace/ui/components/button';
import { Card, CardContent } from '@workspace/ui/components/card';
import { Inbox, Plus } from 'lucide-react';

interface EmptyStateProps {
  /** Icon to display (default: Inbox) */
  icon?: React.ReactNode;
  /** Title text */
  title: string;
  /** Description text */
  description?: string;
  /** Primary action */
  action?: {
    label: string;
    href?: string;
    onClick?: () => void;
  };
  /** Additional content */
  children?: React.ReactNode;
}

export function EmptyState({
  icon,
  title,
  description,
  action,
  children,
}: EmptyStateProps) {
  return (
    <Card>
      <CardContent className="flex flex-col items-center justify-center py-12 text-center">
        <div className="mb-4 flex size-12 items-center justify-center rounded-full bg-muted">
          {icon ?? <Inbox className="size-6 text-muted-foreground" />}
        </div>

        <h3 className="text-lg font-semibold">{title}</h3>

        {description && (
          <p className="mt-1 max-w-sm text-sm text-muted-foreground">
            {description}
          </p>
        )}

        {action && (
          <div className="mt-6">
            {action.href ? (
              <Button asChild>
                <Link to={action.href}>
                  <Plus className="mr-2 size-4" />
                  {action.label}
                </Link>
              </Button>
            ) : (
              <Button onClick={action.onClick}>
                <Plus className="mr-2 size-4" />
                {action.label}
              </Button>
            )}
          </div>
        )}

        {children}
      </CardContent>
    </Card>
  );
}
