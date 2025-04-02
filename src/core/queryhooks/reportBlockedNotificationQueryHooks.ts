import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { Id } from 'core/model'
import { uniqBy } from '../../core/lodashNamedExport'
import { BlockedReportNotification } from '../client/blocked-report-notifications/BlockedReportNotification'
import { useApiContext } from '../context/ApiContext'
import { UseQueryOpts } from './UseQueryOpts'

const BlockedNotificationsQueryKey = ['reportBlockedNotification_fetch']

export type BlockedNotificationsQuery = ReturnType<
  typeof useBlockedNotificationsQuery
>

export const useBlockedNotificationsQuery = (
  options?: UseQueryOpts<BlockedReportNotification[], string[]>,
) => {
  const { api } = useApiContext()
  return useQuery({
    queryKey: BlockedNotificationsQueryKey,
    queryFn: api.secured.reportBlockedNotification.fetch,
    ...options,
  })
}

export function useAddBlockedNotification(companyIds: Id[]) {
  const { api } = useApiContext()
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: () => api.secured.reportBlockedNotification.create(companyIds),
    onSuccess: (newlyBlocked) =>
      queryClient.setQueryData(
        BlockedNotificationsQueryKey,
        (prev: BlockedReportNotification[]) => {
          return uniqBy([...(prev ?? []), ...newlyBlocked], (_) => _.companyId)
        },
      ),
  })
}
export function useRemoveBlockedNotification(companyIds: Id[]) {
  const { api } = useApiContext()
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: () => api.secured.reportBlockedNotification.delete(companyIds),
    onSuccess: () =>
      queryClient.setQueryData(
        BlockedNotificationsQueryKey,
        (prev: BlockedReportNotification[]) => {
          return prev?.filter((_) => !companyIds.includes(_.companyId))
        },
      ),
  })
}
