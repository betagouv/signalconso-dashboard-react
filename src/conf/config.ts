// Env variables must start with 'REACT_APP_' to be considered by CreateReactApp
export class Config {
  static readonly isDev = process.env.NODE_ENV === 'development'

  static readonly apiBaseUrl = (process.env.REACT_APP_API_BASE_URL ?? 'http://localhost:9000').replace('\/$', '')

  static readonly appBaseUrl = (process.env.REACT_APP_APP_BASE_URL ?? 'http://localhost:4200').replace('\/$', '')

  static readonly sentryDsn = null

  static readonly basePath = '/'

  static readonly reportsLimitForExport = 30000

}
