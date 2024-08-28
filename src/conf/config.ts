function noTrailingSlash(str: string) {
  return str.replace(/\/$/, '')
}
function readInt(str: string | undefined, defaultValue: number) {
  return str === undefined ? defaultValue : parseInt(str, 10)
}

const severities = ['info', 'warning', 'error', 'success'] as const
type Severity = (typeof severities)[number]
function readSeverity(severity?: string): Severity | null {
  if (severity && severities.includes(severity as any)) {
    return severity as Severity
  }
  return null
}

export const config = {
  isDev: process.env.REACT_APP_NODE_ENV === 'development',
  apiBaseUrl: noTrailingSlash(process.env.REACT_APP_API_BASE_URL ?? 'http://localhost:9000'),
  companyApiBaseUrl: noTrailingSlash(process.env.REACT_APP_COMPANY_API_BASE_URL ?? 'http://localhost:9002'),
  appBaseUrl: noTrailingSlash(process.env.REACT_APP_APP_BASE_URL ?? 'http://localhost:3001'),
  basePath: process.env.REACT_APP_BASE_PATH ?? '/',
  reportsLimitForExport: 30000,
  upload_allowedExtensions: ['jpg', 'jpeg', 'pdf', 'png', 'gif', 'docx'],
  upload_maxSizeMb: readInt(process.env.REACT_APP_UPLOAD_MAX_SIZE_MB, 5),
  contactEmail: 'support@signal.conso.gouv.fr',
  sentry_dns: process.env.REACT_APP_SENTRY_DNS,
  sentry_traceRate: readInt(process.env.REACT_APP_SENTRY_TRACE_RATE, 0.5),
  enableMatomo: process.env.REACT_APP_ENABLE_MATOMO === 'true',
  infoBanner: process.env.REACT_APP_INFO_BANNER,
  showReportAssignement: true,
  infoBannerSeverity: readSeverity(process.env.REACT_APP_INFO_BANNER_SEVERITY) ?? 'warning',
}

type Config = typeof config

console.log(config)
