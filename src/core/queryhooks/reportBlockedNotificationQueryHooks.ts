import { useQuery } from '@tanstack/react-query'
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
