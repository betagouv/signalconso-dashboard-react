import * as React from 'react'
import {ReactNode, useContext} from 'react'
import {usePaginate, UsePaginate} from '@alexandreannic/react-hooks-lib/lib'
import {ReportSearch, ReportSearchResult} from 'core/api'
import {SignalConsoApiSdk} from '../../App'

export interface UsersContextProps extends UsePaginate<ReportSearchResult, ReportSearch> {
  extract: (_?: ReportSearch) => Promise<void>
}

interface Props {
  children: ReactNode
  api: SignalConsoApiSdk
}

const defaultContext: Partial<UsersContextProps> = {}

const UsersContext = React.createContext<UsersContextProps>(defaultContext as UsersContextProps)

export const UsersProvider = ({api, children}: Props) => {

  const _paginate = usePaginate<ReportSearchResult, ReportSearch>(
    (_: ReportSearch) => api.secured.reports.search(_).then(_ => ({data: _.entities, totalSize: _.totalCount})),
    {limit: 10, offset: 0}
  )

  return (
    <UsersContext.Provider value={{
      ..._paginate,
      extract: () => api.secured.reports.extract(_paginate.filters),
    }}>
      {children}
    </UsersContext.Provider>
  )
}

export const useUsersContext = (): UsersContextProps => {
  return useContext<UsersContextProps>(UsersContext)
}
