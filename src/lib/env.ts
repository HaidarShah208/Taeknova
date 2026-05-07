interface AppEnv {
  readonly apiBaseUrl: string;
  readonly appName: string;
  readonly enableMockApi: boolean;
  readonly isProd: boolean;
  readonly isDev: boolean;
}

const env: AppEnv = {
  apiBaseUrl: import.meta.env.VITE_API_BASE_URL ?? '/api',
  appName: import.meta.env.VITE_APP_NAME ?? 'Tikwando',
  enableMockApi: (import.meta.env.VITE_ENABLE_MOCK_API ?? 'true') === 'true',
  isProd: import.meta.env.PROD,
  isDev: import.meta.env.DEV,
};

export default env;
