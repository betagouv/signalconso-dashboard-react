import { useQuery } from '@tanstack/react-query'
import { Duration } from '../../alexlibs/ts-utils'
import { useApiContext } from '../context/ApiContext'
import {
  Id,
  ReportAdminActionType,
  ReportResponseReviews,
  ReportStatusDistributionWithTotals,
  ReportStatusProDistributionWithTotals,
  ReportTagsDistribution,
  SimpleStat,
} from '../model'
import { UseQueryOpts } from './UseQueryOpts'

export const useGetResponseReviewsQuery = (
  id: Id,
  options?: UseQueryOpts<ReportResponseReviews, string[]>,
) => {
  const { api } = useApiContext()
  return useQuery({
    queryKey: ['stats_getResponseReviews', id],
    queryFn: () => api.secured.stats.getResponseReviews(id),
    ...options,
  })
}

export const useGetEngagementReviewsQuery = (
  id: Id,
  options?: UseQueryOpts<ReportResponseReviews, string[]>,
) => {
  const { api } = useApiContext()
  return useQuery({
    queryKey: ['stats_getEngagementReviews', id],
    queryFn: () => api.secured.stats.getEngagementReviews(id),
    ...options,
  })
}

export const useGetTagsQuery = (
  id: Id,
  options?: UseQueryOpts<ReportTagsDistribution, string[]>,
) => {
  const { api } = useApiContext()
  return useQuery({
    queryKey: ['stats_GetTags', id],
    queryFn: () => api.secured.stats.getTags(id),
    ...options,
  })
}

export const useGetCompanyThreatQuery = (
  id: Id,
  options?: UseQueryOpts<SimpleStat, string[]>,
) => {
  const { api } = useApiContext()
  return useQuery({
    queryKey: ['stats_GetCompanyThreat', id],
    queryFn: () =>
      api.secured.stats.getAdminActionCount(
        id,
        ReportAdminActionType.ConsumerThreatenByPro,
      ),
    ...options,
  })
}

export const useGetCompanyRefundBlackMailQuery = (
  id: Id,
  options?: UseQueryOpts<SimpleStat, string[]>,
) => {
  const { api } = useApiContext()
  return useQuery({
    queryKey: ['stats_GetCompanyRefundBlackMail', id],
    queryFn: () =>
      api.secured.stats.getAdminActionCount(
        id,
        ReportAdminActionType.RefundBlackMail,
      ),
    ...options,
  })
}

export const useStatusDistributionQuery = (
  id: Id,
  options?: UseQueryOpts<ReportStatusDistributionWithTotals, string[]>,
) => {
  const { api } = useApiContext()
  return useQuery({
    queryKey: ['stats_StatusDistribution', id],
    queryFn: () => api.secured.stats.getStatusDistribution(id),
    ...options,
  })
}

export const useStatusDistributionProQuery = (
  id: Id,
  options?: UseQueryOpts<ReportStatusProDistributionWithTotals, string[]>,
) => {
  const { api } = useApiContext()
  return useQuery({
    queryKey: ['stats_StatusDistributionPro', id],
    queryFn: () => api.secured.stats.getStatusDistributionPro(id),
    ...options,
  })
}

export const useAcceptedDistributionQuery = (id: Id) => {
  const { api } = useApiContext()
  return useQuery({
    queryKey: ['stats_AcceptedDistribution', id],
    queryFn: () => api.secured.stats.getAcceptedDistribution(id),
  })
}

export const useGetResponseDelayQuery = (
  id: Id,
  options?: UseQueryOpts<Duration | null, string[]>,
) => {
  const { api } = useApiContext()
  return useQuery({
    queryKey: ['stats_GetResponseDelay', id],
    queryFn: () => api.secured.stats.getResponseDelay(id),
    ...options,
  })
}
