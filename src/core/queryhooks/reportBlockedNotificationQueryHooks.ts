import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { Id } from 'core/model'
import { uniqBy } from '../../core/lodashNamedExport'
import { BlockedReportNotification } from '../client/blocked-report-notifications/BlockedReportNotification'
import { useApiContext } from '../context/ApiContext'
import { UseQueryOpts } from './UseQueryOpts'

export const ListReportBlockedNotificationsQueryKeys = [
  'reportBlockedNotification_fetch',
]

export const useListReportBlockedNotificationsQuery = (
  options?: UseQueryOpts<BlockedReportNotification[], string[]>,
) => {
  const { api } = useApiContext()
  return useQuery({
    queryKey: ListReportBlockedNotificationsQueryKeys,
    queryFn: api.secured.reportBlockedNotification.fetch,
    ...options,
  })
}

export type NotificationsQueries = ReturnType<
  typeof useBlockedNotificationsQueries
>

export function useBlockedNotificationsQueries() {
  const { api } = useApiContext()
  const queryClient = useQueryClient()
  const _blockedNotifList = useListReportBlockedNotificationsQuery()
  const _addBlockedNotif = useMutation({
    mutationFn: (companyIds: Id[]) =>
      api.secured.reportBlockedNotification.create(companyIds),
    onSuccess: (newlyBlocked) =>
      queryClient.setQueryData(
        ListReportBlockedNotificationsQueryKeys,
        (prev: BlockedReportNotification[]) => {
          return uniqBy([...(prev ?? []), ...newlyBlocked], (_) => _.companyId)
        },
      ),
  })
  const _removeBlockedNotif = useMutation({
    mutationFn: (companyIds: Id[]) =>
      api.secured.reportBlockedNotification.delete(companyIds),
    onSuccess: (_, companyIds) =>
      queryClient.setQueryData(
        ListReportBlockedNotificationsQueryKeys,
        (prev: BlockedReportNotification[]) => {
          return prev?.filter((_) => !companyIds.includes(_.companyId))
        },
      ),
  })
  return {
    _blockedNotifList,
    _addBlockedNotif,
    _removeBlockedNotif,
    isPending:
      !_blockedNotifList.data ||
      _addBlockedNotif.isPending ||
      _removeBlockedNotif.isPending,
  }
}
