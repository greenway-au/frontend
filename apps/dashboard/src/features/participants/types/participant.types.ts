/**
 * Participant Types
 * Type definitions for participant entities
 */

import type { BaseEntity, Address } from '@/types/common';

/** Participant status values */
export type ParticipantStatus = 'active' | 'inactive' | 'pending_approval';

/** NDIS Plan status */
export type PlanStatus = 'active' | 'expired' | 'pending';

/** NDIS Plan entity */
export interface Plan {
  id: string;
  startDate: string;
  endDate: string;
  totalBudget: number;
  usedBudget: number;
  remainingBudget: number;
  status: PlanStatus;
}

/** Participant entity */
export interface Participant extends BaseEntity {
  ndisNumber: string;
  firstName: string;
  lastName: string;
  dateOfBirth: string;
  email?: string;
  phone?: string;
  address: Address;
  status: ParticipantStatus;
  plans: Plan[];
  notes?: string;
}

/** Computed participant properties */
export interface ParticipantWithComputed extends Participant {
  fullName: string;
  age: number;
  activePlan: Plan | null;
}

/** Create participant payload */
export interface CreateParticipantPayload {
  ndisNumber: string;
  firstName: string;
  lastName: string;
  dateOfBirth: string;
  email?: string;
  phone?: string;
  address: Address;
  notes?: string;
}

/** Update participant payload */
export interface UpdateParticipantPayload extends Partial<CreateParticipantPayload> {
  status?: ParticipantStatus;
}

/** Participant list filters */
export interface ParticipantFilters {
  search?: string;
  status?: ParticipantStatus;
  page?: number;
  limit?: number;
}

/** Participant list item (lighter version for lists) */
export interface ParticipantListItem {
  id: string;
  ndisNumber: string;
  firstName: string;
  lastName: string;
  email?: string;
  phone?: string;
  status: ParticipantStatus;
  activePlanBudget?: number;
  createdAt: string;
}
