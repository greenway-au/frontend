/**
 * Register Route
 * Client registration page (default sign-up)
 */

import { createFileRoute, Navigate } from '@tanstack/react-router';
import { AuthLayout } from '@/components/layouts/AuthLayout';
import { ClientRegisterForm } from '@/features/auth/components/ClientRegisterForm';
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
      <ClientRegisterForm />
    </AuthLayout>
  );
}
