/**
 * Client Register Form
 * Registration form for NDIS participants/clients
 * Premium, clean design
 */

import { useForm } from '@tanstack/react-form';
import { zodValidator } from '@tanstack/zod-form-adapter';
import { Button } from '@workspace/ui/components/button';
import { Input } from '@workspace/ui/components/input';
import { FieldWrapper } from '@/components/common/form';
import { useRegister } from '../api/auth.queries';
import { registerSchema, type RegisterInput } from '../schemas/register.schema';
import { ApiError } from '@/lib/api/errors';
import { Mail, Lock, User, ArrowRight } from 'lucide-react';

export function ClientRegisterForm() {
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
        const { confirmPassword, ...registerData } = value;
        await registerMutation.mutateAsync(registerData);
        window.location.href = '/';
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
    <div className="space-y-6">
      {/* Header */}
      <div className="space-y-2">
        <h1 className="text-2xl font-semibold tracking-tight">Create your account</h1>
        <p className="text-muted-foreground">
          Sign up to manage your NDIS plan
        </p>
      </div>

      {/* Form */}
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
              label="Full name"
              htmlFor="name"
              errors={field.state.meta.errors}
              touched={field.state.meta.isTouched}
              required
            >
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
                <Input
                  id="name"
                  placeholder="John Doe"
                  value={field.state.value}
                  onBlur={field.handleBlur}
                  onChange={(e) => field.handleChange(e.target.value)}
                  autoComplete="name"
                  disabled={registerMutation.isPending}
                  className="pl-10 h-11"
                />
              </div>
            </FieldWrapper>
          )}
        </form.Field>

        {/* Email field */}
        <form.Field name="email">
          {(field) => (
            <FieldWrapper
              label="Email address"
              htmlFor="email"
              errors={field.state.meta.errors}
              touched={field.state.meta.isTouched}
              required
            >
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
                <Input
                  id="email"
                  type="email"
                  placeholder="name@example.com"
                  value={field.state.value}
                  onBlur={field.handleBlur}
                  onChange={(e) => field.handleChange(e.target.value)}
                  autoComplete="email"
                  disabled={registerMutation.isPending}
                  className="pl-10 h-11"
                />
              </div>
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
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
                <Input
                  id="password"
                  type="password"
                  placeholder="Create a password"
                  value={field.state.value}
                  onBlur={field.handleBlur}
                  onChange={(e) => field.handleChange(e.target.value)}
                  autoComplete="new-password"
                  disabled={registerMutation.isPending}
                  className="pl-10 h-11"
                />
              </div>
            </FieldWrapper>
          )}
        </form.Field>

        {/* Confirm Password field */}
        <form.Field name="confirmPassword">
          {(field) => (
            <FieldWrapper
              label="Confirm password"
              htmlFor="confirmPassword"
              errors={field.state.meta.errors}
              touched={field.state.meta.isTouched}
              required
            >
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
                <Input
                  id="confirmPassword"
                  type="password"
                  placeholder="Confirm your password"
                  value={field.state.value}
                  onBlur={field.handleBlur}
                  onChange={(e) => field.handleChange(e.target.value)}
                  autoComplete="new-password"
                  disabled={registerMutation.isPending}
                  className="pl-10 h-11"
                />
              </div>
            </FieldWrapper>
          )}
        </form.Field>

        {/* Error message */}
        {registerMutation.isError && (
          <div className="rounded-lg bg-destructive/10 border border-destructive/20 p-3 text-sm text-destructive">
            {registerMutation.error instanceof ApiError
              ? registerMutation.error.message
              : 'An error occurred. Please try again.'}
          </div>
        )}

        {/* Submit button */}
        <form.Subscribe selector={(state) => [state.canSubmit, state.isSubmitting]}>
          {([canSubmit, isSubmitting]) => (
            <Button
              type="submit"
              className="w-full h-11 font-medium"
              disabled={!canSubmit || isSubmitting || registerMutation.isPending}
            >
              {registerMutation.isPending ? (
                'Creating account...'
              ) : (
                <>
                  Create account
                  <ArrowRight className="ml-2 size-4" />
                </>
              )}
            </Button>
          )}
        </form.Subscribe>
      </form>

      {/* Divider */}
      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t" />
        </div>
        <div className="relative flex justify-center text-xs uppercase">
          <span className="bg-background px-2 text-muted-foreground">Already have an account?</span>
        </div>
      </div>

      {/* Login link */}
      <div className="text-center">
        <a
          href="/login"
          className="inline-flex items-center text-sm font-medium text-primary hover:underline"
        >
          Sign in instead
          <ArrowRight className="ml-1 size-3" />
        </a>
      </div>

      {/* Provider link */}
      <p className="text-center text-xs text-muted-foreground">
        Are you a service provider?{' '}
        <a href="/register-provider" className="text-primary hover:underline">
          Register as a provider
        </a>
      </p>
    </div>
  );
}
