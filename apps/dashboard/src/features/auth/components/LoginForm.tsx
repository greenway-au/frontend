/**
 * Login Form
 * Email/password login form with TanStack Form
 */

import { useForm } from '@tanstack/react-form';
import { zodValidator } from '@tanstack/zod-form-adapter';
import { useNavigate, useSearch } from '@tanstack/react-router';
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
import { useLogin } from '../api/auth.queries';
import { loginSchema, type LoginInput } from '../schemas/login.schema';
import { ApiError } from '@/lib/api/errors';

export function LoginForm() {
  const navigate = useNavigate();
  const search = useSearch({ strict: false }) as { returnUrl?: string };
  const loginMutation = useLogin();

  const form = useForm({
    defaultValues: {
      email: '',
      password: '',
    } satisfies LoginInput,
    onSubmit: async ({ value }) => {
      try {
        await loginMutation.mutateAsync(value);
        // Redirect to return URL or home
        const returnUrl = search.returnUrl ? decodeURIComponent(search.returnUrl) : '/';
        navigate({ to: returnUrl });
      } catch {
        // Error is handled by mutation state
      }
    },
    validatorAdapter: zodValidator(),
    validators: {
      onChange: loginSchema,
    },
  });

  return (
    <Card>
      <CardHeader className="space-y-1">
        <CardTitle className="text-2xl">Welcome back</CardTitle>
        <CardDescription>
          Enter your credentials to access your dashboard
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
                  disabled={loginMutation.isPending}
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
                  placeholder="Enter your password"
                  value={field.state.value}
                  onBlur={field.handleBlur}
                  onChange={(e) => field.handleChange(e.target.value)}
                  autoComplete="current-password"
                  disabled={loginMutation.isPending}
                />
              </FieldWrapper>
            )}
          </form.Field>

          {/* Error message */}
          {loginMutation.isError && (
            <div className="rounded-md bg-destructive/10 p-3 text-sm text-destructive">
              {loginMutation.error instanceof ApiError
                ? loginMutation.error.message
                : 'An error occurred. Please try again.'}
            </div>
          )}

          {/* Submit button */}
          <form.Subscribe selector={(state) => [state.canSubmit, state.isSubmitting]}>
            {([canSubmit, isSubmitting]) => (
              <Button
                type="submit"
                className="w-full"
                disabled={!canSubmit || isSubmitting || loginMutation.isPending}
              >
                {loginMutation.isPending ? 'Signing in...' : 'Sign in'}
              </Button>
            )}
          </form.Subscribe>

          {/* Forgot password link */}
          <div className="text-center text-sm">
            <a href="/forgot-password" className="text-primary hover:underline">
              Forgot your password?
            </a>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
