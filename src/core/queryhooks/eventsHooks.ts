import {useQuery} from '@tanstack/react-query'
import {useApiContext} from '../context/ApiContext'
import {UseQueryOpts} from './types'
import {ReportEvent} from '../client/event/Event'

export const useGetCompanyEventsQuery = (
  companySiret: string | undefined,
  options?: UseQueryOpts<ReportEvent[], (string | undefined)[]>,
) => {
  const {api} = useApiContext()
  return useQuery(['events_getBySiret', companySiret], () => api.secured.events.getBySiret(companySiret), options)
}

export const useGetReportEventsQuery = (id: string, options?: UseQueryOpts<ReportEvent[], string[]>) => {
  const {api} = useApiContext()
  return useQuery(['events_getByReportId', id], () => api.secured.events.getByReportId(id), options)
}
