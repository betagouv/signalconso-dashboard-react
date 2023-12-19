import {useQuery} from '@tanstack/react-query'
import {useApiContext} from '../context/ApiContext'
import {UseQueryOpts} from './types'
import {CompanySearchResult, CompanyWithAccessLevel, CompanyWithReportsCount, Id, PaginatedFilters} from '../model'
import {useQueryPaginate} from './UseQueryPaginate'
import {paginateData} from '../helper'

export const GetAccessibleByProQueryKeys = ['company_getAccessibleByPro']
export const ActivatedCompanySearchQueryKeys = ['company_search']
export const CompanyToActivateSearchQueryKeys = ['company_fetchToActivate']
export const CompanyToFollowUpSearchQueryKeys = ['company_fetchToFollowUp']
export const GetCompanyByIdQueryKeys = (id: Id) => ['company_byId', id]
export const GetHostsQueryKeys = (id: Id) => ['company_getHosts', id]
export const GetResponseRateQueryKeys = (id: Id) => ['company_getHosts', id]
export const SearchByIdentityQueryKeys = (identity: string, openOnly: boolean) => [
  'company_searchCompaniesByIdentity',
  identity,
  `${openOnly}`,
]
export const CompanyAccessCountQueryKeys = (siret: string) => ['companyAccess_count', siret]

export const useGetAccessibleByProQuery = (options?: UseQueryOpts<CompanyWithAccessLevel[], string[]>) => {
  const {api} = useApiContext()
  return useQuery({queryKey: GetAccessibleByProQueryKeys, queryFn: api.secured.company.getAccessibleByPro, ...options})
}

export const useActivatedCompanySearchQuery = () => {
  const {api} = useApiContext()
  const defaultFilters = {
    limit: 10,
    offset: 0,
  }
  return useQueryPaginate(ActivatedCompanySearchQueryKeys, api.secured.company.search, defaultFilters)
}

export const useCompanyToActivateSearchQuery = () => {
  const {api} = useApiContext()
  const defaultFilters = {
    limit: 250,
    offset: 0,
  }
  return useQueryPaginate(
    CompanyToActivateSearchQueryKeys,
    (filter: PaginatedFilters) =>
      api.secured.company
        .fetchToActivate()
        .then(_ => _.sort((a, b) => b.tokenCreation.getTime() - a.tokenCreation.getTime()))
        .then(paginateData(filter.limit, filter.offset)),
    defaultFilters,
  )
}

export const useCompanyToFollowUpSearchQuery = () => {
  const {api} = useApiContext()
  const defaultFilters = {
    limit: 250,
    offset: 0,
  }
  return useQueryPaginate(
    CompanyToFollowUpSearchQueryKeys,
    (filter: PaginatedFilters) => api.secured.company.fetchToFollowUp().then(paginateData(filter.limit, filter.offset)),
    defaultFilters,
  )
}

export const useGetCompanyByIdQuery = (id: Id, options?: UseQueryOpts<CompanyWithReportsCount, string[]>) => {
  const {api} = useApiContext()
  return useQuery({
    queryKey: GetCompanyByIdQueryKeys(id),
    queryFn: () => api.secured.company.byId(id).then(_ => _.entities[0]),
    ...options,
  })
}

export const useGetHostsQuery = (id: Id, options?: UseQueryOpts<string[], string[]>) => {
  const {api} = useApiContext()
  return useQuery({queryKey: GetHostsQueryKeys(id), queryFn: () => api.secured.company.getHosts(id), ...options})
}

export const useGetResponseRateQuery = (id: Id, options?: UseQueryOpts<number, string[]>) => {
  const {api} = useApiContext()
  return useQuery({queryKey: GetResponseRateQueryKeys(id), queryFn: () => api.secured.company.getResponseRate(id), ...options})
}

export const useSearchByIdentityQuery = (
  identity: string,
  openOnly: boolean,
  options?: UseQueryOpts<CompanySearchResult[], string[]>,
) => {
  const {api} = useApiContext()
  return useQuery({
    queryKey: SearchByIdentityQueryKeys(identity, openOnly),
    queryFn: () => api.companySdk.company.searchCompaniesByIdentity(identity, openOnly),
    ...options,
  })
}

export const useCompanyAccessCountQuery = (siret: string, options?: UseQueryOpts<number, string[]>) => {
  const {api} = useApiContext()
  return useQuery({
    queryKey: CompanyAccessCountQueryKeys(siret),
    queryFn: () => api.secured.companyAccess.count(siret),
    ...options,
  })
}
