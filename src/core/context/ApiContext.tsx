import * as React from 'react'
import {ReactNode, useContext} from 'react'
import {ConnectedApiSdk} from '../ApiSdkInstance'

// Simple context to access the api client directly

interface ApiContextProps {
  api: ConnectedApiSdk
}

interface Props {
  children: ReactNode
  api: ConnectedApiSdk
}

const ApiContext = React.createContext<ApiContextProps>({} as ApiContextProps)

export const ApiProvider = ({api, children}: Props) => {
  return <ApiContext.Provider value={{api}}>{children}</ApiContext.Provider>
}

export const useApiContext = (): ApiContextProps => {
  return useContext<ApiContextProps>(ApiContext)
}
