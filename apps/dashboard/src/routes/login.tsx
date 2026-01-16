/**
 * Login Route
 * Public login page
 */

import { createFileRoute, Navigate } from '@tanstack/react-router';
import { z } from 'zod';
import { AuthLayout } from '@/components/layouts/AuthLayout';
import { LoginForm, useIsAuthenticated } from '@/features/auth';

const loginSearchSchema = z.object({
  returnUrl: z.string().optional(),
});

export const Route = createFileRoute('/login')({
  validateSearch: loginSearchSchema,
  component: LoginPage,
});

function LoginPage() {
  const isAuthenticated = useIsAuthenticated();

  // Redirect if already authenticated
  if (isAuthenticated) {
    return <Navigate to="/" />;
  }

  return (
    <AuthLayout>
      <LoginForm />
    </AuthLayout>
  );
}
