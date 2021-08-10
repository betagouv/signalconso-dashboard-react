import * as React from 'react'
import {ReactNode, useContext} from 'react'
import {UseFetcher, useFetcher, usePaginate, UsePaginate} from '@alexandreannic/react-hooks-lib/lib'
import {SignalConsoApiSdk} from '../../App'
import {
    ReportNotificationBlockList,
    ReportNotificationBlockListSearch
} from "../api/client/settings/ReportNotificationBlocklist";
import {ApiError} from "../api";

export interface ReportNotificationBlockListContextProps {
    getReportNotificationBlockList: UsePaginate<ReportNotificationBlockList, ReportNotificationBlockListSearch>
    remove: UseFetcher<SignalConsoApiSdk['secured']['settings']['remove'], ApiError>
    create: UseFetcher<SignalConsoApiSdk['secured']['settings']['create'], ApiError>
}

interface Props {
    children: ReactNode
    api: SignalConsoApiSdk
}

const defaultContext: Partial<ReportNotificationBlockListContextProps> = {}

const ReportNotificationBlockListContext = React.createContext<ReportNotificationBlockListContextProps>(
    defaultContext as ReportNotificationBlockListContextProps,
)

export const ReportNotificationBlockListProvider = ({api, children}: Props) => {

    const list = usePaginate<ReportNotificationBlockList, ReportNotificationBlockListSearch>(
        (_: ReportNotificationBlockListSearch) =>
            api.secured.settings.list(_).then(_ => ({
                data: _.entities,
                totalSize: _.totalCount,
            })),
        {limit: 10, offset: 0},
    )

    const create = useFetcher(api.secured.settings.create)
    const remove = useFetcher(api.secured.settings.remove)

    return (
        <ReportNotificationBlockListContext.Provider
            value={{
                getReportNotificationBlockList: list,
                create,
                remove
            }}
        >
            {children}
        </ReportNotificationBlockListContext.Provider>
    )
}

export const useReportNotificationBlockListContext = (): ReportNotificationBlockListContextProps => {
    return useContext<ReportNotificationBlockListContextProps>(ReportNotificationBlockListContext)
}
