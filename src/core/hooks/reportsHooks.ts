import {useQuery} from '@tanstack/react-query'
import {useApiContext} from '../context/ApiContext'
import {ReportSearchResult} from '../client/report/Report'
import {ResponseConsumerReview} from '../client/event/Event'
import {UseQueryOpts} from './types'
import {useQueryPaginate} from './UseQueryPaginate'
import {ReportSearch} from '../client/report/ReportSearch'
import {PaginatedFilters} from '../model'

export const useGetReportQuery = (id: string, options?: UseQueryOpts<ReportSearchResult, string[]>) => {
  const {api} = useApiContext()
  return useQuery(['reports_getById', id], () => api.secured.reports.getById(id), options)
}

export const useGetReviewOnReportResponseQuery = (
  id: string,
  options?: UseQueryOpts<ResponseConsumerReview | undefined, string[]>,
) => {
  const {api} = useApiContext()
  return useQuery(['reports_getReviewOnReportResponse', id], () => api.secured.reports.getReviewOnReportResponse(id), options)
}

export const useReportSearchQuery = () => {
  const {api} = useApiContext()
  return useQueryPaginate(['reports_search'], (s: ReportSearch & PaginatedFilters) => api.secured.reports.search(s), {
    limit: 10,
    offset: 0,
  })
}
