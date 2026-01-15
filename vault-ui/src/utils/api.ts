/**
 * API request utilities
 */

import { logger } from './logger';

export interface RequestConfig extends RequestInit {
  timeout?: number;
  retries?: number;
  retryDelay?: number;
}

export interface ApiResponse<T = any> {
  data: T;
  status: number;
  headers: Headers;
}

export class ApiError extends Error {
  constructor(
    message: string,
    public status: number,
    public response?: any
  ) {
    super(message);
    this.name = 'ApiError';
  }
}

/**
 * Make API request with timeout and retries
 */
export async function apiRequest<T = any>(
  url: string,
  config: RequestConfig = {}
): Promise<ApiResponse<T>> {
  const {
    timeout = 30000,
    retries = 3,
    retryDelay = 1000,
    ...fetchConfig
  } = config;

  let lastError: Error | null = null;

  for (let attempt = 0; attempt < retries; attempt++) {
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), timeout);

      const response = await fetch(url, {
        ...fetchConfig,
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new ApiError(
          errorData.message || `Request failed with status ${response.status}`,
          response.status,
          errorData
        );
      }

      const data = await response.json();

      return {
        data,
        status: response.status,
        headers: response.headers,
      };
    } catch (error: any) {
      lastError = error;

      if (error.name === 'AbortError') {
        logger.error(`Request timeout after ${timeout}ms:`, url);
      } else {
        logger.error(`Request failed (attempt ${attempt + 1}/${retries}):`, error);
      }

      // Don't retry on client errors (4xx)
      if (error instanceof ApiError && error.status >= 400 && error.status < 500) {
        throw error;
      }

      // Wait before retrying
      if (attempt < retries - 1) {
        await new Promise(resolve => setTimeout(resolve, retryDelay * (attempt + 1)));
      }
    }
  }

  throw lastError || new Error('Request failed');
}

/**
 * GET request
 */
export async function apiGet<T = any>(
  url: string,
  config?: RequestConfig
): Promise<ApiResponse<T>> {
  return apiRequest<T>(url, { ...config, method: 'GET' });
}

/**
 * POST request
 */
export async function apiPost<T = any>(
  url: string,
  data?: any,
  config?: RequestConfig
): Promise<ApiResponse<T>> {
  return apiRequest<T>(url, {
    ...config,
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      ...config?.headers,
    },
    body: JSON.stringify(data),
  });
}

/**
 * PUT request
 */
export async function apiPut<T = any>(
  url: string,
  data?: any,
  config?: RequestConfig
): Promise<ApiResponse<T>> {
  return apiRequest<T>(url, {
    ...config,
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      ...config?.headers,
    },
    body: JSON.stringify(data),
  });
}

/**
 * DELETE request
 */
export async function apiDelete<T = any>(
  url: string,
  config?: RequestConfig
): Promise<ApiResponse<T>> {
  return apiRequest<T>(url, { ...config, method: 'DELETE' });
}

/**
 * Create API client with base URL and default config
 */
export function createApiClient(baseURL: string, defaultConfig?: RequestConfig) {
  return {
    get: <T = any>(path: string, config?: RequestConfig) =>
      apiGet<T>(`${baseURL}${path}`, { ...defaultConfig, ...config }),
    
    post: <T = any>(path: string, data?: any, config?: RequestConfig) =>
      apiPost<T>(`${baseURL}${path}`, data, { ...defaultConfig, ...config }),
    
    put: <T = any>(path: string, data?: any, config?: RequestConfig) =>
      apiPut<T>(`${baseURL}${path}`, data, { ...defaultConfig, ...config }),
    
    delete: <T = any>(path: string, config?: RequestConfig) =>
      apiDelete<T>(`${baseURL}${path}`, { ...defaultConfig, ...config }),
  };
}

/**
 * Build query string from params
 */
export function buildQueryString(params: Record<string, any>): string {
  const searchParams = new URLSearchParams();
  
  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null) {
      if (Array.isArray(value)) {
        value.forEach(v => searchParams.append(key, String(v)));
      } else {
        searchParams.append(key, String(value));
      }
    }
  });
  
  const queryString = searchParams.toString();
  return queryString ? `?${queryString}` : '';
}

/**
 * Parse query string to params
 */
export function parseQueryString(queryString: string): Record<string, string | string[]> {
  const params: Record<string, string | string[]> = {};
  const searchParams = new URLSearchParams(queryString);
  
  searchParams.forEach((value, key) => {
    if (params[key]) {
      if (Array.isArray(params[key])) {
        (params[key] as string[]).push(value);
      } else {
        params[key] = [params[key] as string, value];
      }
    } else {
      params[key] = value;
    }
  });
  
  return params;
}

/**
 * Download file from URL
 */
export async function downloadFile(url: string, filename: string): Promise<void> {
  try {
    const response = await fetch(url);
    const blob = await response.blob();
    const objectUrl = URL.createObjectURL(blob);
    
    const link = document.createElement('a');
    link.href = objectUrl;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    URL.revokeObjectURL(objectUrl);
  } catch (error) {
    logger.error('Failed to download file:', error);
    throw error;
  }
}

/**
 * Upload file
 */
export async function uploadFile(
  url: string,
  file: File,
  config?: RequestConfig
): Promise<ApiResponse> {
  const formData = new FormData();
  formData.append('file', file);
  
  return apiRequest(url, {
    ...config,
    method: 'POST',
    body: formData,
  });
}
