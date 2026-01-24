/**
 * Participant Form
 * Create/edit form for participants using TanStack Form
 */

import { useForm } from '@tanstack/react-form';
import { zodValidator } from '@tanstack/zod-form-adapter';
import { useNavigate } from '@tanstack/react-router';
import { Button } from '@workspace/ui/components/button';
import { Card, CardContent, CardHeader, CardTitle } from '@workspace/ui/components/card';
import { Input } from '@workspace/ui/components/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@workspace/ui/components/select';
import { FieldWrapper } from '@/components/common/form';
import { useCreateParticipant, useUpdateParticipant } from '../api/participants.queries';
import {
  createParticipantSchema,
  type CreateParticipantFormData,
} from '../schemas/participant.schema';
import type { Participant } from '../types/participant.types';
import { ApiError } from '@/lib/api/errors';

interface ParticipantFormProps {
  /** Existing participant for edit mode */
  participant?: Participant;
  /** Callback on successful submit */
  onSuccess?: (participant: Participant) => void;
  /** Callback on cancel */
  onCancel?: () => void;
}

export function ParticipantForm({
  participant,
  onSuccess,
  onCancel,
}: ParticipantFormProps) {
  const navigate = useNavigate();
  const createMutation = useCreateParticipant();
  const updateMutation = useUpdateParticipant();

  const isEditing = !!participant;
  const mutation = isEditing ? updateMutation : createMutation;

  const form = useForm({
    defaultValues: {
      full_name: participant?.full_name ?? '',
      ndis_number: participant?.ndis_number ?? '',
      plan_start_date: participant?.plan_start_date ?? '',
      plan_end_date: participant?.plan_end_date ?? '',
      starting_funding_amount: participant?.starting_funding_amount ?? undefined,
      status: participant?.status ?? 'active',
    } satisfies CreateParticipantFormData,
    onSubmit: async ({ value }) => {
      try {
        // Clean empty strings to undefined
        const cleanedValue = {
          full_name: value.full_name || undefined,
          ndis_number: value.ndis_number || undefined,
          plan_start_date: value.plan_start_date || undefined,
          plan_end_date: value.plan_end_date || undefined,
          starting_funding_amount: value.starting_funding_amount,
          status: value.status,
        };

        let result: Participant;
        if (isEditing) {
          result = await updateMutation.mutateAsync({
            id: participant.id,
            data: cleanedValue,
          });
        } else {
          result = await createMutation.mutateAsync(cleanedValue);
        }

        if (onSuccess) {
          onSuccess(result);
        } else {
          navigate({ to: '/participants/$participantId', params: { participantId: result.id } });
        }
      } catch {
        // Error handled by mutation state
      }
    },
    validatorAdapter: zodValidator(),
    validators: {
      onChange: createParticipantSchema,
    },
  });

  const handleCancel = () => {
    if (onCancel) {
      onCancel();
    } else {
      navigate({ to: '/participants' });
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>
          {isEditing ? 'Edit Participant' : 'Add New Participant'}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            e.stopPropagation();
            form.handleSubmit();
          }}
          className="space-y-6"
        >
          {/* Participant Info */}
          <div className="grid gap-4 sm:grid-cols-2">
            <form.Field name="full_name">
              {(field) => (
                <FieldWrapper
                  label="Full Name"
                  htmlFor="full_name"
                  errors={field.state.meta.errors}
                  touched={field.state.meta.isTouched}
                  className="sm:col-span-2"
                >
                  <Input
                    id="full_name"
                    placeholder="John Doe"
                    value={field.state.value}
                    onBlur={field.handleBlur}
                    onChange={(e) => field.handleChange(e.target.value)}
                    disabled={mutation.isPending}
                  />
                </FieldWrapper>
              )}
            </form.Field>

            <form.Field name="ndis_number">
              {(field) => (
                <FieldWrapper
                  label="NDIS Number"
                  htmlFor="ndis_number"
                  errors={field.state.meta.errors}
                  touched={field.state.meta.isTouched}
                >
                  <Input
                    id="ndis_number"
                    placeholder="123456789"
                    value={field.state.value}
                    onBlur={field.handleBlur}
                    onChange={(e) => field.handleChange(e.target.value)}
                    disabled={mutation.isPending}
                  />
                </FieldWrapper>
              )}
            </form.Field>

            <form.Field name="status">
              {(field) => (
                <FieldWrapper
                  label="Status"
                  htmlFor="status"
                  errors={field.state.meta.errors}
                  touched={field.state.meta.isTouched}
                >
                  <Select
                    value={field.state.value}
                    onValueChange={(value) => field.handleChange(value as 'active' | 'inactive')}
                    disabled={mutation.isPending}
                  >
                    <SelectTrigger id="status">
                      <SelectValue placeholder="Select status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="active">Active</SelectItem>
                      <SelectItem value="inactive">Inactive</SelectItem>
                    </SelectContent>
                  </Select>
                </FieldWrapper>
              )}
            </form.Field>
          </div>

          {/* Plan Info */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium">Plan Details</h3>
            <div className="grid gap-4 sm:grid-cols-2">
              <form.Field name="plan_start_date">
                {(field) => (
                  <FieldWrapper
                    label="Plan Start Date"
                    htmlFor="plan_start_date"
                    errors={field.state.meta.errors}
                    touched={field.state.meta.isTouched}
                  >
                    <Input
                      id="plan_start_date"
                      type="date"
                      value={field.state.value}
                      onBlur={field.handleBlur}
                      onChange={(e) => field.handleChange(e.target.value)}
                      disabled={mutation.isPending}
                    />
                  </FieldWrapper>
                )}
              </form.Field>

              <form.Field name="plan_end_date">
                {(field) => (
                  <FieldWrapper
                    label="Plan End Date"
                    htmlFor="plan_end_date"
                    errors={field.state.meta.errors}
                    touched={field.state.meta.isTouched}
                  >
                    <Input
                      id="plan_end_date"
                      type="date"
                      value={field.state.value}
                      onBlur={field.handleBlur}
                      onChange={(e) => field.handleChange(e.target.value)}
                      disabled={mutation.isPending}
                    />
                  </FieldWrapper>
                )}
              </form.Field>

              <form.Field name="starting_funding_amount">
                {(field) => (
                  <FieldWrapper
                    label="Starting Funding Amount"
                    htmlFor="starting_funding_amount"
                    errors={field.state.meta.errors}
                    touched={field.state.meta.isTouched}
                    className="sm:col-span-2"
                  >
                    <Input
                      id="starting_funding_amount"
                      type="number"
                      step="0.01"
                      min="0"
                      placeholder="50000.00"
                      value={field.state.value ?? ''}
                      onBlur={field.handleBlur}
                      onChange={(e) => {
                        const value = e.target.value === '' ? undefined : parseFloat(e.target.value);
                        field.handleChange(value);
                      }}
                      disabled={mutation.isPending}
                    />
                  </FieldWrapper>
                )}
              </form.Field>
            </div>
          </div>

          {/* Error message */}
          {mutation.isError && (
            <div className="rounded-md bg-destructive/10 p-3 text-sm text-destructive">
              {mutation.error instanceof ApiError
                ? mutation.error.message
                : 'An error occurred. Please try again.'}
            </div>
          )}

          {/* Actions */}
          <div className="flex justify-end gap-4">
            <Button type="button" variant="outline" onClick={handleCancel}>
              Cancel
            </Button>
            <form.Subscribe selector={(state) => [state.canSubmit, state.isSubmitting]}>
              {([canSubmit, isSubmitting]) => (
                <Button
                  type="submit"
                  disabled={!canSubmit || isSubmitting || mutation.isPending}
                >
                  {mutation.isPending
                    ? isEditing
                      ? 'Saving...'
                      : 'Creating...'
                    : isEditing
                      ? 'Save Changes'
                      : 'Create Participant'}
                </Button>
              )}
            </form.Subscribe>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
