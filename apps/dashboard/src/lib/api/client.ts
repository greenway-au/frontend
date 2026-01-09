/**
 * API Client
 * Enhanced fetch-based client with interceptors and error handling
 */

import type { ApiErrorResponse } from '@/types/api';
import { getAccessToken, clearStoredTokens } from './token';
import { createApiError, NetworkError, AuthenticationError } from './errors';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080';

/** Request configuration */
export interface RequestConfig extends Omit<RequestInit, 'body'> {
  /** Skip authorization header */
  skipAuth?: boolean;
  /** Request body (will be JSON stringified) */
  body?: unknown;
  /** Query parameters */
  params?: Record<string, string | number | boolean | undefined>;
}

/** Interceptor types */
type RequestInterceptor = (config: RequestConfig) => RequestConfig | Promise<RequestConfig>;
type ResponseInterceptor = (response: Response) => Response | Promise<Response>;
type ErrorInterceptor = (error: Error) => Error | Promise<never>;

/**
 * API Client with interceptors and typed error handling
 */
class ApiClient {
  private baseUrl: string;
  private requestInterceptors: RequestInterceptor[] = [];
  private responseInterceptors: ResponseInterceptor[] = [];
  private errorInterceptors: ErrorInterceptor[] = [];

  constructor(baseUrl: string) {
    this.baseUrl = baseUrl;
  }

  /** Add request interceptor */
  addRequestInterceptor(interceptor: RequestInterceptor): () => void {
    this.requestInterceptors.push(interceptor);
    return () => {
      const index = this.requestInterceptors.indexOf(interceptor);
      if (index > -1) this.requestInterceptors.splice(index, 1);
    };
  }

  /** Add response interceptor */
  addResponseInterceptor(interceptor: ResponseInterceptor): () => void {
    this.responseInterceptors.push(interceptor);
    return () => {
      const index = this.responseInterceptors.indexOf(interceptor);
      if (index > -1) this.responseInterceptors.splice(index, 1);
    };
  }

  /** Add error interceptor */
  addErrorInterceptor(interceptor: ErrorInterceptor): () => void {
    this.errorInterceptors.push(interceptor);
    return () => {
      const index = this.errorInterceptors.indexOf(interceptor);
      if (index > -1) this.errorInterceptors.splice(index, 1);
    };
  }

  private async applyRequestInterceptors(config: RequestConfig): Promise<RequestConfig> {
    let result = config;
    for (const interceptor of this.requestInterceptors) {
      result = await interceptor(result);
    }
    return result;
  }

  private async applyResponseInterceptors(response: Response): Promise<Response> {
    let result = response;
    for (const interceptor of this.responseInterceptors) {
      result = await interceptor(result);
    }
    return result;
  }

  private async applyErrorInterceptors(error: Error): Promise<never> {
    let result = error;
    for (const interceptor of this.errorInterceptors) {
      result = await interceptor(result);
    }
    throw result;
  }

  /** Build URL with query parameters */
  private buildUrl(endpoint: string, params?: Record<string, string | number | boolean | undefined>): string {
    const url = new URL(endpoint, this.baseUrl);

    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined) {
          url.searchParams.set(key, String(value));
        }
      });
    }

    return url.toString();
  }

  /** Main request method */
  private async request<T>(endpoint: string, config: RequestConfig = {}): Promise<T> {
    const { skipAuth = false, params, body, ...fetchConfig } = config;

    // Build headers
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      Accept: 'application/json',
      ...(fetchConfig.headers as Record<string, string>),
    };

    // Add auth token unless skipped
    if (!skipAuth) {
      const token = getAccessToken();
      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
      }
    }

    let finalConfig: RequestConfig = {
      ...fetchConfig,
      headers,
      credentials: 'include',
      body: body !== undefined ? body : undefined,
    };

    // Apply request interceptors
    finalConfig = await this.applyRequestInterceptors(finalConfig);

    const url = this.buildUrl(endpoint, params);

    let response: Response;
    try {
      response = await fetch(url, {
        ...finalConfig,
        body: finalConfig.body ? JSON.stringify(finalConfig.body) : undefined,
      });
    } catch (error) {
      const networkError = new NetworkError();
      return this.applyErrorInterceptors(networkError);
    }

    // Apply response interceptors
    response = await this.applyResponseInterceptors(response);

    if (!response.ok) {
      let errorData: ApiErrorResponse = {
        message: `HTTP ${response.status}: ${response.statusText}`,
        code: 'HTTP_ERROR',
      };

      try {
        const json = await response.json();
        errorData = {
          message: json.message ?? json.error ?? errorData.message,
          code: json.code ?? errorData.code,
          details: json.details ?? json.errors,
        };
      } catch {
        // Use default error data
      }

      const error = createApiError(
        response.status,
        errorData.message,
        errorData.code,
        errorData.details
      );

      // Handle 401 - clear tokens
      if (error instanceof AuthenticationError) {
        clearStoredTokens();
      }

      return this.applyErrorInterceptors(error);
    }

    // Handle 204 No Content
    if (response.status === 204) {
      return undefined as T;
    }

    return response.json();
  }

  /** GET request */
  get<T>(endpoint: string, config?: RequestConfig): Promise<T> {
    return this.request<T>(endpoint, { ...config, method: 'GET' });
  }

  /** POST request */
  post<T>(endpoint: string, data?: unknown, config?: RequestConfig): Promise<T> {
    return this.request<T>(endpoint, {
      ...config,
      method: 'POST',
      body: data,
    });
  }

  /** PUT request */
  put<T>(endpoint: string, data?: unknown, config?: RequestConfig): Promise<T> {
    return this.request<T>(endpoint, {
      ...config,
      method: 'PUT',
      body: data,
    });
  }

  /** PATCH request */
  patch<T>(endpoint: string, data?: unknown, config?: RequestConfig): Promise<T> {
    return this.request<T>(endpoint, {
      ...config,
      method: 'PATCH',
      body: data,
    });
  }

  /** DELETE request */
  delete<T>(endpoint: string, config?: RequestConfig): Promise<T> {
    return this.request<T>(endpoint, { ...config, method: 'DELETE' });
  }
}

/** Singleton API client instance */
export const api = new ApiClient(API_BASE_URL);

export { ApiClient };
