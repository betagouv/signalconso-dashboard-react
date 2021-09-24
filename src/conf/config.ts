// Env variables must start with 'REACT_APP_' to be considered by CreateReactApp
import {env} from '@alexandreannic/ts-utils/lib/common/env/Env'
import {defaultValue, int} from '@alexandreannic/ts-utils/lib/common/env/EnvParser'

export const Config = {
  isDev: env()('NODE_ENV') === 'development',
  apiBaseUrl: env(defaultValue('http://localhost:9000'))('REACT_APP_API_BASE_URL').replace(/\/$/, ''),
  appBaseUrl: env(defaultValue('http://localhost:4200'))('REACT_APP_APP_BASE_URL').replace(/\/$/, ''),
  basePath: env(defaultValue('/'))('REACT_APP_BASE_PATH'),
  reportsLimitForExport: 30000,
  upload_allowedExtensions: ['jpg', 'jpeg', 'pdf', 'png', 'gif', 'docx'],
  upload_maxSizeMb: env(int, defaultValue(5))('REACT_APP_UPLOAD_MAX_SIZE_MB'),
  contactEmail: 'support@signal.conso.gouv.fr',
  sentry_dns: env()('REACT_APP_SENTRY_DNS'),
  sentry_traceRate: env(int, defaultValue(.5))('REACT_APP_SENTRY_TRACE_RATE'),
  useHashRouter: true,
}

console.info(Config)
