// frontend/src/lib/api-client.ts
import axios, { AxiosError, InternalAxiosRequestConfig } from 'axios';

// Base API URL from environment variable
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api';

// Create axios instance with default config
export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000, // 10 second timeout
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor - Add JWT token to all requests
apiClient.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    // Only add token in browser (not during SSR)
    if (typeof window !== 'undefined') {
      const token = localStorage.getItem('jwt');
      if (token && config.headers) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor - Handle errors globally
apiClient.interceptors.response.use(
  (response) => {
    // Return successful responses as-is
    return response;
  },
  (error: AxiosError) => {
    // Handle different error types
    if (error.response) {
      const status = error.response.status;

      switch (status) {
        case 401:
          // Unauthorized - clear token and redirect to login
          if (typeof window !== 'undefined') {
            localStorage.removeItem('jwt');
            localStorage.removeItem('userId');
            // Only redirect if not already on login page
            if (!window.location.pathname.includes('/login')) {
              window.location.href = '/login';
            }
          }
          break;

        case 403:
          console.error('Forbidden: You do not have permission to access this resource');
          break;

        case 404:
          console.error('Not Found: The requested resource does not exist');
          break;

        case 409:
          console.error('Conflict: Resource already exists');
          break;

        case 500:
          console.error('Server Error: Something went wrong on the server');
          break;

        default:
          console.error(`API Error (${status}):`, error.response.data);
      }
    } else if (error.request) {
      // Network error - no response received
      console.error('Network Error: Could not connect to the server');
    } else {
      // Something else happened
      console.error('Request Error:', error.message);
    }

    return Promise.reject(error);
  }
);

// Type-safe API helper functions
export const api = {
  // GET request
  get: <T = any>(url: string, config = {}) => {
    return apiClient.get<T>(url, config).then((res) => res.data);
  },

  // POST request
  post: <T = any>(url: string, data?: any, config = {}) => {
    return apiClient.post<T>(url, data, config).then((res) => res.data);
  },

  // PUT request
  put: <T = any>(url: string, data?: any, config = {}) => {
    return apiClient.put<T>(url, data, config).then((res) => res.data);
  },

  // PATCH request
  patch: <T = any>(url: string, data?: any, config = {}) => {
    return apiClient.patch<T>(url, data, config).then((res) => res.data);
  },

  // DELETE request
  delete: <T = any>(url: string, config = {}) => {
    return apiClient.delete<T>(url, config).then((res) => res.data);
  },
};

// Export default for convenience
export default apiClient;