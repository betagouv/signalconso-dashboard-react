import * as React from 'react'
import {ReactNode, useContext} from 'react'
import {SignalConsoApiSdk} from '../ApiSdkInstance'
import {useFetcher, UseFetcher} from '../../alexlibs/react-hooks-lib'
import {ApiError} from '../client/ApiClient'

export interface WebsiteInvestigationContextProps {
  listInvestigationStatus: UseFetcher<SignalConsoApiSdk['secured']['website']['listInvestigationStatus'], ApiError>
  createOrUpdateInvestigation: UseFetcher<SignalConsoApiSdk['secured']['website']['createOrUpdateInvestigation'], ApiError>
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
