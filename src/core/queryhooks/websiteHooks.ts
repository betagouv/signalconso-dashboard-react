import {useQuery} from '@tanstack/react-query'
import {useApiContext} from '../context/ApiContext'
import {UseQueryOpts} from './types'
import {IdentificationStatus, InvestigationStatus, WebsiteWithCompanySearch} from '../model'
import {useQueryPaginate} from './UseQueryPaginate'

export const ListInvestigationStatusKeys = ['website_listInvestigationStatus']
export const useListInvestigationStatusQuery = (options?: UseQueryOpts<InvestigationStatus[], string[]>) => {
  const {api} = useApiContext()
  return useQuery(ListInvestigationStatusKeys, api.secured.website.listInvestigationStatus, options)
}

export const WebsiteWithCompanySearchKeys = ['website_list']
export const useWebsiteWithCompanySearchQuery = () => {
  const {api} = useApiContext()
  return useQueryPaginate(WebsiteWithCompanySearchKeys, (s: WebsiteWithCompanySearch) => api.secured.website.list(s), {
    limit: 10,
    offset: 0,
    identificationStatus: [IdentificationStatus.NotIdentified],
  })
}
