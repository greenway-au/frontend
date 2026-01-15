/**
 * Register Form
 * User registration form with TanStack Form
 */

import { useForm } from '@tanstack/react-form';
import { zodValidator } from '@tanstack/zod-form-adapter';
import { useNavigate, Link } from '@tanstack/react-router';
import { Button } from '@workspace/ui/components/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@workspace/ui/components/card';
import { Input } from '@workspace/ui/components/input';
import { FieldWrapper } from '@/components/common/form';
import { useRegister } from '../api/auth.queries';
import { registerSchema, type RegisterInput } from '../schemas/register.schema';
import { ApiError } from '@/lib/api/errors';
import { cn } from '@/lib/utils';

export function RegisterForm() {
  const navigate = useNavigate();
  const registerMutation = useRegister();

  const form = useForm({
    defaultValues: {
      email: '',
      password: '',
      confirmPassword: '',
      name: '',
      userType: 'client',
    } satisfies RegisterInput,
    onSubmit: async ({ value }) => {
      try {
        // Remove confirmPassword before sending to API
        const { confirmPassword, ...registerData } = value;
        await registerMutation.mutateAsync(registerData);
        navigate({ to: '/' });
      } catch {
        // Error is handled by mutation state
      }
    },
    validatorAdapter: zodValidator(),
    validators: {
      onChange: registerSchema,
    },
  });

  return (
    <Card className="w-full">
      <CardHeader className="space-y-1">
        <CardTitle className="text-2xl">Create an account</CardTitle>
        <CardDescription>
          Enter your details to create your NDIS dashboard account
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            e.stopPropagation();
            form.handleSubmit();
          }}
          className="space-y-4"
        >
          {/* Name field */}
          <form.Field name="name">
            {(field) => (
              <FieldWrapper
                label="Full Name"
                htmlFor="name"
                errors={field.state.meta.errors}
                touched={field.state.meta.isTouched}
                required
              >
                <Input
                  id="name"
                  placeholder="John Doe"
                  value={field.state.value}
                  onBlur={field.handleBlur}
                  onChange={(e) => field.handleChange(e.target.value)}
                  autoComplete="name"
                  disabled={registerMutation.isPending}
                />
              </FieldWrapper>
            )}
          </form.Field>

          {/* Email field */}
          <form.Field name="email">
            {(field) => (
              <FieldWrapper
                label="Email"
                htmlFor="email"
                errors={field.state.meta.errors}
                touched={field.state.meta.isTouched}
                required
              >
                <Input
                  id="email"
                  type="email"
                  placeholder="name@example.com"
                  value={field.state.value}
                  onBlur={field.handleBlur}
                  onChange={(e) => field.handleChange(e.target.value)}
                  autoComplete="email"
                  disabled={registerMutation.isPending}
                />
              </FieldWrapper>
            )}
          </form.Field>

          {/* Password field */}
          <form.Field name="password">
            {(field) => (
              <FieldWrapper
                label="Password"
                htmlFor="password"
                errors={field.state.meta.errors}
                touched={field.state.meta.isTouched}
                required
              >
                <Input
                  id="password"
                  type="password"
                  placeholder="Create a password"
                  value={field.state.value}
                  onBlur={field.handleBlur}
                  onChange={(e) => field.handleChange(e.target.value)}
                  autoComplete="new-password"
                  disabled={registerMutation.isPending}
                />
              </FieldWrapper>
            )}
          </form.Field>

          {/* Confirm Password field */}
          <form.Field name="confirmPassword">
            {(field) => (
              <FieldWrapper
                label="Confirm Password"
                htmlFor="confirmPassword"
                errors={field.state.meta.errors}
                touched={field.state.meta.isTouched}
                required
              >
                <Input
                  id="confirmPassword"
                  type="password"
                  placeholder="Confirm your password"
                  value={field.state.value}
                  onBlur={field.handleBlur}
                  onChange={(e) => field.handleChange(e.target.value)}
                  autoComplete="new-password"
                  disabled={registerMutation.isPending}
                />
              </FieldWrapper>
            )}
          </form.Field>

          {/* User Type Selection */}
          <form.Field name="userType">
            {(field) => (
              <div className="space-y-2">
                <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                  I am a...
                </label>
                <div className="flex gap-4">
                  <button
                    type="button"
                    onClick={() => field.handleChange('client')}
                    className={cn(
                      "flex-1 rounded-md border p-3 text-sm font-medium transition-colors hover:bg-muted focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
                      field.state.value === 'client'
                        ? "border-primary bg-primary/5 text-primary"
                        : "border-input bg-transparent"
                    )}
                  >
                    Participant
                  </button>
                  <button
                    type="button"
                    onClick={() => field.handleChange('provider')}
                    className={cn(
                      "flex-1 rounded-md border p-3 text-sm font-medium transition-colors hover:bg-muted focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
                      field.state.value === 'provider'
                        ? "border-primary bg-primary/5 text-primary"
                        : "border-input bg-transparent"
                    )}
                  >
                    Provider
                  </button>
                </div>
                {field.state.meta.errors.length > 0 && (
                  <p className="text-sm font-medium text-destructive">
                    {field.state.meta.errors.join(', ')}
                  </p>
                )}
              </div>
            )}
          </form.Field>

          {/* Error message */}
          {registerMutation.isError && (
            <div className="rounded-md bg-destructive/10 p-3 text-sm text-destructive">
              {registerMutation.error instanceof ApiError
                ? registerMutation.error.message
                : 'An error occurred during registration. Please try again.'}
            </div>
          )}

          {/* Submit button */}
          <form.Subscribe selector={(state) => [state.canSubmit, state.isSubmitting]}>
            {([canSubmit, isSubmitting]) => (
              <Button
                type="submit"
                className="w-full"
                disabled={!canSubmit || isSubmitting || registerMutation.isPending}
              >
                {registerMutation.isPending ? 'Creating account...' : 'Create account'}
              </Button>
            )}
          </form.Subscribe>

          {/* Login link */}
          <div className="text-center text-sm">
            <span className="text-muted-foreground">Already have an account? </span>
            <Link to="/login" className="text-primary hover:underline font-medium">
              Sign in
            </Link>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}

