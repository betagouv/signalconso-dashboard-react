import { Id } from '../../model'
import { ApiClient } from '../ApiClient'
import { Engagement } from './Engagement'

export class EngagementClient {
  constructor(private client: ApiClient) {}

  readonly list = () => {
    return this.client
      .get<Engagement[]>(`/engagements`)
      .then((l) => l.map((p) => EngagementClient.mapEngagement(p)))
  }

  readonly check = (engagementId: Id) => {
    return this.client.post<void>(`/engagements/${engagementId}/check`)
  }

  readonly uncheck = (engagementId: Id) => {
    return this.client.post<void>(`/engagements/${engagementId}/uncheck`)
  }

  static readonly mapEngagement = (_: {
    [key in keyof Engagement]: any
  }): Engagement => ({
    ..._,
    expirationDate: new Date(new Date(_.expirationDate).toDateString()),
    resolutionDate: _.resolutionDate
      ? new Date(new Date(_.resolutionDate).toDateString())
      : undefined,
  })
}
