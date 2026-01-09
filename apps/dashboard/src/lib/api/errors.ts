/**
 * API Error Classes
 * Typed error classes for different API error scenarios
 */

/** Base API error with status and code */
export class ApiError extends Error {
  constructor(
    message: string,
    public status: number,
    public code: string = 'UNKNOWN_ERROR',
    public details?: Record<string, string[]>
  ) {
    super(message);
    this.name = 'ApiError';
  }

  static isApiError(error: unknown): error is ApiError {
    return error instanceof ApiError;
  }
}

/** Network connectivity error */
export class NetworkError extends Error {
  constructor(message: string = 'Network error occurred. Please check your connection.') {
    super(message);
    this.name = 'NetworkError';
  }

  static isNetworkError(error: unknown): error is NetworkError {
    return error instanceof NetworkError;
  }
}

/** 401 Unauthorized - Authentication required */
export class AuthenticationError extends ApiError {
  constructor(message: string = 'Authentication required. Please log in.') {
    super(message, 401, 'AUTHENTICATION_REQUIRED');
    this.name = 'AuthenticationError';
  }
}

/** 403 Forbidden - Access denied */
export class AuthorizationError extends ApiError {
  constructor(message: string = 'Access denied. You do not have permission.') {
    super(message, 403, 'ACCESS_DENIED');
    this.name = 'AuthorizationError';
  }
}

/** 404 Not Found */
export class NotFoundError extends ApiError {
  constructor(message: string = 'Resource not found.') {
    super(message, 404, 'NOT_FOUND');
    this.name = 'NotFoundError';
  }
}

/** 422 Validation Error */
export class ValidationError extends ApiError {
  constructor(message: string, details: Record<string, string[]> = {}) {
    super(message, 422, 'VALIDATION_ERROR', details);
    this.name = 'ValidationError';
  }

  /** Get error message for a specific field */
  getFieldError(field: string): string | undefined {
    return this.details?.[field]?.[0];
  }

  /** Get all field errors as a flat object */
  getFieldErrors(): Record<string, string> {
    if (!this.details) return {};
    return Object.fromEntries(
      Object.entries(this.details).map(([key, errors]) => [key, errors[0] ?? ''])
    );
  }
}

/** 429 Rate Limit Error */
export class RateLimitError extends ApiError {
  constructor(
    message: string = 'Too many requests. Please try again later.',
    public retryAfter?: number
  ) {
    super(message, 429, 'RATE_LIMIT_EXCEEDED');
    this.name = 'RateLimitError';
  }
}

/** 500 Server Error */
export class ServerError extends ApiError {
  constructor(message: string = 'Server error. Please try again later.') {
    super(message, 500, 'SERVER_ERROR');
    this.name = 'ServerError';
  }
}

/** Create appropriate error class based on status code */
export function createApiError(
  status: number,
  message: string,
  code?: string,
  details?: Record<string, string[]>
): ApiError {
  switch (status) {
    case 401:
      return new AuthenticationError(message);
    case 403:
      return new AuthorizationError(message);
    case 404:
      return new NotFoundError(message);
    case 422:
      return new ValidationError(message, details);
    case 429:
      return new RateLimitError(message);
    case 500:
    case 502:
    case 503:
    case 504:
      return new ServerError(message);
    default:
      return new ApiError(message, status, code, details);
  }
}
