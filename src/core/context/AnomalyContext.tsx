import * as React from 'react'
import {ReactNode, useContext} from 'react'
import {UseFetchableReturn, useFetcher} from '@alexandreannic/react-hooks-lib/lib'
import {SignalConsoApiSdk} from '../../App'
import {Anomaly} from '@signalconso/signalconso-api-sdk-js/build'

export interface AnomalyContextProps {
  anomaly: UseFetchableReturn<Anomaly[]>
  category: UseFetchableReturn<string[]>
}

interface Props {
  children: ReactNode
  api: SignalConsoApiSdk
}

const defaultContext: Partial<AnomalyContextProps> = {}

const AnomalyContext = React.createContext<AnomalyContextProps>(defaultContext as AnomalyContextProps)

export const AnomalyProvider = ({api, children}: Props) => {

  const _anomaly = useFetcher<Anomaly[]>(api.public.anomaly.getAnomalies)
  const _category = useFetcher<string[]>(api.public.anomaly.getCategories)

  return (
    <AnomalyContext.Provider value={{
      anomaly: _anomaly,
      category: _category,
    }}>
      {children}
    </AnomalyContext.Provider>
  )
}

export const useAnomalyContext = (): AnomalyContextProps => {
  return useContext<AnomalyContextProps>(AnomalyContext)
}
