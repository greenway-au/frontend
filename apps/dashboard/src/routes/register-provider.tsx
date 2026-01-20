/**
 * Provider Register Route
 * Provider registration page for NDIS service providers
 */

import { createFileRoute, Navigate } from '@tanstack/react-router';
import { AuthLayout } from '@/components/layouts/AuthLayout';
import { ProviderRegisterForm } from '@/features/auth/components/ProviderRegisterForm';
import { useIsAuthenticated } from '@/features/auth';

export const Route = createFileRoute('/register-provider')({
  component: ProviderRegisterPage,
});

function ProviderRegisterPage() {
  const isAuthenticated = useIsAuthenticated();

  // Redirect if already authenticated
  if (isAuthenticated) {
    return <Navigate to="/" />;
  }

  return (
    <AuthLayout>
      <ProviderRegisterForm />
    </AuthLayout>
  );
}
