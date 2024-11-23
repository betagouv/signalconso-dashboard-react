import * as _Sentry from '@sentry/react'
import { config } from '../../conf/config'
import { browserTracingIntegration } from '@sentry/react'

export class Sentry {
  static readonly init = () => {
    if (config.sentry_dns) {
      _Sentry.init({
        dsn: config.sentry_dns,
        integrations: [browserTracingIntegration()],
        tracesSampleRate: config.sentry_traceRate,
      })
    }
  }
}
