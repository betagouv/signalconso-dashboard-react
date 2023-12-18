import {useQuery} from '@tanstack/react-query'
import {useApiContext} from '../context/ApiContext'
import {UseQueryOpts} from './types'
import {ReportEvent} from '../client/event/Event'

export const GetCompanyEventsQueryKeys = (companySiret: string | undefined) => ['events_getBySiret', companySiret]
export const GetReportEventsQueryKeys = (id: string) => ['events_getByReportId', id]

export const useGetCompanyEventsQuery = (
  companySiret: string | undefined,
  options?: UseQueryOpts<ReportEvent[], (string | undefined)[]>,
) => {
  const {api} = useApiContext()
  return useQuery({
    queryKey: GetCompanyEventsQueryKeys(companySiret),
    queryFn: () => api.secured.events.getBySiret(companySiret),
    ...options,
  })
}

export const useGetReportEventsQuery = (id: string, options?: UseQueryOpts<ReportEvent[], string[]>) => {
  const {api} = useApiContext()
  return useQuery({queryKey: GetReportEventsQueryKeys(id), queryFn: () => api.secured.events.getByReportId(id), ...options})
}
