import * as React from 'react'
import {ReactNode, useContext} from 'react'
import {UseAsync, UseFetcher, useFetcher} from '@alexandreannic/react-hooks-lib/lib'
import {SignalConsoSecuredSdk} from '@betagouv/signalconso-api-sdk-js'
import {SignalConsoApiSdk} from '../../App'
import {useAsync} from '@alexandreannic/react-hooks-lib'

export interface AccessesContextProps {
  acceptToken: UseAsync<SignalConsoSecuredSdk['accesses']['acceptToken']>
}

interface Props {
  children: ReactNode
  api: SignalConsoApiSdk
}

const defaultContext: Partial<AccessesContextProps> = {}

const AccessesContext = React.createContext<AccessesContextProps>(defaultContext as AccessesContextProps)

export const AccessesProvider = ({api, children}: Props) => {
  const acceptToken = useAsync(api.secured.accesses.acceptToken)

  return (
    <AccessesContext.Provider
      value={{
        acceptToken,
      }}
    >
      {children}
    </AccessesContext.Provider>
  )
}

export const useAccessesContext = (): AccessesContextProps => {
  return useContext<AccessesContextProps>(AccessesContext)
}
