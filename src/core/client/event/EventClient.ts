import { Event, Id, ReportEvent } from '../../model'
import { ApiClient } from '../ApiClient'

export class EventClient {
  constructor(private client: ApiClient) {}

  readonly getByReportId = (reportId: Id) => {
    return this.client
      .get<ReportEvent[]>(`reports/${reportId}/events`)
      .then((events) =>
        events.map((reportEvent) => ({
          ...reportEvent,
          data: EventClient.mapEvent(reportEvent.data),
        })),
      )
  }

  readonly getBySiret = (siret: string) => {
    return this.client
      .get<ReportEvent[]>(`companies/${siret}/events`)
      .then((events) =>
        events.map((reportEvent) => ({
          ...reportEvent,
          data: EventClient.mapEvent(reportEvent.data),
        })),
      )
  }

  static readonly mapEvent = (_: { [key in keyof Event]: any }): Event => ({
    ..._,
    action: _.action.value,
    creationDate: new Date(_.creationDate),
  })
}
