/**
 * Common Types
 * Shared entity types and utility types
 */

/** Base entity with timestamps */
export interface BaseEntity {
  id: string;
  createdAt: string;
  updatedAt: string;
}

/** Audit fields for tracking changes */
export interface Auditable {
  createdBy: string;
  updatedBy: string;
}

/** Common status values */
export type Status = 'active' | 'inactive' | 'pending' | 'archived';

/** Address structure */
export interface Address {
  street: string;
  suburb: string;
  state: string;
  postcode: string;
}

/** Australian states */
export type AustralianState = 'NSW' | 'VIC' | 'QLD' | 'WA' | 'SA' | 'TAS' | 'ACT' | 'NT';

/** Contact information */
export interface ContactInfo {
  email?: string;
  phone?: string;
  mobile?: string;
}

/** Make all properties optional recursively */
export type DeepPartial<T> = {
  [P in keyof T]?: T[P] extends object ? DeepPartial<T[P]> : T[P];
};

/** Extract the resolved type from a Promise */
export type Awaited<T> = T extends Promise<infer U> ? U : T;

/** Make specific keys required */
export type RequireKeys<T, K extends keyof T> = T & Required<Pick<T, K>>;
