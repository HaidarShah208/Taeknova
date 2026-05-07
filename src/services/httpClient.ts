import axios, { type AxiosInstance, type InternalAxiosRequestConfig } from 'axios';

import { STORAGE_KEYS } from '@constants/app';
import env from '@lib/env';
import { localStore } from '@utils/storage';

export const httpClient: AxiosInstance = axios.create({
  baseURL: env.apiBaseUrl,
  timeout: 15_000,
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  },
});

httpClient.interceptors.request.use((config: InternalAxiosRequestConfig) => {
  const token = localStore.get<string | null>(STORAGE_KEYS.authToken, null);
  if (token) {
    config.headers.set('Authorization', `Bearer ${token}`);
  }
  return config;
});

httpClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (env.isDev) {
      console.error('[HTTP]', error?.response?.status, error?.response?.data ?? error.message);
    }
    return Promise.reject(error);
  },
);
