import * as React from 'react'
import {ReactNode, useContext} from 'react'
import {UseFetcher, useFetcher} from '../../alexlibs/react-hooks-lib'
import {SignalConsoApiSdk} from '../ApiSdkInstance'
import {ApiError} from '@signal-conso/signalconso-api-sdk-js'

export interface AnomalyContextProps {
  anomaly: UseFetcher<SignalConsoApiSdk['public']['anomaly']['getAnomalies'], ApiError>
  category: UseFetcher<SignalConsoApiSdk['public']['anomaly']['getCategories'], ApiError>
}

interface Props {
  children: ReactNode
  api: SignalConsoApiSdk
}

const defaultContext: Partial<AnomalyContextProps> = {}

const AnomalyContext = React.createContext<AnomalyContextProps>(defaultContext as AnomalyContextProps)

export const AnomalyProvider = ({api, children}: Props) => {
  const _anomaly = useFetcher(api.public.anomaly.getAnomalies)
  const _category = useFetcher(api.public.anomaly.getCategories)

  return (
    <AnomalyContext.Provider
      value={{
        anomaly: _anomaly,
        category: _category,
      }}
    >
      {children}
    </AnomalyContext.Provider>
  )
}

export const useAnomalyContext = (): AnomalyContextProps => {
  return useContext<AnomalyContextProps>(AnomalyContext)
}
