// Base API service for making HTTP requests

interface RequestConfig {
  method?: 'GET' | 'POST' | 'PUT' | 'DELETE';
  headers?: Record<string, string>;
  body?: unknown;
  signal?: AbortSignal;
}

interface ApiError {
  message: string;
  status: number;
  code?: string;
}

class ApiService {
  private baseUrl: string;
  private defaultHeaders: Record<string, string>;

  constructor(baseUrl: string = '') {
    this.baseUrl = baseUrl;
    this.defaultHeaders = {
      'Content-Type': 'application/json',
    };
  }

  private async request<T>(endpoint: string, config: RequestConfig = {}): Promise<T> {
    const { method = 'GET', headers = {}, body, signal } = config;

    const url = `${this.baseUrl}${endpoint}`;
    
    const response = await fetch(url, {
      method,
      headers: { ...this.defaultHeaders, ...headers },
      body: body ? JSON.stringify(body) : undefined,
      signal,
    });

    if (!response.ok) {
      const error: ApiError = {
        message: `HTTP error ${response.status}`,
        status: response.status,
      };
      
      try {
        const errorData = await response.json();
        error.message = errorData.message || error.message;
        error.code = errorData.code;
      } catch {
        // Ignore JSON parse errors
      }
      
      throw error;
    }

    return response.json();
  }

  async get<T>(endpoint: string, signal?: AbortSignal): Promise<T> {
    return this.request<T>(endpoint, { method: 'GET', signal });
  }

  async post<T>(endpoint: string, body: unknown, signal?: AbortSignal): Promise<T> {
    return this.request<T>(endpoint, { method: 'POST', body, signal });
  }

  async put<T>(endpoint: string, body: unknown, signal?: AbortSignal): Promise<T> {
    return this.request<T>(endpoint, { method: 'PUT', body, signal });
  }

  async delete<T>(endpoint: string, signal?: AbortSignal): Promise<T> {
    return this.request<T>(endpoint, { method: 'DELETE', signal });
  }

  setHeader(key: string, value: string): void {
    this.defaultHeaders[key] = value;
  }

  removeHeader(key: string): void {
    delete this.defaultHeaders[key];
  }
}

export const api = new ApiService();
export type { ApiError };
