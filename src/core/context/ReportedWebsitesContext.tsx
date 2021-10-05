import * as React from 'react'
import {ReactNode, useContext} from 'react'
import {UseFetcher, useFetcher, usePaginate, UsePaginate} from '@alexandreannic/react-hooks-lib/lib'
import {SignalConsoApiSdk} from '../../App'
import {ApiError, WebsiteKind, WebsiteWithCompany, WebsiteWithCompanySearch} from '@betagouv/signalconso-api-sdk-js'
import {mapPromiseSdkPaginateToHook} from '../helper/utils'

export interface ReportedWebsiteWithCompanyContextProps {
  getWebsiteWithCompany: UsePaginate<WebsiteWithCompany, WebsiteWithCompanySearch>
  remove: UseFetcher<SignalConsoApiSdk['secured']['website']['remove'], ApiError>
  update: UseFetcher<SignalConsoApiSdk['secured']['website']['update'], ApiError>
  updateCompany: UseFetcher<SignalConsoApiSdk['secured']['website']['updateCompany'], ApiError>
}

interface Props {
  children: ReactNode
  api: SignalConsoApiSdk
}

const defaultContext: Partial<ReportedWebsiteWithCompanyContextProps> = {}

const ReportedWebsitesContext = React.createContext<ReportedWebsiteWithCompanyContextProps>(
  defaultContext as ReportedWebsiteWithCompanyContextProps,
)

export const ReportedWebsitesProvider = ({api, children}: Props) => {
  const listReportedWebsiteWithCompany = usePaginate<WebsiteWithCompany, WebsiteWithCompanySearch>(
    mapPromiseSdkPaginateToHook(api.secured.website.list),
    {limit: 10, offset: 0, kinds: [WebsiteKind.PENDING]},
  )

  const remove = useFetcher(api.secured.website.remove)
  const update = useFetcher(api.secured.website.update)
  const updateCompany = useFetcher(api.secured.website.updateCompany)

  return (
    <ReportedWebsitesContext.Provider
      value={{
        getWebsiteWithCompany: listReportedWebsiteWithCompany,
        remove,
        update,
        updateCompany,
      }}
    >
      {children}
    </ReportedWebsitesContext.Provider>
  )
}

export const useReportedWebsiteWithCompanyContext = (): ReportedWebsiteWithCompanyContextProps => {
  return useContext<ReportedWebsiteWithCompanyContextProps>(ReportedWebsitesContext)
}
