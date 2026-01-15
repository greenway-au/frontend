/**
 * Register Route
 * Public registration page
 */

import { createFileRoute, Navigate } from '@tanstack/react-router';
import { AuthLayout } from '@/components/layouts/AuthLayout';
import { RegisterForm } from '@/features/auth/components/RegisterForm';
import { useIsAuthenticated } from '@/features/auth';

export const Route = createFileRoute('/register')({
  component: RegisterPage,
});

function RegisterPage() {
  const isAuthenticated = useIsAuthenticated();

  // Redirect if already authenticated
  if (isAuthenticated) {
    return <Navigate to="/" />;
  }

  return (
    <AuthLayout>
      <RegisterForm />
    </AuthLayout>
  );
}

