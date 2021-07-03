import * as React from 'react'
import {ReactNode, useContext} from 'react'
import {UseFetchableReturn, useFetcher, usePaginate, UsePaginate} from '@alexandreannic/react-hooks-lib/lib'
import {CompanySearch, CompanyToActivate, CompanyWithReportsCount, PaginatedFilters} from 'core/api'
import {SignalConsoApiSdk} from '../../App'
import {paginateData} from '../helper/utils'

export interface CompaniesContextProps extends UsePaginate<CompanyWithReportsCount, CompanySearch> {
  toActivate: UsePaginate<CompanyToActivate, PaginatedFilters>
  downloadActivationDocument: UseFetchableReturn<void>
  confirmCompaniesPosted: UseFetchableReturn<void>
}

interface Props {
  children: ReactNode
  api: SignalConsoApiSdk
}

const defaultContext: Partial<CompaniesContextProps> = {}

const CompaniesContext = React.createContext<CompaniesContextProps>(defaultContext as CompaniesContextProps)

export const CompaniesProvider = ({api, children}: Props) => {

  const _paginate = usePaginate<CompanyWithReportsCount, CompanySearch>(
    (_: CompanySearch) => api.secured.company.search(_).then(_ => ({data: _.entities, totalSize: _.totalCount})),
    {limit: 10, offset: 0}
  )

  const _paginateToActivate = usePaginate<CompanyToActivate, PaginatedFilters>(
    (filter: PaginatedFilters) => api.secured.company.fetchToActivate()
      .then(_ => _.sort((a, b) => (b.tokenCreation.getTime() - a.tokenCreation.getTime())))
      .then(paginateData(filter.limit, filter.offset))
    ,
    {limit: 100, offset: 0}
  )

  const downloadActivationDocument = useFetcher<void>(api.secured.company.downloadActivationDocument)
  const confirmCompaniesPosted = useFetcher<void>(api.secured.company.confirmCompaniesPosted)

  return (
    <CompaniesContext.Provider value={{
      ..._paginate,
      toActivate: _paginateToActivate,
      downloadActivationDocument: downloadActivationDocument,
      confirmCompaniesPosted: confirmCompaniesPosted,
    }}>
      {children}
    </CompaniesContext.Provider>
  )
}

export const useCompaniesContext = (): CompaniesContextProps => {
  return useContext<CompaniesContextProps>(CompaniesContext)
}
