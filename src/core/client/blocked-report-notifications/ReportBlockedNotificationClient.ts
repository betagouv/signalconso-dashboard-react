import { Id } from '../../model'
import { ApiClient } from '../ApiClient'
import { BlockedReportNotification } from './BlockedReportNotification'

export class ReportBlockedNotificationClient {
  constructor(private client: ApiClient) {}

  readonly fetch = () => {
    return this.client
      .get<BlockedReportNotification[]>(`/report-blocked-notification`)
      .then((result) =>
        result.map((_) => ({ ..._, dateCreation: new Date(_.dateCreation) })),
      )
  }

  readonly create = (companyIds: Id[]) => {
    return this.client.post<BlockedReportNotification[]>(
      `/report-blocked-notification`,
      { body: { companyIds } },
    )
  }

  readonly delete = (companyIds: Id[]) => {
    return this.client.post<void>(`/report-blocked-notification/delete`, {
      body: { companyIds },
    })
  }
}
