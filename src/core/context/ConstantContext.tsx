import * as React from 'react'
import {ReactNode, useContext} from 'react'
import {UseFetchableReturn, useFetcher} from '@alexandreannic/react-hooks-lib/lib'
import {SignalConsoApiSdk} from '../../App'
import {ReportStatus} from '@signalconso/signalconso-api-sdk-js/build'

export interface ConstantContextProps {
  reportStatus: UseFetchableReturn<ReportStatus[]>
}

interface Props {
  children: ReactNode
  api: SignalConsoApiSdk
}

const defaultContext: Partial<ConstantContextProps> = {}

const ConstantContext = React.createContext<ConstantContextProps>(defaultContext as ConstantContextProps)

export const ConstantProvider = ({api, children}: Props) => {

  const _reportStatus = useFetcher<ReportStatus[]>(api.secured.constant.getReportStatusList)

  return (
    <ConstantContext.Provider value={{
      reportStatus: _reportStatus,
    }}>
      {children}
    </ConstantContext.Provider>
  )
}

export const useConstantContext = (): ConstantContextProps => {
  return useContext<ConstantContextProps>(ConstantContext)
}
