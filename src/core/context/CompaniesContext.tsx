import * as React from 'react'
import {ReactNode, useContext} from 'react'
import {usePaginate, UsePaginate} from '@alexandreannic/react-hooks-lib/lib'
import {CompanySearch, CompanyWithReportsCount} from 'core/api'
import {SignalConsoApiSdk} from '../../App'
import {paginateData} from '../helper/utils'

export interface CompaniesContextProps extends UsePaginate<CompanyWithReportsCount, CompanySearch> {
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

  return (
    <CompaniesContext.Provider value={{
      ..._paginate,
    }}>
      {children}
    </CompaniesContext.Provider>
  )
}

export const useCompaniesContext = (): CompaniesContextProps => {
  return useContext<CompaniesContextProps>(CompaniesContext)
}
