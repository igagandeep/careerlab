/**
 * API Client Configuration
 * Centralized fetch wrapper with error handling and auth
 */

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

export class ApiError extends Error {
  constructor(
    message: string,
    public status: number,
    public data?: any
  ) {
    super(message);
    this.name = 'ApiError';
  }
}

interface RequestConfig extends RequestInit {
  params?: Record<string, string>;
}

/**
 * Base fetch wrapper with automatic error handling
 */
async function fetchApi<T>(
  endpoint: string,
  config: RequestConfig = {}
): Promise<T> {
  const { params, ...fetchConfig } = config;

  // Build URL with query params
  let url = `${API_URL}${endpoint}`;
  if (params) {
    const searchParams = new URLSearchParams(params);
    url += `?${searchParams.toString()}`;
  }

  // Default headers - only set Content-Type for non-FormData requests
  const headers: HeadersInit = {
    ...fetchConfig.headers,
  };

  // Only set Content-Type for non-FormData requests
  if (!(fetchConfig.body instanceof FormData)) {
    headers['Content-Type'] = 'application/json';
  }

  try {
    const response = await fetch(url, {
      ...fetchConfig,
      headers,
      credentials: 'include', // Include cookies for session management
    });

    // Handle non-JSON responses
    const contentType = response.headers.get('content-type');
    const isJson = contentType?.includes('application/json');

    if (!response.ok) {
      const errorData = isJson ? await response.json() : await response.text();
      throw new ApiError(
        errorData?.message || 'An error occurred',
        response.status,
        errorData
      );
    }

    // Return parsed JSON or null for 204 No Content
    if (response.status === 204) {
      return null as T;
    }

    // Parse response based on content type
    if (isJson) {
      const jsonData = await response.json();
      return jsonData as T;
    } else {
      const textData = await response.text();
      return textData as unknown as T;
    }
  } catch (error) {
    if (error instanceof ApiError) {
      throw error;
    }
    // Network errors
    throw new ApiError(
      'Network error. Please check your connection.',
      0,
      error
    );
  }
}

/**
 * HTTP Methods
 */
export const api = {
  get: <T>(endpoint: string, config?: RequestConfig) =>
    fetchApi<T>(endpoint, { ...config, method: 'GET' }),

  post: <T>(endpoint: string, data?: any, config?: RequestConfig) =>
    fetchApi<T>(endpoint, {
      ...config,
      method: 'POST',
      body: data ? JSON.stringify(data) : undefined,
    }),

  put: <T>(endpoint: string, data?: any, config?: RequestConfig) =>
    fetchApi<T>(endpoint, {
      ...config,
      method: 'PUT',
      body: data ? JSON.stringify(data) : undefined,
    }),

  patch: <T>(endpoint: string, data?: any, config?: RequestConfig) =>
    fetchApi<T>(endpoint, {
      ...config,
      method: 'PATCH',
      body: data ? JSON.stringify(data) : undefined,
    }),

  delete: <T>(endpoint: string, config?: RequestConfig) =>
    fetchApi<T>(endpoint, { ...config, method: 'DELETE' }),

  // For file uploads
  upload: <T>(endpoint: string, formData: FormData, config?: RequestConfig) =>
    fetchApi<T>(endpoint, {
      ...config,
      method: 'POST',
      body: formData,
    }),
};

export default api;
