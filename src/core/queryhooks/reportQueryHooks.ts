import { UseQueryResult, useQuery } from '@tanstack/react-query'
import { ConsumerReview, ReportWordCount } from '../client/event/Event'
import { ReportNodes } from '../client/report/ReportNode'
import { ReportNodeSearch } from '../client/report/ReportNodeSearch'
import { useApiContext } from '../context/ApiContext'
import { Id, PaginatedFilters, ReportExtra, ReportSearch } from '../model'
import { UseQueryOpts } from './UseQueryOpts'
import { useQueryPaginate } from './UseQueryPaginate'

export const GetReportQueryKeys = (id: Id) => ['reports_getById', id]
const GetReviewOnReportResponseQueryKeys = (id: string) => [
  'reports_getReviewOnReportResponse',
  id,
]
const GetEngagementReviewQueryKeys = (id: string) => [
  'reports_getEngagementReview',
  id,
]
export const ReportSearchQueryKeyStart = ['reports_search']
const GetCountBySubCategoriesQueryKeys = (filters: ReportNodeSearch) => [
  'reports_getCountBySubCategories',
  filters,
]
const GetCountByDepartmentsQueryKeys = (filters: {
  start?: Date
  end?: Date
}) => ['reports_getCountByDepartments', filters]
const GetCloudWordQueryKeys = (companyId: Id) => [
  'reports_getCloudWord',
  companyId,
]

export const useGetReportQuery = (id: string): UseQueryResult<ReportExtra> => {
  const { api } = useApiContext()
  return useQuery({
    queryKey: GetReportQueryKeys(id),
    queryFn: () => api.secured.reports.getById(id),
    enabled: !!id,
  })
}

export const useGetReviewOnReportResponseQuery = (
  id: string,
  options?: UseQueryOpts<ConsumerReview | null, string[]>,
) => {
  const { api } = useApiContext()
  return useQuery({
    queryKey: GetReviewOnReportResponseQueryKeys(id),
    queryFn: () => api.secured.reports.getReviewOnReportResponse(id),
    ...options,
  })
}
export const useGetEngagementReviewQuery = (
  id: string,
  options?: UseQueryOpts<ConsumerReview | null, string[]>,
) => {
  const { api } = useApiContext()
  return useQuery({
    queryKey: GetEngagementReviewQueryKeys(id),
    queryFn: () => api.secured.reports.getEngagementReview(id),
    ...options,
  })
}

export const useReportSearchQuery = (
  initialFilters?: ReportSearch & PaginatedFilters,
  enabled?: boolean,
) => {
  const { api } = useApiContext()
  const defaultFilters = { offset: 0, limit: 25 }
  return useQueryPaginate(
    ReportSearchQueryKeyStart,
    api.secured.reports.search,
    defaultFilters,
    initialFilters,
    enabled,
  )
}

export const useGetCountBySubCategoriesQuery = (
  filters: ReportNodeSearch,
  options?: UseQueryOpts<ReportNodes, any[]>,
) => {
  const { api } = useApiContext()
  return useQuery({
    queryKey: GetCountBySubCategoriesQueryKeys(filters),
    queryFn: () => api.secured.reports.getCountBySubCategories(filters),
    ...options,
  })
}

export const useGetCountByDepartmentsQuery = (
  filters: { start?: Date; end?: Date },
  options?: UseQueryOpts<[string, number][], any[]>,
) => {
  const { api } = useApiContext()
  return useQuery({
    queryKey: GetCountByDepartmentsQueryKeys(filters),
    queryFn: () => api.secured.reports.getCountByDepartments(filters),
    ...options,
  })
}

export const useGetCloudWordQuery = (
  companyId: Id,
  options?: UseQueryOpts<ReportWordCount[], string[]>,
) => {
  const { api } = useApiContext()
  return useQuery({
    queryKey: GetCloudWordQueryKeys(companyId),
    queryFn: () => api.secured.reports.getCloudWord(companyId),
    ...options,
  })
}
