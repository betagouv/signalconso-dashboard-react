import {ReactNode, useContext} from 'react'
import {SignalConsoApiSdk} from '../ApiSdkInstance'
import {useFetcher, UseFetcher} from '../../alexlibs/react-hooks-lib'
import {ApiError} from '../client/ApiClient'
import * as React from 'react'

export interface GS1ContextProps {
  get: UseFetcher<SignalConsoApiSdk['secured']['gs1']['get'], ApiError>
}

interface Props {
  children: ReactNode
  api: SignalConsoApiSdk
}

const defaultContext: Partial<GS1ContextProps> = {}

const GS1Context = React.createContext<GS1ContextProps>(defaultContext as GS1ContextProps)

export const GS1Provider = ({api, children}: Props) => {
  const get = useFetcher(api.secured.gs1.get)

  return (
    <GS1Context.Provider
      value={{
        get,
      }}
    >
      {children}
    </GS1Context.Provider>
  )
}

export const useReportContext = (): GS1ContextProps => {
  return useContext<GS1ContextProps>(GS1Context)
}
