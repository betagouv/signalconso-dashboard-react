import { useApiContext } from '../context/ApiContext'
import { useQueryPaginate } from './UseQueryPaginate'
import { paginateData, sortData } from '../helper'
import { ReportedPhoneSearch } from '../client/reported-phone/ReportedPhone'

const ReportedPhonesSearchQueryKeys = ['reportedPhone_list']

export const useReportedPhonesSearchQuery = () => {
  const { api } = useApiContext()
  return useQueryPaginate(
    ReportedPhonesSearchQueryKeys,
    (search: ReportedPhoneSearch) => {
      const {
        limit,
        offset,
        sortBy = 'count',
        orderBy = 'desc',
        ...filters
      } = search
      return api.secured.reportedPhone
        .list(filters)
        .then((_) => sortData(_, sortBy, orderBy))
        .then(paginateData(limit, offset))
    },
    {
      limit: 25,
      offset: 0,
    },
  )
}
