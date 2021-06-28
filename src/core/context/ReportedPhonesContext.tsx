import * as React from 'react'
import {ReactNode, useContext} from 'react'
import {UsePaginate, usePaginate} from '@alexandreannic/react-hooks-lib/lib'
import {SignalConsoApiSdk} from '../../App'
import {ReportedPhone, ReportedPhoneSearch} from '../api'
import {sortPaginatedData, paginateData} from '../helper/utils'

export interface ReportedPhonesContextProps extends UsePaginate<ReportedPhone, ReportedPhoneSearch> {
  extract: () => Promise<void>
}

interface Props {
  children: ReactNode
  api: SignalConsoApiSdk
}

const defaultContext: Partial<ReportedPhonesContextProps> = {}

const ReportedPhonesContext = React.createContext<ReportedPhonesContextProps>(defaultContext as ReportedPhonesContextProps)

export const ReportedPhonesProvider = ({api, children}: Props) => {

  const paginated = usePaginate<ReportedPhone, ReportedPhoneSearch>(search => {
    const {limit, offset, sortBy = 'count', orderBy = 'desc', ...filters} = search
    return api.secured.reportedPhone.list(filters)
      .then(paginateData(limit, offset))
      .then(sortPaginatedData(sortBy, orderBy))
  }, {limit: 10, offset: 0})

  const extract = () => {
    return api.secured.reportedPhone.extract(paginated.filters)
  }

  return (
    <ReportedPhonesContext.Provider value={{
      ...paginated,
      extract,
    }}>
      {children}
    </ReportedPhonesContext.Provider>
  )
}

export const useReportedPhonesContext = (): ReportedPhonesContextProps => {
  return useContext<ReportedPhonesContextProps>(ReportedPhonesContext)
}
