import { z } from 'zod';

export const createParticipantSchema = z.object({
  full_name: z.string().max(255).optional().or(z.literal('')),
  ndis_number: z.string().max(50).optional().or(z.literal('')),
  plan_start_date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/).optional().or(z.literal('')),
  plan_end_date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/).optional().or(z.literal('')),
  starting_funding_amount: z.number().min(0).optional().nullable(),
  status: z.enum(['active', 'inactive']).optional(),
});

export const updateParticipantSchema = createParticipantSchema.partial();

export type CreateParticipantFormData = z.infer<typeof createParticipantSchema>;
export type UpdateParticipantFormData = z.infer<typeof updateParticipantSchema>;
