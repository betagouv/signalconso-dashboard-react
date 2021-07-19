import * as React from 'react'
import {ReactNode, useContext} from 'react'
import {UseFetcher, useFetcher, usePaginate, UsePaginate} from '@alexandreannic/react-hooks-lib/lib'
import {SignalConsoApiSdk} from '../../App'
import {
    WebsiteWithCompany,
    WebsiteWithCompanySearch
} from "../api";
import {ApiError} from "../api";

export interface ReportedWebsiteWithCompanyContextProps {
    getWebsiteWithCompany: UsePaginate<WebsiteWithCompany, WebsiteWithCompanySearch>
    remove: UseFetcher<SignalConsoApiSdk['secured']['website']['remove'], ApiError>
    update: UseFetcher<SignalConsoApiSdk['secured']['website']['update'], ApiError>
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
    const remove = useFetcher(api.secured.website.remove)
    const update = useFetcher(api.secured.website.update)

    return (
        <ReportedWebsitesContext.Provider value={{
            getWebsiteWithCompany: listReportedWebsiteWithCompany,
            remove,
            update
        }}>
            {children}
        </ReportedWebsitesContext.Provider>
    )
}

export const useReportedWebsiteWithCompanyContext = (): ReportedWebsiteWithCompanyContextProps => {
    return useContext<ReportedWebsiteWithCompanyContextProps>(ReportedWebsitesContext)
}
