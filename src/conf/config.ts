// Env variables must start with 'REACT_APP_' to be considered by CreateReactApp
import {env as _env} from '../alexlibs/ts-utils'
import {bool, defaultValue, int, required} from '../alexlibs/ts-utils'

enum Env {
  NODE_ENV = 'NODE_ENV',
  REACT_APP_API_BASE_URL = 'REACT_APP_API_BASE_URL',
  REACT_APP_APP_BASE_URL = 'REACT_APP_APP_BASE_URL',
  REACT_APP_COMPANY_API_BASE_URL = 'REACT_APP_COMPANY_API_BASE_URL',
  REACT_APP_BASE_PATH = 'REACT_APP_BASE_PATH',
  REACT_APP_UPLOAD_MAX_SIZE_MB = 'REACT_APP_UPLOAD_MAX_SIZE_MB',
  REACT_APP_SENTRY_DNS = 'REACT_APP_SENTRY_DNS',
  REACT_APP_ENABLE_FEATURE_DROPSHIPPING = 'REACT_APP_ENABLE_FEATURE_DROPSHIPPING',
  REACT_APP_SENTRY_TRACE_RATE = 'REACT_APP_SENTRY_TRACE_RATE',
  REACT_APP_INFO_BANNER = 'REACT_APP_INFO_BANNER',
  REACT_APP_INFO_BANNER_SEVERITY = 'REACT_APP_INFO_BANNER_SEVERITY',
}

const env = _env(process.env)

const parseUrl = (_: string): string => _.replace(/\/$/, '')

const severities = ['info', 'warning', 'error', 'success'] as const
type Severity = typeof severities[number]
function readSeverity(severity?: string): Severity | null {
  if (severity && severities.includes(severity as any)) {
    return severity as Severity
  }
  return null
}

export const config = {
  isDev: env()(Env.NODE_ENV) === 'development',
  apiBaseUrl: env(defaultValue('http://localhost:9000'), parseUrl)(Env.REACT_APP_API_BASE_URL),
  companyApiBaseUrl: env(defaultValue('http://localhost:9002'), parseUrl)(Env.REACT_APP_COMPANY_API_BASE_URL),
  appBaseUrl: env(defaultValue('http://localhost:3001'), parseUrl)(Env.REACT_APP_APP_BASE_URL),
  basePath: env(defaultValue('/'))(Env.REACT_APP_BASE_PATH),
  reportsLimitForExport: 30000,
  upload_allowedExtensions: ['jpg', 'jpeg', 'pdf', 'png', 'gif', 'docx'],
  upload_maxSizeMb: env(int, defaultValue(5))(Env.REACT_APP_UPLOAD_MAX_SIZE_MB),
  contactEmail: 'support@signal.conso.gouv.fr',
  sentry_dns: env()(Env.REACT_APP_SENTRY_DNS),
  sentry_traceRate: env(int, defaultValue(0.5))(Env.REACT_APP_SENTRY_TRACE_RATE),
  enable_feature_dropshipping: env(int)(Env.REACT_APP_ENABLE_FEATURE_DROPSHIPPING),
  useHashRouter: true,
  infoBanner: env()(Env.REACT_APP_INFO_BANNER),
  infoBannerSeverity: readSeverity(env()(Env.REACT_APP_INFO_BANNER_SEVERITY)) ?? 'warning',
}

export type Config = typeof config

console.log(config)
