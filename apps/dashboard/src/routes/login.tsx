/**
 * Login Route
 * Public login page
 */

import { createFileRoute, Navigate } from '@tanstack/react-router';
import { AuthLayout } from '@/components/layouts/AuthLayout';
import { LoginForm, useIsAuthenticated } from '@/features/auth';

export const Route = createFileRoute('/login')({
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
