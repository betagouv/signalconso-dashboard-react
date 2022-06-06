import * as React from 'react'
import {ReactNode, useContext} from 'react'
import {UsePaginate} from '@alexandreannic/react-hooks-lib/lib'
import {SignalConsoApiSdk} from '../ApiSdkInstance'
import {
  ApiError,
  WebsiteInvestigationWithCount,
  WebsiteKind,
  WebsiteWithCompanySearch
} from '@signal-conso/signalconso-api-sdk-js'
import {useScPaginate} from '../../shared/usePaginate/usePaginate'
import {useFetcher, UseFetcher} from "@alexandreannic/react-hooks-lib";

export interface WebsiteInvestigationContextProps {
  getWebsiteInvestigation: UsePaginate<WebsiteInvestigationWithCount, WebsiteWithCompanySearch>
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
  const listWebsiteInvestigation = useScPaginate<WebsiteInvestigationWithCount, WebsiteWithCompanySearch>(
    api.secured.website.listInvestigation,
    {limit: 10, offset: 0, kinds: [WebsiteKind.DEFAULT, WebsiteKind.PENDING]},
  )



  return (
    <WebsiteInvestigationContext.Provider
      value={{
        getWebsiteInvestigation: listWebsiteInvestigation,
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
