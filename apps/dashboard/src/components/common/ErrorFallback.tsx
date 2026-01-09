/**
 * Error Fallback
 * Display component for error states and error boundaries
 */

import { Link } from '@tanstack/react-router';
import { Button } from '@workspace/ui/components/button';
import { Card, CardContent, CardHeader, CardTitle } from '@workspace/ui/components/card';
import { AlertCircle, RefreshCw, Home, ArrowLeft } from 'lucide-react';
import { ApiError } from '@/lib/api/errors';

interface ErrorFallbackProps {
  /** The error that occurred */
  error?: Error | null;
  /** Custom title override */
  title?: string;
  /** Custom message override */
  message?: string;
  /** Show retry button */
  showRetry?: boolean;
  /** Retry callback */
  onRetry?: () => void;
  /** Show back button */
  showBack?: boolean;
  /** Back link destination */
  backTo?: string;
}

export function ErrorFallback({
  error,
  title: customTitle,
  message: customMessage,
  showRetry = true,
  onRetry,
  showBack = false,
  backTo = '/',
}: ErrorFallbackProps) {
  let title = customTitle ?? 'Something went wrong';
  let message = customMessage ?? 'An unexpected error occurred. Please try again.';
  let shouldShowRetry = showRetry;

  if (error instanceof ApiError) {
    switch (error.status) {
      case 404:
        title = 'Not Found';
        message = 'The page or resource you are looking for does not exist.';
        shouldShowRetry = false;
        break;
      case 403:
        title = 'Access Denied';
        message = 'You do not have permission to access this resource.';
        shouldShowRetry = false;
        break;
      case 401:
        title = 'Session Expired';
        message = 'Your session has expired. Please log in again.';
        shouldShowRetry = false;
        break;
      default:
        message = error.message;
    }
  }

  const handleRetry = () => {
    if (onRetry) {
      onRetry();
    } else {
      window.location.reload();
    }
  };

  return (
    <div className="flex min-h-[400px] items-center justify-center p-4">
      <Card className="max-w-md w-full">
        <CardHeader className="text-center">
          <div className="mx-auto mb-4 flex size-12 items-center justify-center rounded-full bg-destructive/10">
            <AlertCircle className="size-6 text-destructive" />
          </div>
          <CardTitle>{title}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4 text-center">
          <p className="text-muted-foreground">{message}</p>

          <div className="flex flex-col sm:flex-row justify-center gap-2">
            {showBack && (
              <Button variant="outline" asChild>
                <Link to={backTo}>
                  <ArrowLeft className="mr-2 size-4" />
                  Go Back
                </Link>
              </Button>
            )}
            <Button variant="outline" asChild>
              <Link to="/">
                <Home className="mr-2 size-4" />
                Home
              </Link>
            </Button>
            {shouldShowRetry && (
              <Button onClick={handleRetry}>
                <RefreshCw className="mr-2 size-4" />
                Retry
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
