import * as React from 'react'
import {ReactNode, useContext} from 'react'
import {UseFetcher, useFetcher, usePaginate, UsePaginate} from '@alexandreannic/react-hooks-lib/lib'
import {SignalConsoApiSdk} from '../../App'
import {ApiError, HostReportCountSearch, ApiHostWithReportCount} from "../api";

export interface UnregistredWebsiteWithCompanyContextProps {
    extractUnregistered: UseFetcher<SignalConsoApiSdk['secured']['website']['extractUnregistered'], ApiError>
    listUnregistred: UsePaginate<ApiHostWithReportCount, HostReportCountSearch>
}

interface Props {
    children: ReactNode
    api: SignalConsoApiSdk
}

const defaultContext: Partial<UnregistredWebsiteWithCompanyContextProps> = {}

const UnregistredWebsitesContext = React.createContext<UnregistredWebsiteWithCompanyContextProps>(defaultContext as UnregistredWebsiteWithCompanyContextProps)

export const UnregistredWebsitesProvider = ({api, children}: Props) => {

    const extractUnregistered = useFetcher(api.secured.website.extractUnregistered)
    const listUnregistred = usePaginate<ApiHostWithReportCount, HostReportCountSearch, ApiError>(
        api.secured.website.listUnregistered,
        {limit: 10, offset: 0}
    )

    return (
        <UnregistredWebsitesContext.Provider value={{
            extractUnregistered,
            listUnregistred
        }}>
            {children}
        </UnregistredWebsitesContext.Provider>
    )
}

export const useUnregistredWebsiteWithCompanyContext = (): UnregistredWebsiteWithCompanyContextProps => {
    return useContext<UnregistredWebsiteWithCompanyContextProps>(UnregistredWebsitesContext)
}
