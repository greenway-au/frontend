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
import { Textarea } from '@workspace/ui/components/textarea';
import { FieldWrapper } from '@/components/common/form';
import { useCreateParticipant, useUpdateParticipant } from '../api/participants.queries';
import {
  createParticipantSchema,
  type CreateParticipantInput,
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
      ndisNumber: participant?.ndisNumber ?? '',
      firstName: participant?.firstName ?? '',
      lastName: participant?.lastName ?? '',
      dateOfBirth: participant?.dateOfBirth ?? '',
      email: participant?.email ?? '',
      phone: participant?.phone ?? '',
      address: {
        street: participant?.address.street ?? '',
        suburb: participant?.address.suburb ?? '',
        state: participant?.address.state ?? '',
        postcode: participant?.address.postcode ?? '',
      },
      notes: participant?.notes ?? '',
    } satisfies CreateParticipantInput,
    onSubmit: async ({ value }) => {
      try {
        let result: Participant;
        if (isEditing) {
          result = await updateMutation.mutateAsync({
            id: participant.id,
            data: value,
          });
        } else {
          result = await createMutation.mutateAsync(value);
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
          {/* Basic Info */}
          <div className="grid gap-4 sm:grid-cols-2">
            <form.Field name="ndisNumber">
              {(field) => (
                <FieldWrapper
                  label="NDIS Number"
                  htmlFor="ndisNumber"
                  errors={field.state.meta.errors}
                  touched={field.state.meta.isTouched}
                  required
                >
                  <Input
                    id="ndisNumber"
                    placeholder="123456789"
                    value={field.state.value}
                    onBlur={field.handleBlur}
                    onChange={(e) => field.handleChange(e.target.value)}
                    disabled={mutation.isPending}
                  />
                </FieldWrapper>
              )}
            </form.Field>

            <form.Field name="dateOfBirth">
              {(field) => (
                <FieldWrapper
                  label="Date of Birth"
                  htmlFor="dateOfBirth"
                  errors={field.state.meta.errors}
                  touched={field.state.meta.isTouched}
                  required
                >
                  <Input
                    id="dateOfBirth"
                    type="date"
                    value={field.state.value}
                    onBlur={field.handleBlur}
                    onChange={(e) => field.handleChange(e.target.value)}
                    disabled={mutation.isPending}
                  />
                </FieldWrapper>
              )}
            </form.Field>

            <form.Field name="firstName">
              {(field) => (
                <FieldWrapper
                  label="First Name"
                  htmlFor="firstName"
                  errors={field.state.meta.errors}
                  touched={field.state.meta.isTouched}
                  required
                >
                  <Input
                    id="firstName"
                    placeholder="John"
                    value={field.state.value}
                    onBlur={field.handleBlur}
                    onChange={(e) => field.handleChange(e.target.value)}
                    disabled={mutation.isPending}
                  />
                </FieldWrapper>
              )}
            </form.Field>

            <form.Field name="lastName">
              {(field) => (
                <FieldWrapper
                  label="Last Name"
                  htmlFor="lastName"
                  errors={field.state.meta.errors}
                  touched={field.state.meta.isTouched}
                  required
                >
                  <Input
                    id="lastName"
                    placeholder="Doe"
                    value={field.state.value}
                    onBlur={field.handleBlur}
                    onChange={(e) => field.handleChange(e.target.value)}
                    disabled={mutation.isPending}
                  />
                </FieldWrapper>
              )}
            </form.Field>

            <form.Field name="email">
              {(field) => (
                <FieldWrapper
                  label="Email"
                  htmlFor="email"
                  errors={field.state.meta.errors}
                  touched={field.state.meta.isTouched}
                >
                  <Input
                    id="email"
                    type="email"
                    placeholder="john@example.com"
                    value={field.state.value}
                    onBlur={field.handleBlur}
                    onChange={(e) => field.handleChange(e.target.value)}
                    disabled={mutation.isPending}
                  />
                </FieldWrapper>
              )}
            </form.Field>

            <form.Field name="phone">
              {(field) => (
                <FieldWrapper
                  label="Phone"
                  htmlFor="phone"
                  errors={field.state.meta.errors}
                  touched={field.state.meta.isTouched}
                >
                  <Input
                    id="phone"
                    placeholder="0400 000 000"
                    value={field.state.value}
                    onBlur={field.handleBlur}
                    onChange={(e) => field.handleChange(e.target.value)}
                    disabled={mutation.isPending}
                  />
                </FieldWrapper>
              )}
            </form.Field>
          </div>

          {/* Address */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium">Address</h3>
            <div className="grid gap-4 sm:grid-cols-2">
              <form.Field name="address.street">
                {(field) => (
                  <FieldWrapper
                    label="Street"
                    htmlFor="address.street"
                    errors={field.state.meta.errors}
                    touched={field.state.meta.isTouched}
                    required
                    className="sm:col-span-2"
                  >
                    <Input
                      id="address.street"
                      placeholder="123 Main St"
                      value={field.state.value}
                      onBlur={field.handleBlur}
                      onChange={(e) => field.handleChange(e.target.value)}
                      disabled={mutation.isPending}
                    />
                  </FieldWrapper>
                )}
              </form.Field>

              <form.Field name="address.suburb">
                {(field) => (
                  <FieldWrapper
                    label="Suburb"
                    htmlFor="address.suburb"
                    errors={field.state.meta.errors}
                    touched={field.state.meta.isTouched}
                    required
                  >
                    <Input
                      id="address.suburb"
                      placeholder="Sydney"
                      value={field.state.value}
                      onBlur={field.handleBlur}
                      onChange={(e) => field.handleChange(e.target.value)}
                      disabled={mutation.isPending}
                    />
                  </FieldWrapper>
                )}
              </form.Field>

              <form.Field name="address.state">
                {(field) => (
                  <FieldWrapper
                    label="State"
                    htmlFor="address.state"
                    errors={field.state.meta.errors}
                    touched={field.state.meta.isTouched}
                    required
                  >
                    <Input
                      id="address.state"
                      placeholder="NSW"
                      value={field.state.value}
                      onBlur={field.handleBlur}
                      onChange={(e) => field.handleChange(e.target.value)}
                      disabled={mutation.isPending}
                    />
                  </FieldWrapper>
                )}
              </form.Field>

              <form.Field name="address.postcode">
                {(field) => (
                  <FieldWrapper
                    label="Postcode"
                    htmlFor="address.postcode"
                    errors={field.state.meta.errors}
                    touched={field.state.meta.isTouched}
                    required
                  >
                    <Input
                      id="address.postcode"
                      placeholder="2000"
                      value={field.state.value}
                      onBlur={field.handleBlur}
                      onChange={(e) => field.handleChange(e.target.value)}
                      disabled={mutation.isPending}
                    />
                  </FieldWrapper>
                )}
              </form.Field>
            </div>
          </div>

          {/* Notes */}
          <form.Field name="notes">
            {(field) => (
              <FieldWrapper
                label="Notes"
                htmlFor="notes"
                errors={field.state.meta.errors}
                touched={field.state.meta.isTouched}
              >
                <Textarea
                  id="notes"
                  placeholder="Additional notes..."
                  value={field.state.value}
                  onBlur={field.handleBlur}
                  onChange={(e) => field.handleChange(e.target.value)}
                  disabled={mutation.isPending}
                  rows={4}
                />
              </FieldWrapper>
            )}
          </form.Field>

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
