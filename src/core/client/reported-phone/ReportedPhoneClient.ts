import format from 'date-fns/format'
import { ReportedPhone, ReportedPhoneFilters } from '../../model'
import { ApiClient } from '../ApiClient'

export class ReportedPhoneClient {
  constructor(private client: ApiClient) {}

  readonly list = (filters: ReportedPhoneFilters) => {
    return this.client.get<ReportedPhone[]>(`/reported-phones`, {
      qs: ReportedPhoneClient.mapFilters(filters),
    })
  }

  readonly extract = (filters: ReportedPhoneFilters) => {
    return this.client.get<void>(`/reported-phones/extract`, {
      qs: ReportedPhoneClient.mapFilters(filters),
    })
  }

  private static mapFilters = (filters: ReportedPhoneFilters): any => ({
    q: filters.phone,
    ...(filters.start ? { start: format(filters.start, 'yyyy-MM-dd') } : {}),
    ...(filters.end ? { end: format(filters.end, 'yyyy-MM-dd') } : {}),
  })
}
