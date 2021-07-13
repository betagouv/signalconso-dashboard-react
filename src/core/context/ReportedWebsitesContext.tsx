import * as React from 'react'
import {ReactNode, useContext} from 'react'
import {usePaginate, UsePaginate} from '@alexandreannic/react-hooks-lib/lib'
import {SignalConsoApiSdk} from '../../App'
import {
    WebsiteWithCompany,
    WebsiteWithCompanySearch
} from "../api";
import {ApiError} from "../api";

export interface ReportedWebsiteWithCompanyContextProps {
  getWebsiteWithCompany: UsePaginate<WebsiteWithCompany, WebsiteWithCompanySearch>
}

interface Props {
  children: ReactNode
  api: SignalConsoApiSdk
}

const defaultContext: Partial<ReportedWebsiteWithCompanyContextProps> = {}

const ReportedWebsitesContext = React.createContext<ReportedWebsiteWithCompanyContextProps>(defaultContext as ReportedWebsiteWithCompanyContextProps)

export const ReportedWebsitesProvider = ({api, children}: Props) => {

  const listReportedWebsiteWithCompany = usePaginate<WebsiteWithCompany, WebsiteWithCompanySearch, ApiError>(
      api.secured.website.list,
      {limit: 10, offset: 0}
  )

  return (
      <ReportedWebsitesContext.Provider value={{
        getWebsiteWithCompany: listReportedWebsiteWithCompany
      }}>
        {children}
      </ReportedWebsitesContext.Provider>
  )
}

export const useReportedWebsiteWithCompanyContext = (): ReportedWebsiteWithCompanyContextProps => {
  return useContext<ReportedWebsiteWithCompanyContextProps>(ReportedWebsitesContext)
}
