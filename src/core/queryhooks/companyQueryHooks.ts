import {useQuery} from '@tanstack/react-query'
import {useApiContext} from '../context/ApiContext'
import {UseQueryOpts} from './types'
import {CompanyWithAccessLevel, PaginatedFilters} from '../model'
import {useQueryPaginate} from './UseQueryPaginate'
import {paginateData} from '../helper'

export const GetAccessibleByProQueryKeys = ['company_getAccessibleByPro']
export const ActivatedCompanySearchQueryKeys = ['company_search']
export const CompanyToActivateSearchQueryKeys = ['company_fetchToActivate']
export const CompanyToFollowUpSearchQueryKeys = ['company_fetchToFollowUp']

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
