import {Event, EventActionValues, Id, ReportEvent} from '../../model'
import {ApiClientApi} from '../ApiClient'

export class EventClient {
  constructor(private client: ApiClientApi) {}

  readonly getByReportId = (reportId: Id) => {
    return this.client
      .get<ReportEvent[]>(`reports/${reportId}/events`)
      .then(events => events.map(reportEvent => ({...reportEvent, data: EventClient.mapEvent(reportEvent.data)})))
  }

  readonly getBySiret = (siret: string) => {
    return this.client.get<ReportEvent[]>(`companies/${siret}/events`).then(events =>
      events
        .map(reportEvent => ({...reportEvent, data: EventClient.mapEvent(reportEvent.data)}))
        // these events are from an old feature, we don't create them anymore
        // it's better not to display even the old ones
        .filter(event => event.data.action !== EventActionValues.ActivationDocReturned),
    )
  }

  static readonly mapEvent = (_: {[key in keyof Event]: any}): Event => ({
    ..._,
    action: _.action.value,
    creationDate: new Date(_.creationDate),
  })
}
