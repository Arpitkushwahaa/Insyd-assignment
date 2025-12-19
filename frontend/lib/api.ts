import axios, { InternalAxiosRequestConfig, AxiosResponse, AxiosError } from 'axios';

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

// add auth token to requests
api.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    // No auth required
    return config;
  },
  (error: AxiosError) => {
    return Promise.reject(error);
  }
);

// handle response errors
api.interceptors.response.use(
  (response: AxiosResponse) => response,
  (error: AxiosError) => {
    return Promise.reject(error);
  }
);

export default api;
