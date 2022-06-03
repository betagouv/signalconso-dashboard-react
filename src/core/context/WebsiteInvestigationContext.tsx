import * as React from 'react'
import {ReactNode, useContext} from 'react'
import {UsePaginate} from '@alexandreannic/react-hooks-lib/lib'
import {SignalConsoApiSdk} from '../ApiSdkInstance'
import {WebsiteInvestigation, WebsiteKind, WebsiteWithCompanySearch} from '@signal-conso/signalconso-api-sdk-js'
import {useScPaginate} from '../../shared/usePaginate/usePaginate'

export interface WebsiteInvestigationContextProps {
  getWebsiteInvestigation: UsePaginate<WebsiteInvestigation, WebsiteWithCompanySearch>
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
  const listWebsiteInvestigation = useScPaginate<WebsiteInvestigation, WebsiteWithCompanySearch>(
    api.secured.website.listInvestigation,
    {limit: 10, offset: 0, kinds: [WebsiteKind.PENDING]},
  )

  return (
    <WebsiteInvestigationContext.Provider
      value={{
        getWebsiteInvestigation: listWebsiteInvestigation,
      }}
    >
      {children}
    </WebsiteInvestigationContext.Provider>
  )
}

export const useWebsiteInvestigationContext = (): WebsiteInvestigationContextProps => {
  return useContext<WebsiteInvestigationContextProps>(WebsiteInvestigationContext)
}
