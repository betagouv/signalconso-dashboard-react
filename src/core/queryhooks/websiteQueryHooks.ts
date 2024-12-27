import { useQuery } from '@tanstack/react-query'
import { useApiContext } from '../context/ApiContext'
import { IdentificationStatus, InvestigationStatus } from '../model'
import { UseQueryOpts } from './UseQueryOpts'
import { useQueryPaginate } from './UseQueryPaginate'

const ListInvestigationStatusKeys = ['website_listInvestigationStatus']
export const WebsiteWithCompanySearchKeys = ['website_list']
const ListUnregisteredWebsitesSearchQueryKeys = ['website_listUnregistered']

export const useListInvestigationStatusQuery = (
  options?: UseQueryOpts<InvestigationStatus[], string[]>,
) => {
  const { api } = useApiContext()
  return useQuery({
    queryKey: ListInvestigationStatusKeys,
    queryFn: api.secured.website.listInvestigationStatus,
    ...options,
  })
}

export const useWebsiteWithCompanySearchQuery = () => {
  const { api } = useApiContext()
  return useQueryPaginate(
    WebsiteWithCompanySearchKeys,
    api.secured.website.list,
    {
      limit: 25,
      offset: 0,
      identificationStatus: [IdentificationStatus.NotIdentified],
      isOpen: null,
      isMarketplace: null,
    },
  )
}

export const useWebsiteWithClosedCompanyQuery = () => {
  const { api } = useApiContext()
  return useQueryPaginate(
    WebsiteWithCompanySearchKeys,
    api.secured.website.list,
    {
      limit: 25,
      offset: 0,
      identificationStatus: [IdentificationStatus.Identified],
      isOpen: false,
      isMarketplace: null,
    },
  )
}

export const useListUnregisteredWebsitesSearchQuery = () => {
  const { api } = useApiContext()
  return useQueryPaginate(
    ListUnregisteredWebsitesSearchQueryKeys,
    api.secured.website.listUnregistered,
    {
      limit: 25,
      offset: 0,
      q: '',
    },
  )
}
