import { useQuery } from '@tanstack/react-query'
import { useApiContext } from '../context/ApiContext'
import {
  HostReportCountSearch,
  IdentificationStatus,
  InvestigationStatus,
  WebsiteWithCompanySearch,
} from '../model'
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

export const useWebsiteWithCompanySearchQuery = (
  filters: WebsiteWithCompanySearch,
) => {
  const { api } = useApiContext()
  const defaultFilters: WebsiteWithCompanySearch = {
    limit: 25,
    offset: 0,
    isOpen: null,
    isMarketplace: null,
  }
  return useQueryPaginate(
    WebsiteWithCompanySearchKeys,
    api.secured.website.list,
    defaultFilters,
    filters,
  )
}

export const useWebsiteWithClosedCompanyQuery = () => {
  const { api } = useApiContext()
  const defaultFilters: WebsiteWithCompanySearch = {
    limit: 25,
    offset: 0,
    identificationStatus: [IdentificationStatus.Identified],
    isOpen: false,
    isMarketplace: null,
  }
  return useQueryPaginate(
    WebsiteWithCompanySearchKeys,
    api.secured.website.list,
    defaultFilters,
  )
}

export const useListUnregisteredWebsitesSearchQuery = () => {
  const { api } = useApiContext()
  const defaultFilters: HostReportCountSearch = {
    limit: 25,
    offset: 0,
    q: '',
  }
  return useQueryPaginate(
    ListUnregisteredWebsitesSearchQueryKeys,
    api.secured.website.listUnregistered,
    defaultFilters,
  )
}
