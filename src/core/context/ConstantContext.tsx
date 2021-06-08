import * as React from 'react'
import {ReactNode, useContext} from 'react'
import {UseFetchableReturn, useFetcher} from '@alexandreannic/react-hooks-lib/lib'
import {SignalConsoApiSdk} from '../../App'
import {Region, ReportStatus} from 'core/api'

export interface ConstantContextProps {
  reportStatus: UseFetchableReturn<ReportStatus[]>
  regions: UseFetchableReturn<Region[]>
}

interface Props {
  children: ReactNode
  api: SignalConsoApiSdk
}

const defaultContext: Partial<ConstantContextProps> = {}

const ConstantContext = React.createContext<ConstantContextProps>(defaultContext as ConstantContextProps)

export const ConstantProvider = ({api, children}: Props) => {

  const _reportStatus = useFetcher<ReportStatus[]>(api.secured.constant.getReportStatusList)
  const _regions = useFetcher<Region[]>(api.public.constant.getRegions)

  return (
    <ConstantContext.Provider value={{
      reportStatus: _reportStatus,
      regions: _regions,
    }}>
      {children}
    </ConstantContext.Provider>
  )
}

export const useConstantContext = (): ConstantContextProps => {
  return useContext<ConstantContextProps>(ConstantContext)
}
