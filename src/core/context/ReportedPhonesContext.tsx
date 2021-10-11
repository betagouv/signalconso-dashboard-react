import * as React from 'react'
import {ReactNode, useContext} from 'react'
import {UseFetcher, useFetcher, UsePaginate, usePaginate} from '@alexandreannic/react-hooks-lib/lib'
import {paginateData, sortData, sortPaginatedData} from '../helper/utils'
import {SignalConsoApiSdk} from '../ApiSdkInstance'
import {ReportedPhone, ReportedPhoneSearch} from '@betagouv/signalconso-api-sdk-js'

export interface ReportedPhonesContextProps extends UsePaginate<ReportedPhone, ReportedPhoneSearch> {
  extract: UseFetcher<() => Promise<void>>
}

interface Props {
  children: ReactNode
  api: SignalConsoApiSdk
}

const defaultContext: Partial<ReportedPhonesContextProps> = {}

const ReportedPhonesContext = React.createContext<ReportedPhonesContextProps>(defaultContext as ReportedPhonesContextProps)

export const ReportedPhonesProvider = ({api, children}: Props) => {
  const paginated = usePaginate<ReportedPhone, ReportedPhoneSearch>(
    search => {
      const {limit, offset, sortBy = 'count', orderBy = 'desc', ...filters} = search
      return api.secured.reportedPhone.list(filters).then(sortData(sortBy, orderBy)).then(paginateData(limit, offset))
    },
    {limit: 10, offset: 0},
  )

  const extract = useFetcher(() => api.secured.reportedPhone.extract(paginated.filters))

  return (
    <ReportedPhonesContext.Provider
      value={{
        ...paginated,
        extract,
      }}
    >
      {children}
    </ReportedPhonesContext.Provider>
  )
}

export const useReportedPhonesContext = (): ReportedPhonesContextProps => {
  return useContext<ReportedPhonesContextProps>(ReportedPhonesContext)
}
