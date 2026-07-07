import axios from 'axios';
import {
  getDefaultSuccessMessage,
  showApiError,
  showApiSuccess,
} from '../lib/api-toast';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://127.0.0.1:3000',
  headers: {
    'Content-Type': 'application/json',
  },
});

const MUTATION_METHODS = new Set(['post', 'put', 'patch', 'delete']);

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('authToken');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (response) => {
    const method = response.config.method?.toLowerCase();

    if (MUTATION_METHODS.has(method) && !response.config.skipSuccessToast) {
      const fallback =
        response.config.successMessage ?? getDefaultSuccessMessage(method);
      showApiSuccess(response, fallback);
    }

    return response;
  },
  (error) => {
    if (!error.config?.skipErrorToast) {
      showApiError(error);
    }

    return Promise.reject(error);
  }
);

export default api;
