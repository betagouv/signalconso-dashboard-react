console.log(process.env)

export class Config {
  static readonly isDev = process.env.NODE_ENV === 'development'

  static readonly baseUrl = process.env.API_BASE_URL ?? 'http://localhost:9000'

  static readonly sentryDsn = null

  static readonly basePath = '/'

  static readonly reportsLimitForExport = 30000;

}
