import { useApiContext } from '../context/ApiContext'
import { useQueryPaginate } from './UseQueryPaginate'
import {
  ReportedPhoneFilters,
  ReportedPhoneSearch,
} from '../client/reported-phone/ReportedPhone'
import { PaginatedFilters } from '../model'

const ReportedPhonesSearchQueryKeys = ['reportedPhone_list']

export const useReportedPhonesSearchQuery = (
  initialFilters?: ReportedPhoneFilters & PaginatedFilters,
) => {
  const { api } = useApiContext()
  const defaultFilters: ReportedPhoneFilters & PaginatedFilters = {
    offset: 0,
    limit: 25,
  }
  return useQueryPaginate(
    ReportedPhonesSearchQueryKeys,
    api.secured.reportedPhone.list,
    defaultFilters,
    initialFilters,
  )
}
