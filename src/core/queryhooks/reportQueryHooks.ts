import {useQuery} from '@tanstack/react-query'
import {useApiContext} from '../context/ApiContext'
import {ReportSearchResult} from '../client/report/Report'
import {ResponseConsumerReview} from '../client/event/Event'
import {UseQueryOpts} from './types'
import {useQueryPaginate} from './UseQueryPaginate'
import {Id} from '../model'

export const GetReportQueryKeys = (id: Id) => ['reports_getById', id]
const GetReviewOnReportResponseQueryKeys = (id: string) => ['reports_getReviewOnReportResponse', id]
const ReportSearchQuery = ['reports_search']

export const useGetReportQuery = (id: string, options?: UseQueryOpts<ReportSearchResult, string[]>) => {
  const {api} = useApiContext()
  return useQuery({queryKey: GetReportQueryKeys(id), queryFn: () => api.secured.reports.getById(id), ...options})
}

export const useGetReviewOnReportResponseQuery = (
  id: string,
  options?: UseQueryOpts<ResponseConsumerReview | undefined, string[]>,
) => {
  const {api} = useApiContext()
  return useQuery({
    queryKey: GetReviewOnReportResponseQueryKeys(id),
    queryFn: () => api.secured.reports.getReviewOnReportResponse(id),
    ...options,
  })
}

export const useReportSearchQuery = () => {
  const {api} = useApiContext()
  const defaultFilters = {
    limit: 10,
    offset: 0,
  }
  return useQueryPaginate(ReportSearchQuery, api.secured.reports.search, defaultFilters)
}
