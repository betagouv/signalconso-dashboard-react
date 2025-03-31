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
  isManuDev: import.meta.env.VITE_APP_IS_MANU_DEV === 'true',
  proConnectServer: import.meta.env.VITE_APP_PRO_CONNECT_URL,
  proConnectClientId: import.meta.env.VITE_APP_PRO_CONNECT_CLIENT_ID,
  enableProConnect: import.meta.env.VITE_APP_ENABLE_PRO_CONNECT === 'true',
  isDev: import.meta.env.VITE_APP_NODE_ENV === 'development',
  isDemo: import.meta.env.VITE_APP_IS_DEMO === 'true',
  apiBaseUrl: noTrailingSlash(
    import.meta.env.VITE_APP_API_BASE_URL ?? 'http://localhost:9000',
  ),
  companyApiBaseUrl: noTrailingSlash(
    import.meta.env.VITE_APP_COMPANY_API_BASE_URL ?? 'http://localhost:9002',
  ),
  appBaseUrl: noTrailingSlash(
    import.meta.env.VITE_APP_APP_BASE_URL ?? 'http://localhost:3001',
  ),
  dashboardBaseUrl: noTrailingSlash(
    import.meta.env.VITE_APP_DASHBOARD_BASE_URL ?? 'http://localhost:3000',
  ),
  basePath: import.meta.env.VITE_APP_BASE_PATH ?? '/',
  reportsLimitForExport: 30000,
  upload_allowedExtensions: ['jpg', 'jpeg', 'pdf', 'png', 'gif', 'docx'],
  upload_maxSizeMb: readInt(import.meta.env.VITE_APP_UPLOAD_MAX_SIZE_MB, 5),
  contactEmail: 'support@signal.conso.gouv.fr',
  sentry_dns: import.meta.env.VITE_APP_SENTRY_DNS,
  sentry_traceRate: readInt(import.meta.env.VITE_APP_SENTRY_TRACE_RATE, 0.5),
  enableMatomo: import.meta.env.VITE_APP_ENABLE_MATOMO === 'true',
  infoBanner: import.meta.env.VITE_APP_INFO_BANNER,
  showPredefinedUsers:
    import.meta.env.VITE_APP_SHOW_PREDEFINED_USERS === 'true',
  showReportAssignement: true,
  infoBannerSeverity:
    readSeverity(import.meta.env.VITE_APP_INFO_BANNER_SEVERITY) ?? 'warning',
}

type Config = typeof config

console.log(config)
