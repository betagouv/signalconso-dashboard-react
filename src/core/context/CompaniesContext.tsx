import * as React from 'react'
import {ReactNode, useContext} from 'react'
import {UseFetcher, useFetcher, usePaginate, UsePaginate} from '@alexandreannic/react-hooks-lib/lib'
import {ApiError, CompanySearch, CompanyToActivate, CompanyWithReportsCount, PaginatedFilters} from 'core/api'
import {SignalConsoApiSdk} from '../../App'
import {paginateData} from '../helper/utils'

export interface CompaniesContextProps {
  activated: UsePaginate<CompanyWithReportsCount, CompanySearch>
  toActivate: UsePaginate<CompanyToActivate, PaginatedFilters>
  create: UseFetcher<SignalConsoApiSdk['secured']['company']['create'], ApiError>
  downloadActivationDocument: UseFetcher<SignalConsoApiSdk['secured']['company']['downloadActivationDocument'], ApiError>
  confirmCompaniesPosted: UseFetcher<SignalConsoApiSdk['secured']['company']['confirmCompaniesPosted'], ApiError>
  searchByIdentity: UseFetcher<SignalConsoApiSdk['public']['company']['searchCompaniesByIdentity'], ApiError>
  accessesByPro: UseFetcher<SignalConsoApiSdk['secured']['company']['getCompaniesAccessibleByPro'], ApiError>
  viewableByPro: UseFetcher<SignalConsoApiSdk['secured']['company']['getCompaniesVisibleByPro'], ApiError>
  saveUndeliveredDocument: UseFetcher<SignalConsoApiSdk['secured']['company']['saveUndeliveredDocument'], ApiError>
}

interface Props {
  children: ReactNode
  api: SignalConsoApiSdk
}

const defaultContext: Partial<CompaniesContextProps> = {}

const CompaniesContext = React.createContext<CompaniesContextProps>(defaultContext as CompaniesContextProps)

export const CompaniesProvider = ({api, children}: Props) => {
  const activated = usePaginate<CompanyWithReportsCount, CompanySearch>(
    (_: CompanySearch) => api.secured.company.search(_).then(_ => ({data: _.entities, totalSize: _.totalCount})),
    {limit: 10, offset: 0},
  )
  const toActivate = usePaginate<CompanyToActivate, PaginatedFilters>(
    (filter: PaginatedFilters) =>
      api.secured.company
        .fetchToActivate()
        .then(_ => _.sort((a, b) => b.tokenCreation.getTime() - a.tokenCreation.getTime()))
        .then(paginateData(filter.limit, filter.offset)),
    {limit: 500, offset: 0},
  )
  const create = useFetcher(api.secured.company.create)
  const searchByIdentity = useFetcher(api.public.company.searchCompaniesByIdentity)
  const downloadActivationDocument = useFetcher(api.secured.company.downloadActivationDocument)
  const confirmCompaniesPosted = useFetcher(api.secured.company.confirmCompaniesPosted)
  const saveUndeliveredDocument = useFetcher(api.secured.company.saveUndeliveredDocument)
  const accessesByPro = useFetcher(api.secured.company.getCompaniesAccessibleByPro)
  const viewableByPro = useFetcher(api.secured.company.getCompaniesVisibleByPro)

  return (
    <CompaniesContext.Provider
      value={{
        create,
        activated,
        toActivate,
        searchByIdentity,
        downloadActivationDocument,
        confirmCompaniesPosted,
        accessesByPro,
        viewableByPro,
        saveUndeliveredDocument,
      }}
    >
      {children}
    </CompaniesContext.Provider>
  )
}

export const useCompaniesContext = (): CompaniesContextProps => {
  return useContext<CompaniesContextProps>(CompaniesContext)
}
