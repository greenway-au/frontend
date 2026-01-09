/**
 * API Response Types
 * Standard response wrappers for API communication
 */

/** Generic API response wrapper */
export interface ApiResponse<T> {
  data: T;
  message?: string;
  meta?: PaginationMeta;
}

/** Pagination metadata for list endpoints */
export interface PaginationMeta {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

/** Standard error response from API */
export interface ApiErrorResponse {
  message: string;
  code: string;
  details?: Record<string, string[]>;
}

/** Paginated list response */
export interface PaginatedResponse<T> {
  items: T[];
  meta: PaginationMeta;
}

/** Sort direction for list queries */
export type SortDirection = 'asc' | 'desc';

/** Base query parameters for list endpoints */
export interface ListQueryParams {
  page?: number;
  limit?: number;
  search?: string;
  sortBy?: string;
  sortDirection?: SortDirection;
}
