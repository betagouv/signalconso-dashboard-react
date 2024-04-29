import {UseQueryOpts} from './types'
import {useApiContext} from '../context/ApiContext'
import {useQuery} from '@tanstack/react-query'
import {
  Id,
  ReportAdminActionType,
  ReportResponseReviews,
  ReportStatusDistribution,
  ReportStatusDistributionWithTotals,
  ReportStatusProDistribution,
  ReportStatusProDistributionWithTotals,
  ReportTagsDistribution,
  SimpleStat,
} from '../model'
import {Duration} from '../../alexlibs/ts-utils'

export const useGetResponseReviewsQuery = (id: Id, options?: UseQueryOpts<ReportResponseReviews, string[]>) => {
  const {api} = useApiContext()
  return useQuery({
    queryKey: ['stats_getResponseReviews'],
    queryFn: () => api.secured.stats.getResponseReviews(id),
    ...options,
  })
}

export const useGetEngagementReviewsQuery = (id: Id, options?: UseQueryOpts<ReportResponseReviews, string[]>) => {
  const {api} = useApiContext()
  return useQuery({
    queryKey: ['stats_getEngagementReviews'],
    queryFn: () => api.secured.stats.getEngagementReviews(id),
    ...options,
  })
}

export const useGetTagsQuery = (id: Id, options?: UseQueryOpts<ReportTagsDistribution, string[]>) => {
  const {api} = useApiContext()
  return useQuery({
    queryKey: ['stats_GetTags'],
    queryFn: () => api.secured.stats.getTags(id),
    ...options,
  })
}

export const useGetCompanyThreatQuery = (id: Id, options?: UseQueryOpts<SimpleStat, string[]>) => {
  const {api} = useApiContext()
  return useQuery({
    queryKey: ['stats_GetCompanyThreat'],
    queryFn: () => api.secured.stats.getAdminActionCount(id, ReportAdminActionType.ConsumerThreatenByPro),
    ...options,
  })
}

export const useGetCompanyRefundBlackMailQuery = (id: Id, options?: UseQueryOpts<SimpleStat, string[]>) => {
  const {api} = useApiContext()
  return useQuery({
    queryKey: ['stats_GetCompanyRefundBlackMail'],
    queryFn: () => api.secured.stats.getAdminActionCount(id, ReportAdminActionType.RefundBlackMail),
    ...options,
  })
}

export const useStatusDistributionQuery = (id: Id, options?: UseQueryOpts<ReportStatusDistributionWithTotals, string[]>) => {
  const {api} = useApiContext()
  return useQuery({
    queryKey: ['stats_StatusDistribution'],
    queryFn: () => api.secured.stats.getStatusDistribution(id),
    ...options,
  })
}

export const useStatusDistributionProQuery = (
  id: Id,
  options?: UseQueryOpts<ReportStatusProDistributionWithTotals, string[]>,
) => {
  const {api} = useApiContext()
  return useQuery({
    queryKey: ['stats_StatusDistributionPro'],
    queryFn: () => api.secured.stats.getStatusDistributionPro(id),
    ...options,
  })
}

export const useGetResponseDelayQuery = (id: Id, options?: UseQueryOpts<Duration | null, string[]>) => {
  const {api} = useApiContext()
  return useQuery({
    queryKey: ['stats_GetResponseDelay'],
    queryFn: () => api.secured.stats.getResponseDelay(id),
    ...options,
  })
}
