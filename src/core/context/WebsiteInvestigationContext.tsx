import * as React from 'react'
import {ReactNode, useContext} from 'react'
import {SignalConsoApiSdk} from '../ApiSdkInstance'
import {ApiError,} from '@signal-conso/signalconso-api-sdk-js'
import {useFetcher, UseFetcher} from '@alexandreannic/react-hooks-lib'

export interface WebsiteInvestigationContextProps {
  listDepartmentDivision: UseFetcher<SignalConsoApiSdk['secured']['website']['listDepartmentDivision'], ApiError>
  listPractice: UseFetcher<SignalConsoApiSdk['secured']['website']['listPractice'], ApiError>
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
