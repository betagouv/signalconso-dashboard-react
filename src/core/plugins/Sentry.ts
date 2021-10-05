import * as _Sentry from '@sentry/react'
import {Config} from '../../conf/config'
import {Integrations} from '@sentry/tracing'

export class Sentry {
  static readonly init = () => {
    if (Config.sentry_dns) {
      _Sentry.init({
        dsn: Config.sentry_dns,
        integrations: [new Integrations.BrowserTracing()],
        tracesSampleRate: Config.sentry_traceRate,
      })
    }
  }
}
