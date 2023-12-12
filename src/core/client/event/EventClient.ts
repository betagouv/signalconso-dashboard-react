import {ApiClientApi} from '../ApiClient'
import {Event, Id, ReportEvent} from '../../model'

export class EventClient {
  constructor(private client: ApiClientApi) {}

  readonly getByReportId = (reportId: Id) => {
    return this.client
      .get<ReportEvent[]>(`reports/${reportId}/events`)
      .then(events => events.map(reportEvent => ({...reportEvent, data: EventClient.mapEvent(reportEvent.data)})))
  }

  readonly getBySiret = (siret: string | undefined) => {
    return typeof siret === 'undefined'
      ? Promise.reject(new Error('SIRET must be defined'))
      : this.client
          .get<ReportEvent[]>(`companies/${siret}/events`)
          .then(events => events.map(reportEvent => ({...reportEvent, data: EventClient.mapEvent(reportEvent.data)})))
  }

  static readonly mapEvent = (_: {[key in keyof Event]: any}): Event => ({
    ..._,
    action: _.action.value,
    creationDate: new Date(_.creationDate),
  })
}
