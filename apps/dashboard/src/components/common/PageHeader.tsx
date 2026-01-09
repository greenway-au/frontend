/**
 * Page Header
 * Consistent header for content pages with title, description, and actions
 */

import { Link } from '@tanstack/react-router';
import { Button } from '@workspace/ui/components/button';
import { ChevronLeft, Plus } from 'lucide-react';

interface PageHeaderProps {
  /** Page title */
  title: string;
  /** Optional description */
  description?: string;
  /** Optional back link */
  backLink?: {
    to: string;
    label?: string;
  };
  /** Optional primary action */
  action?: {
    label: string;
    href?: string;
    onClick?: () => void;
    icon?: React.ReactNode;
  };
  /** Additional actions */
  children?: React.ReactNode;
}

export function PageHeader({
  title,
  description,
  backLink,
  action,
  children,
}: PageHeaderProps) {
  return (
    <div className="space-y-4">
      {backLink && (
        <Button variant="ghost" size="sm" asChild className="-ml-2">
          <Link to={backLink.to}>
            <ChevronLeft className="mr-1 size-4" />
            {backLink.label ?? 'Back'}
          </Link>
        </Button>
      )}

      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="space-y-1">
          <h1 className="text-2xl font-bold tracking-tight">{title}</h1>
          {description && (
            <p className="text-muted-foreground">{description}</p>
          )}
        </div>

        <div className="flex items-center gap-2">
          {children}
          {action && (
            action.href ? (
              <Button asChild>
                <Link to={action.href}>
                  {action.icon ?? <Plus className="mr-2 size-4" />}
                  {action.label}
                </Link>
              </Button>
            ) : (
              <Button onClick={action.onClick}>
                {action.icon ?? <Plus className="mr-2 size-4" />}
                {action.label}
              </Button>
            )
          )}
        </div>
      </div>
    </div>
  );
}
