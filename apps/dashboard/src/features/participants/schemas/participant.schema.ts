/**
 * Participant Schemas
 * Zod schemas for participant form validation
 */

import { z } from 'zod';

/** Australian postcode regex */
const postcodeRegex = /^\d{4}$/;

/** NDIS number regex (9 digits) */
const ndisNumberRegex = /^\d{9}$/;

/** Address schema */
export const addressSchema = z.object({
  street: z.string().min(1, 'Street address is required'),
  suburb: z.string().min(1, 'Suburb is required'),
  state: z.string().min(1, 'State is required'),
  postcode: z
    .string()
    .min(1, 'Postcode is required')
    .regex(postcodeRegex, 'Postcode must be 4 digits'),
});

/** Create participant schema */
export const createParticipantSchema = z.object({
  ndisNumber: z
    .string()
    .min(1, 'NDIS number is required')
    .regex(ndisNumberRegex, 'NDIS number must be exactly 9 digits'),
  firstName: z
    .string()
    .min(1, 'First name is required')
    .max(50, 'First name must be less than 50 characters'),
  lastName: z
    .string()
    .min(1, 'Last name is required')
    .max(50, 'Last name must be less than 50 characters'),
  dateOfBirth: z
    .string()
    .min(1, 'Date of birth is required')
    .regex(/^\d{4}-\d{2}-\d{2}$/, 'Invalid date format (YYYY-MM-DD)'),
  email: z
    .string()
    .email('Invalid email address')
    .optional()
    .or(z.literal('')),
  phone: z
    .string()
    .optional()
    .or(z.literal('')),
  address: addressSchema,
  notes: z.string().optional(),
});

export type CreateParticipantInput = z.infer<typeof createParticipantSchema>;

/** Update participant schema (all fields optional) */
export const updateParticipantSchema = createParticipantSchema.partial().extend({
  status: z.enum(['active', 'inactive', 'pending_approval']).optional(),
});

export type UpdateParticipantInput = z.infer<typeof updateParticipantSchema>;

/** Participant search/filter schema */
export const participantFiltersSchema = z.object({
  search: z.string().optional(),
  status: z.enum(['active', 'inactive', 'pending_approval']).optional(),
  page: z.number().min(1).optional(),
  limit: z.number().min(1).max(100).optional(),
});

export type ParticipantFiltersInput = z.infer<typeof participantFiltersSchema>;
