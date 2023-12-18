import {UseQueryOpts} from './types'
import {useApiContext} from '../context/ApiContext'
import {useQuery} from '@tanstack/react-query'
import {BlockedReportNotification} from '../client/blocked-report-notifications/BlockedReportNotification'

export const ListReportBlockedNotificationsQueryKeys = ['reportBlockedNotification_fetch']

export const useListReportBlockedNotificationsQuery = (options?: UseQueryOpts<BlockedReportNotification[], string[]>) => {
  const {api} = useApiContext()
  return useQuery({
    queryKey: ListReportBlockedNotificationsQueryKeys,
    queryFn: api.secured.reportBlockedNotification.fetch,
    ...options,
  })
}
