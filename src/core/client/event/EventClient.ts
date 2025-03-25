import { Event, Id, EventWithUser } from '../../model'
import { ApiClient } from '../ApiClient'

export class EventClient {
  constructor(private client: ApiClient) {}

  readonly getByReportId = (reportId: Id) => {
    return this.client
      .get<EventWithUser[]>(`reports/${reportId}/events`)
      .then((events) =>
        events.map((eventWithUser) => ({
          ...eventWithUser,
          event: EventClient.mapEvent(eventWithUser.event),
        })),
      )
  }

  readonly getBySiret = (siret: string) => {
    return this.client
      .get<EventWithUser[]>(`companies/${siret}/events`)
      .then((events) =>
        events.map((eventWithUser) => ({
          ...eventWithUser,
          event: EventClient.mapEvent(eventWithUser.event),
        })),
      )
  }

  static readonly mapEvent = (_: { [key in keyof Event]: any }): Event => ({
    ..._,
    action: _.action.value,
    creationDate: new Date(_.creationDate),
  })
}
