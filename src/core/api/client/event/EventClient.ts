import {ApiClientApi, Event, Id, ReportEvent} from '../../index'

export class EventClient {

  constructor(private client: ApiClientApi) {
  }

  readonly getByReportId = (reportId: Id) => {
    return this.client.get<ReportEvent[]>(`reports/${reportId}/events`)
      .then(reportEvents => reportEvents.map(reportEvent => ({...reportEvent, data: EventClient.mapEvent(reportEvent.data)})))
  }

  static readonly mapEvent = (_: { [key in keyof Event]: any }): Event => ({
    ..._,
    action: _.action.value,
    creationDate: new Date(_.creationDate),
  })
}
