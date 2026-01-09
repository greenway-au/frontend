/**
 * Form Field Components
 * Reusable form field wrappers for TanStack Form
 */

import type { FieldApi } from '@tanstack/react-form';
import { Input } from '@workspace/ui/components/input';
import { Textarea } from '@workspace/ui/components/textarea';
import { cn } from '@workspace/ui/lib/utils';

/** Convert validation errors to strings */
function getErrorMessages(errors: unknown[]): string[] {
  return errors
    .map((err) => {
      if (typeof err === 'string') return err;
      if (err && typeof err === 'object' && 'message' in err) {
        return String((err as { message: unknown }).message);
      }
      return err ? String(err) : '';
    })
    .filter(Boolean);
}

/** Field wrapper with label and error display */
interface FieldWrapperProps {
  /** Field label */
  label: string;
  /** HTML for attribute */
  htmlFor: string;
  /** Field errors */
  errors?: unknown[];
  /** Whether field has been touched */
  touched?: boolean;
  /** Required indicator */
  required?: boolean;
  /** Additional description */
  description?: string;
  /** Additional className */
  className?: string;
  /** Children (the input element) */
  children: React.ReactNode;
}

export function FieldWrapper({
  label,
  htmlFor,
  errors = [],
  touched = false,
  required = false,
  description,
  className,
  children,
}: FieldWrapperProps) {
  const errorMessages = getErrorMessages(errors);
  const hasError = touched && errorMessages.length > 0;

  return (
    <div className={cn('space-y-2', className)}>
      <label
        htmlFor={htmlFor}
        className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
      >
        {label}
        {required && <span className="ml-1 text-destructive">*</span>}
      </label>

      {children}

      {description && !hasError && (
        <p className="text-sm text-muted-foreground">{description}</p>
      )}

      {hasError && (
        <p className="text-sm text-destructive">{errorMessages[0]}</p>
      )}
    </div>
  );
}

/** Props for form field components */
interface FormFieldProps {
  /** TanStack Form field API */
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  field: FieldApi<any, any, any, any, any>;
  /** Field label */
  label: string;
  /** Placeholder text */
  placeholder?: string;
  /** Input type */
  type?: string;
  /** Required field */
  required?: boolean;
  /** Description text */
  description?: string;
  /** Additional className */
  className?: string;
  /** Disabled state */
  disabled?: boolean;
}

/** Text input field */
export function TextField({
  field,
  label,
  placeholder,
  type = 'text',
  required,
  description,
  className,
  disabled,
}: FormFieldProps) {
  return (
    <FieldWrapper
      label={label}
      htmlFor={String(field.name)}
      errors={field.state.meta.errors}
      touched={field.state.meta.isTouched}
      required={required}
      description={description}
      className={className}
    >
      <Input
        id={String(field.name)}
        name={String(field.name)}
        type={type}
        placeholder={placeholder}
        value={String(field.state.value ?? '')}
        onBlur={field.handleBlur}
        onChange={(e) => field.handleChange(e.target.value)}
        disabled={disabled}
        aria-invalid={field.state.meta.isTouched && field.state.meta.errors.length > 0}
      />
    </FieldWrapper>
  );
}

/** Textarea field */
export function TextareaField({
  field,
  label,
  placeholder,
  required,
  description,
  className,
  disabled,
  rows = 4,
}: FormFieldProps & { rows?: number }) {
  return (
    <FieldWrapper
      label={label}
      htmlFor={String(field.name)}
      errors={field.state.meta.errors}
      touched={field.state.meta.isTouched}
      required={required}
      description={description}
      className={className}
    >
      <Textarea
        id={String(field.name)}
        name={String(field.name)}
        placeholder={placeholder}
        value={String(field.state.value ?? '')}
        onBlur={field.handleBlur}
        onChange={(e) => field.handleChange(e.target.value)}
        disabled={disabled}
        rows={rows}
        aria-invalid={field.state.meta.isTouched && field.state.meta.errors.length > 0}
      />
    </FieldWrapper>
  );
}
