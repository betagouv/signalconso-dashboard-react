import * as React from 'react'
import {ReactNode, useContext} from 'react'
import {UseFetcher, useFetcher, usePaginate, UsePaginate} from '@alexandreannic/react-hooks-lib/lib'
import {SignalConsoApiSdk} from '../../App'
import {ApiHostWithReportCount, HostReportCountSearch} from "../api";
import {sortPaginatedData} from "../helper/utils";

export interface UnregistredWebsiteWithCompanyContextProps extends UsePaginate<ApiHostWithReportCount, HostReportCountSearch> {
    extractUnregistered: UseFetcher<() => Promise<void>>
}

interface Props {
    children: ReactNode
    api: SignalConsoApiSdk
}

const defaultContext: Partial<UnregistredWebsiteWithCompanyContextProps> = {}

const UnregistredWebsitesContext = React.createContext<UnregistredWebsiteWithCompanyContextProps>(defaultContext as UnregistredWebsiteWithCompanyContextProps)

export const UnregistredWebsitesProvider = ({api, children}: Props) => {

    const listUnregistred = usePaginate<ApiHostWithReportCount, HostReportCountSearch>(search => {
        return api.secured.website.listUnregistered(search)
            .then(sortPaginatedData('count', 'desc'))
    }, {limit: 10, offset: 0, q: ''})


    const extractUnregistered = useFetcher(() => api.secured.website.extractUnregistered(listUnregistred.filters))


    return (
        <UnregistredWebsitesContext.Provider value={{
            ...listUnregistred,
            extractUnregistered,
        }}>
            {children}
        </UnregistredWebsitesContext.Provider>
    )
}

export const useUnregistredWebsiteWithCompanyContext = (): UnregistredWebsiteWithCompanyContextProps => {
    return useContext<UnregistredWebsiteWithCompanyContextProps>(UnregistredWebsitesContext)
}
