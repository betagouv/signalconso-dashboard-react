import {
  PaginatedData,
  PaginatedFilters,
  ReportedPhone,
  ReportedPhoneFilters,
} from '../../model'
import format from 'date-fns/format'
import { ApiClientApi } from '../ApiClient'

export class ReportedPhoneClient {
  constructor(private client: ApiClientApi) {}

  readonly list = (filters: ReportedPhoneFilters & PaginatedFilters) => {
    return this.client.get<PaginatedData<ReportedPhone>>(`/reported-phones`, {
      qs: {
        q: filters.phone,
        ...(filters.start
          ? { start: format(filters.start, 'yyyy-MM-dd') }
          : {}),
        ...(filters.end ? { end: format(filters.end, 'yyyy-MM-dd') } : {}),
        offset: filters.offset,
        limit: filters.limit,
      },
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
