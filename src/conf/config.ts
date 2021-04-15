export class Config {
  static readonly isDev = process.env.NODE_ENV === 'development'

  static readonly baseUrl = 'http://localhost:9000'

  static readonly sentryDsn = null

  static readonly basePath = '/'
}
