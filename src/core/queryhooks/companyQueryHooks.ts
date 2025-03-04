import { useQuery } from '@tanstack/react-query'
import { useConnectedContext } from 'core/context/ConnectedContext'
import { useApiContext } from '../context/ApiContext'
import { paginateData } from '../helper'
import {
  AccessLevel,
  CompanySearch,
  CompanySearchResult,
  CompanyWithReportsCount,
  Id,
  PaginatedFilters,
} from '../model'
import { UseQueryOpts } from './UseQueryOpts'
import { useQueryPaginate } from './UseQueryPaginate'

const GetAccessibleByProQueryKeys = ['company_getAccessibleByPro']
const IsAllowedToManageCompanyAccessesQueryKeys = [
  'company_isAllowedToManageCompanyAccesses',
]
export const ActivatedCompanySearchQueryKeys = ['company_search']
export const CompanyToActivateSearchQueryKeys = ['company_fetchToActivate']
export const CompanyToFollowUpSearchQueryKeys = ['company_fetchToFollowUp']
const GetCompanyByIdQueryKeys = (id: Id) => ['company_byId', id]
const GetHostsQueryKeys = (id: Id) => ['company_getHosts', id]
const GetPhonesQueryKeys = (id: Id) => ['company_getPhones', id]
const GetResponseRateQueryKeys = (id: Id) => ['company_getResponseRate', id]
const SearchByIdentityQueryKeys = (identity: string, openOnly: boolean) => [
  'company_searchCompaniesByIdentity',
  identity,
  `${openOnly}`,
]
const CompanyAccessCountQueryKeys = (siret: string) => [
  'companyAccess_count',
  siret,
]
const CompanyAccessesFetchQueryKeys = (siret: string) => [
  'companyAccesses_fetch',
  siret,
]

export const useGetAccessibleByProQuery = ({
  enabled = true,
}: { enabled?: boolean } = {}) => {
  const { api } = useApiContext()
  return useQuery({
    queryKey: GetAccessibleByProQueryKeys,
    queryFn: api.secured.company.getAccessibleByPro,
    enabled,
  })
}

export function useIsAllowedToManageCompanyAccessesQuery(companyId: string) {
  const { connectedUser } = useConnectedContext()
  const isPro = connectedUser.isPro
  const _companiesAccessibleByPro = useGetAccessibleByProQuery({
    enabled: isPro,
  })
  if (isPro) {
    const data = _companiesAccessibleByPro.data
    if (data) {
      return data.find((c) => c.id === companyId)?.level === AccessLevel.ADMIN
    }
    return undefined
  }
  return true
}

const useGetAccessLevelOfProQuery = (companyId: Id) => {
  const { api } = useApiContext()
  return useQuery({
    queryKey: GetAccessibleByProQueryKeys,
    queryFn: api.secured.company.getAccessibleByPro,
    select: (data) => {
      return data.find((company) => company.id === companyId)?.level
    },
  })
}

export const useActivatedCompanySearchQuery = (filters: CompanySearch) => {
  const { api } = useApiContext()
  const defaultFilters: CompanySearch = {
    offset: 0,
    limit: 25,
  }
  return useQueryPaginate(
    ActivatedCompanySearchQueryKeys,
    api.secured.company.search,
    defaultFilters,
    filters,
  )
}

export const useCompanyToActivateSearchQuery = () => {
  const { api } = useApiContext()
  const defaultFilters = {
    limit: 250,
    offset: 0,
  }
  return useQueryPaginate(
    CompanyToActivateSearchQueryKeys,
    (filter: PaginatedFilters) =>
      api.secured.company
        .fetchToActivate()
        .then((_) =>
          _.sort(
            (a, b) => b.tokenCreation.getTime() - a.tokenCreation.getTime(),
          ),
        )
        .then(paginateData(filter.limit, filter.offset)),
    defaultFilters,
  )
}

export const useCompanyToFollowUpSearchQuery = () => {
  const { api } = useApiContext()
  const defaultFilters = {
    limit: 250,
    offset: 0,
  }
  return useQueryPaginate(
    CompanyToFollowUpSearchQueryKeys,
    (filter: PaginatedFilters) =>
      api.secured.company
        .fetchToFollowUp()
        .then(paginateData(filter.limit, filter.offset)),
    defaultFilters,
  )
}

export const useGetCompanyByIdQuery = (
  id: Id | undefined,
  options?: UseQueryOpts<CompanyWithReportsCount, string[]>,
) => {
  const { api } = useApiContext()
  return useQuery({
    queryKey: GetCompanyByIdQueryKeys(id!),
    queryFn: () => api.secured.company.byId(id!).then((_) => _.entities[0]),
    enabled: !!id,
    ...options,
  })
}

export const useGetHostsQuery = (id: string) => {
  const { api } = useApiContext()
  return useQuery({
    queryKey: GetHostsQueryKeys(id),
    queryFn: () => api.secured.company.getHosts(id),
  })
}

export const useGetPhonesQuery = (id: string) => {
  const { api } = useApiContext()
  return useQuery({
    queryKey: GetPhonesQueryKeys(id),
    queryFn: () => api.secured.company.getPhones(id),
  })
}

export const useGetResponseRateQuery = (
  id: Id,
  options?: UseQueryOpts<number, string[]>,
) => {
  const { api } = useApiContext()
  return useQuery({
    queryKey: GetResponseRateQueryKeys(id),
    queryFn: () => api.secured.company.getResponseRate(id),
    ...options,
  })
}

export const useSearchByIdentityQuery = (
  identity: string,
  openOnly: boolean,
  options?: UseQueryOpts<CompanySearchResult[], string[]>,
) => {
  const { api } = useApiContext()
  return useQuery({
    queryKey: SearchByIdentityQueryKeys(identity, openOnly),
    queryFn: () => api.companies.searchCompaniesByIdentity(identity, openOnly),
    ...options,
  })
}

export const useCompanyAccessCountQuery = (siret: string) => {
  const { api } = useApiContext()
  return useQuery({
    queryKey: CompanyAccessCountQueryKeys(siret),
    queryFn: () => api.secured.companyAccess.count(siret),
  })
}

export const useCompanyAccessesQuery = (siret: string) => {
  const { api } = useApiContext()
  return useQuery({
    queryKey: CompanyAccessesFetchQueryKeys(siret),
    queryFn: () => api.secured.companyAccess.fetch(siret),
  })
}
