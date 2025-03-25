import { useQuery } from '@tanstack/react-query'
import { useMemo } from 'react'
import {
  EventActionValues,
  EventWithUser,
  ReportProResponseEvent,
} from '../client/event/Event'
import { useApiContext } from '../context/ApiContext'
import { UseQueryOpts } from './UseQueryOpts'

const GetCompanyEventsQueryKeys = (companySiret: string) => [
  'events_getBySiret',
  companySiret,
]
export const GetReportEventsQueryKeys = (id: string) => [
  'events_getByReportId',
  id,
]

export const useGetCompanyEventsQuery = (
  companySiret: string,
  options?: UseQueryOpts<EventWithUser[], string[]>,
) => {
  const { api } = useApiContext()
  return useQuery({
    queryKey: GetCompanyEventsQueryKeys(companySiret),
    queryFn: () => api.secured.events.getBySiret(companySiret),
    ...options,
  })
}

export const useGetReportEventsQuery = (
  id: string,
  options?: UseQueryOpts<EventWithUser[], string[]>,
) => {
  const { api } = useApiContext()
  const _reportEvents = useQuery({
    queryKey: GetReportEventsQueryKeys(id),
    queryFn: () => api.secured.events.getByReportId(id),
    ...options,
  })
  const reportEvents = _reportEvents.data
  const responseEvent = useMemo(() => {
    return reportEvents?.find(
      (_) => _.event.action === EventActionValues.ReportProResponse,
    ) as ReportProResponseEvent | undefined
  }, [reportEvents])
  return {
    reportEvents,
    responseEvent,
    refetch: _reportEvents.refetch,
    isLoading: _reportEvents.isLoading,
  }
}
