import * as React from 'react'
import {ReactNode, useContext} from 'react'
import {SignalConsoApiSdk} from '../ApiSdkInstance'
import {useFetcher, Fetcher} from '../../alexlibs/react-hooks-lib'
import {ApiError} from '../client/ApiClient'

export interface WebsiteInvestigationContextProps {
  listDepartmentDivision: Fetcher<SignalConsoApiSdk['secured']['website']['listDepartmentDivision'], ApiError>
  listPractice: Fetcher<SignalConsoApiSdk['secured']['website']['listPractice'], ApiError>
  listInvestigationStatus: Fetcher<SignalConsoApiSdk['secured']['website']['listInvestigationStatus'], ApiError>
  createOrUpdateInvestigation: Fetcher<SignalConsoApiSdk['secured']['website']['createOrUpdateInvestigation'], ApiError>
}

interface Props {
  children: ReactNode
  api: SignalConsoApiSdk
}

const defaultContext: Partial<WebsiteInvestigationContextProps> = {}

const WebsiteInvestigationContext = React.createContext<WebsiteInvestigationContextProps>(
  defaultContext as WebsiteInvestigationContextProps,
)

export const WebsiteInvestigationProvider = ({api, children}: Props) => {
  return (
    <WebsiteInvestigationContext.Provider
      value={{
        listDepartmentDivision: useFetcher(api.secured.website.listDepartmentDivision),
        listPractice: useFetcher(api.secured.website.listPractice),
        listInvestigationStatus: useFetcher(api.secured.website.listInvestigationStatus),
        createOrUpdateInvestigation: useFetcher(api.secured.website.createOrUpdateInvestigation),
      }}
    >
      {children}
    </WebsiteInvestigationContext.Provider>
  )
}

export const useWebsiteInvestigationContext = (): WebsiteInvestigationContextProps => {
  return useContext<WebsiteInvestigationContextProps>(WebsiteInvestigationContext)
}
