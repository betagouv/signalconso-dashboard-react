import * as React from 'react'
import {ReactNode, useContext} from 'react'
import {UseFetcher, useFetcher} from '@alexandreannic/react-hooks-lib/lib'
import {SignalConsoApiSdk} from '../ApiSdkInstance'
import {ApiError} from '@betagouv/signalconso-api-sdk-js'

export interface AsyncFileContextProps extends UseFetcher<SignalConsoApiSdk['secured']['asyncFiles']['fetch'], ApiError> {}

interface Props {
  children: ReactNode
  api: SignalConsoApiSdk
}

const defaultContext: Partial<AsyncFileContextProps> = {}

const AsyncFileContext = React.createContext<AsyncFileContextProps>(defaultContext as AsyncFileContextProps)

export const AsyncFileProvider = ({api, children}: Props) => {
  const _asyncFilesStatus = useFetcher(api.secured.asyncFiles.fetch)

  return (
    <AsyncFileContext.Provider
      value={{
        ..._asyncFilesStatus,
      }}
    >
      {children}
    </AsyncFileContext.Provider>
  )
}

export const useAsyncFileContext = (): AsyncFileContextProps => {
  return useContext<AsyncFileContextProps>(AsyncFileContext)
}
