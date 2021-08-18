import {ApiClientApi, Id} from '../..'
import {BlockedReportNotification} from './BlockedReportNotification'

export class BlockedReportNotificationClient {
  constructor(private client: ApiClientApi) {
  }

  readonly fetch = () => {
    return this.client.get<BlockedReportNotification[]>(`/report-notification-blocklist`)
  }

  readonly create = (companyId: Id) => {
    return this.client.post<BlockedReportNotification>(`/report-notification-blocklist/${companyId}`)
  }

  readonly delete = (companyId: Id) => {
    return this.client.delete<void>(`/report-notification-blocklist/${companyId}`)
  }
}
