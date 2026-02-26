/**
 * Unified Authenticated API Client
 *
 * All authenticated API calls should use this client.
 * Uses REACT_APP_API_URL as the base URL (includes /v1 prefix).
 * Automatically adds fresh Firebase tokens to every request.
 */

import axios from "axios";
import { auth } from "../firebase-config";

// ============================================================================
// Configuration
// ============================================================================

/**
 * Base URL for authenticated API endpoints.
 * Should be set in .env as REACT_APP_API_URL (e.g., http://localhost:8080/v1)
 */
const API_BASE_URL = process.env.REACT_APP_API_URL;

// ============================================================================
// Axios Instance
// ============================================================================

/**
 * Authenticated axios client.
 * All requests automatically include:
 * - Fresh Firebase ID token (auto-refreshes if expired)
 * - Content-Type: application/json
 */
const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
    "ngrok-skip-browser-warning": "true", // For ngrok tunnels during development
  },
});

// ============================================================================
// Request Interceptor - Add Fresh Firebase Token
// ============================================================================

apiClient.interceptors.request.use(
  async (config) => {
    const user = auth.currentUser;

    if (user) {
      try {
        // getIdToken() automatically refreshes the token if expired
        const token = await user.getIdToken();
        config.headers.Authorization = `Bearer ${token}`;
      } catch (error) {
        console.error("Failed to get Firebase token for API request:", error);
        // Let request proceed without token
      }
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  },
);

// ============================================================================
// Response Interceptor - Handle Auth Errors
// ============================================================================

apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === 401) {
      console.warn("API returned 401 - user may need to re-authenticate");
      // AuthContext + ProtectedRoute handle redirects
    }

    return Promise.reject(error);
  },
);

// ============================================================================
// Exports
// ============================================================================

export default apiClient;

/**
 * Export HTTP methods for convenience
 */
export const api = {
  get: apiClient.get.bind(apiClient),
  post: apiClient.post.bind(apiClient),
  put: apiClient.put.bind(apiClient),
  patch: apiClient.patch.bind(apiClient),
  delete: apiClient.delete.bind(apiClient),
};
