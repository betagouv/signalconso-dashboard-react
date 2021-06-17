import * as React from 'react'
import {ReactNode, useContext} from 'react'
import {UseFetchableReturn, useFetcher} from '@alexandreannic/react-hooks-lib/lib'
import {SignalConsoApiSdk} from '../../App'
import {AsyncFile} from '../api/client/async-file/AsyncFile'

export interface AsyncFileContextProps extends UseFetchableReturn<AsyncFile[]> {
}

interface Props {
  children: ReactNode
  api: SignalConsoApiSdk
}

const defaultContext: Partial<AsyncFileContextProps> = {}

const AsyncFileContext = React.createContext<AsyncFileContextProps>(defaultContext as AsyncFileContextProps)

export const AsyncFileProvider = ({api, children}: Props) => {

  const _asyncFilesStatus = useFetcher<AsyncFile[]>(api.secured.asyncFiles.fetch)

  return (
    <AsyncFileContext.Provider value={{
      ..._asyncFilesStatus,
    }}>
      {children}
    </AsyncFileContext.Provider>
  )
}

export const useAsyncFileContext = (): AsyncFileContextProps => {
  return useContext<AsyncFileContextProps>(AsyncFileContext)
}
