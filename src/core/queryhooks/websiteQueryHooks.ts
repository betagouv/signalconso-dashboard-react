import {useQuery} from '@tanstack/react-query'
import {useApiContext} from '../context/ApiContext'
import {UseQueryOpts} from './types'
import {IdentificationStatus, InvestigationStatus} from '../model'
import {useQueryPaginate} from './UseQueryPaginate'

export const ListInvestigationStatusKeys = ['website_listInvestigationStatus']
export const WebsiteWithCompanySearchKeys = ['website_list']

export const useListInvestigationStatusQuery = (options?: UseQueryOpts<InvestigationStatus[], string[]>) => {
  const {api} = useApiContext()
  return useQuery({queryKey: ListInvestigationStatusKeys, queryFn: api.secured.website.listInvestigationStatus, ...options})
}

export const useWebsiteWithCompanySearchQuery = () => {
  const {api} = useApiContext()
  return useQueryPaginate(WebsiteWithCompanySearchKeys, api.secured.website.list, {
    limit: 10,
    offset: 0,
    identificationStatus: [IdentificationStatus.NotIdentified],
  })
}
