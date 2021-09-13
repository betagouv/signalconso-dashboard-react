import * as React from 'react'
import {ReactNode, useContext} from 'react'
import {UseFetcher, useFetcher, usePaginate, UsePaginate} from '@alexandreannic/react-hooks-lib/lib'
import {ApiError, CompanySearch, CompanyToActivate, CompanyUpdate, CompanyWithReportsCount, Id, PaginatedFilters} from 'core/api'
import {SignalConsoApiSdk} from '../../App'
import {paginateData} from '../helper/utils'
import {Address} from '../api/model/Address'

export interface CompaniesContextProps {
  activated: UsePaginate<CompanyWithReportsCount, CompanySearch>
  toActivate: UsePaginate<CompanyToActivate, PaginatedFilters>
  create: UseFetcher<SignalConsoApiSdk['secured']['company']['create'], ApiError>
  updateAddress: UseFetcher<SignalConsoApiSdk['secured']['company']['updateAddress'], ApiError>
  downloadActivationDocument: UseFetcher<SignalConsoApiSdk['secured']['company']['downloadActivationDocument'], ApiError>
  confirmCompaniesPosted: UseFetcher<SignalConsoApiSdk['secured']['company']['confirmCompaniesPosted'], ApiError>
  searchByIdentity: UseFetcher<SignalConsoApiSdk['public']['company']['searchCompaniesByIdentity'], ApiError>
  accessibleByPro: UseFetcher<SignalConsoApiSdk['secured']['company']['getAccessibleByPro'], ApiError>
  saveUndeliveredDocument: UseFetcher<SignalConsoApiSdk['secured']['company']['saveUndeliveredDocument'], ApiError>
  byId: UseFetcher<(id: Id) => ReturnType<SignalConsoApiSdk['secured']['company']['search']>, ApiError>
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
  const updateAddress = useFetcher(api.secured.company.updateAddress)
  const searchByIdentity = useFetcher(api.public.company.searchCompaniesByIdentity)
  const downloadActivationDocument = useFetcher(api.secured.company.downloadActivationDocument)
  const confirmCompaniesPosted = useFetcher(api.secured.company.confirmCompaniesPosted)
  const saveUndeliveredDocument = useFetcher(api.secured.company.saveUndeliveredDocument)
  const accessibleByPro = useFetcher(api.secured.company.getAccessibleByPro)
  const byId = useFetcher((id: Id) => api.secured.company.search({identity: id, limit: 1, offset: 0}))

  const updateRegisteredCompanyAddress = (id: Id, address: Address) => {
    activated.setEntity(companies => {
      if (!companies) return companies
      const company = companies?.data.find(company => company.id === id)
      if (company) {
        company.address = address
        return {...companies}
      }
      return companies
    })
  }

  return (
    <CompaniesContext.Provider
      value={{
        updateAddress: {
          ...updateAddress,
          fetch: (p: {force?: boolean; clean?: boolean} = {}, id: Id, update: CompanyUpdate) => {
            return updateAddress.fetch(p, id, update).then(_ => {
              updateRegisteredCompanyAddress(id, update.address)
              return _
            })
          },
        },
        create,
        activated,
        toActivate,
        searchByIdentity,
        downloadActivationDocument,
        confirmCompaniesPosted,
        accessibleByPro,
        saveUndeliveredDocument,
        byId,
      }}
    >
      {children}
    </CompaniesContext.Provider>
  )
}

export const useCompaniesContext = (): CompaniesContextProps => {
  return useContext<CompaniesContextProps>(CompaniesContext)
}
