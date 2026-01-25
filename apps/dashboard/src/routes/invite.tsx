/**
 * Invitation Accept Page
 * Public page where users accept invitations and create their accounts
 */

import { useState, useEffect } from 'react';
import { createFileRoute, useNavigate } from '@tanstack/react-router';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@workspace/ui/components/card';
import { Button } from '@workspace/ui/components/button';
import { Input } from '@workspace/ui/components/input';
import { Label } from '@workspace/ui/components/label';
import { Alert, AlertDescription } from '@workspace/ui/components/alert';
import { Loader2, CheckCircle2, XCircle, Building2, Users, UserCog } from 'lucide-react';
import { useValidateInvitation, useAcceptInvitation } from '@/features/admin';
import { useSetAtom } from 'jotai';
import { setAuthAtom } from '@/stores/auth';

export const Route = createFileRoute('/invite')({
  component: InvitePage,
  validateSearch: (search: Record<string, unknown>) => ({
    token: (search.token as string) || '',
  }),
});

function InvitePage() {
  const { token } = Route.useSearch();
  const navigate = useNavigate();
  const setAuth = useSetAtom(setAuthAtom);

  const { data: validation, isLoading: isValidating, error: validationError } = useValidateInvitation(token);
  const acceptInvitation = useAcceptInvitation();

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [formError, setFormError] = useState<string | null>(null);

  // Pre-fill email from invitation
  useEffect(() => {
    if (validation?.email) {
      setFormData((prev) => ({ ...prev, email: validation.email || '' }));
    }
  }, [validation?.email]);

  const getTypeIcon = (type?: string) => {
    switch (type) {
      case 'provider':
        return <Building2 className="h-8 w-8 text-primary" />;
      case 'client':
        return <Users className="h-8 w-8 text-primary" />;
      case 'coordinator':
        return <UserCog className="h-8 w-8 text-primary" />;
      default:
        return null;
    }
  };

  const getTypeLabel = (type?: string) => {
    switch (type) {
      case 'provider':
        return 'Provider';
      case 'client':
        return 'Participant';
      case 'coordinator':
        return 'Support Coordinator';
      default:
        return 'User';
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);

    // Validation
    if (!formData.name.trim()) {
      setFormError('Please enter your name');
      return;
    }
    if (!formData.email.trim()) {
      setFormError('Please enter your email');
      return;
    }
    if (formData.password.length < 8) {
      setFormError('Password must be at least 8 characters');
      return;
    }
    if (formData.password !== formData.confirmPassword) {
      setFormError('Passwords do not match');
      return;
    }

    try {
      const response = await acceptInvitation.mutateAsync({
        token,
        email: formData.email,
        name: formData.name,
        password: formData.password,
      });

      // Store auth tokens and user data
      setAuth({
        user: response.user,
        tokens: response.tokens,
      });

      // Redirect to dashboard
      navigate({ to: '/' });
    } catch (error: any) {
      setFormError(error?.message || 'Failed to create account. Please try again.');
    }
  };

  // Loading state
  if (isValidating) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-muted/30">
        <Card className="w-full max-w-md">
          <CardContent className="flex flex-col items-center justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-primary mb-4" />
            <p className="text-muted-foreground">Validating invitation...</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  // No token provided
  if (!token) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-muted/30">
        <Card className="w-full max-w-md">
          <CardContent className="flex flex-col items-center justify-center py-12">
            <XCircle className="h-12 w-12 text-destructive mb-4" />
            <h2 className="text-xl font-semibold mb-2">Invalid Link</h2>
            <p className="text-muted-foreground text-center">
              This invitation link is invalid. Please check the link and try again.
            </p>
            <Button className="mt-6" onClick={() => navigate({ to: '/login' })}>
              Go to Login
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Invalid or expired invitation
  if (validationError || !validation?.valid) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-muted/30">
        <Card className="w-full max-w-md">
          <CardContent className="flex flex-col items-center justify-center py-12">
            <XCircle className="h-12 w-12 text-destructive mb-4" />
            <h2 className="text-xl font-semibold mb-2">Invitation Invalid</h2>
            <p className="text-muted-foreground text-center">
              {validation?.message || 'This invitation has expired or is no longer valid.'}
            </p>
            <Button className="mt-6" onClick={() => navigate({ to: '/login' })}>
              Go to Login
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Valid invitation - show registration form
  return (
    <div className="min-h-screen flex items-center justify-center bg-muted/30 p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="flex justify-center mb-4">
            {getTypeIcon(validation.invitation_type)}
          </div>
          <CardTitle className="text-2xl">Welcome to Greenway</CardTitle>
          <CardDescription>
            You've been invited to join as a {getTypeLabel(validation.invitation_type)}
            {validation.entity_name && (
              <span className="block mt-1 font-medium text-foreground">
                {validation.entity_name}
              </span>
            )}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            {formError && (
              <Alert variant="destructive">
                <AlertDescription>{formError}</AlertDescription>
              </Alert>
            )}

            {acceptInvitation.isSuccess && (
              <Alert>
                <CheckCircle2 className="h-4 w-4" />
                <AlertDescription>Account created successfully! Redirecting...</AlertDescription>
              </Alert>
            )}

            <div className="space-y-2">
              <Label htmlFor="name">Full Name</Label>
              <Input
                id="name"
                type="text"
                placeholder="Enter your full name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                disabled={acceptInvitation.isPending}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="Enter your email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                disabled={acceptInvitation.isPending}
                required
              />
              {validation.email && formData.email !== validation.email && (
                <p className="text-xs text-amber-600">
                  Note: The invitation was sent to {validation.email}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                placeholder="Create a password (min 8 characters)"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                disabled={acceptInvitation.isPending}
                required
                minLength={8}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="confirmPassword">Confirm Password</Label>
              <Input
                id="confirmPassword"
                type="password"
                placeholder="Confirm your password"
                value={formData.confirmPassword}
                onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                disabled={acceptInvitation.isPending}
                required
              />
            </div>

            <Button
              type="submit"
              className="w-full"
              disabled={acceptInvitation.isPending}
            >
              {acceptInvitation.isPending ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Creating Account...
                </>
              ) : (
                'Create Account'
              )}
            </Button>

            <p className="text-center text-sm text-muted-foreground">
              Already have an account?{' '}
              <Button variant="link" className="p-0 h-auto" onClick={() => navigate({ to: '/login' })}>
                Sign in
              </Button>
            </p>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
