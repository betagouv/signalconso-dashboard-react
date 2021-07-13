// Env variables must start with 'REACT_APP_' to be considered by CreateReactApp
export const Config = {
  isDev: process.env.NODE_ENV === 'development',
  apiBaseUrl: (process.env.REACT_APP_API_BASE_URL ?? 'https://app-513c11a7-052f-4ff1-8670-5a17dacb7327.cleverapps.io/').replace(/\/$/, ''),
  appBaseUrl: (process.env.REACT_APP_APP_BASE_URL ?? 'http://localhost:4200').replace(/\/$/, ''),
  sentryDsn: null,
  basePath: '/',
  reportsLimitForExport: 30000,
  uploadFileAllowedExtenions: ['jpg', 'jpeg', 'pdf', 'png', 'gif', 'docx'],
  uploadFileMaxSizeMb: 5,
}

console.info(Config)
