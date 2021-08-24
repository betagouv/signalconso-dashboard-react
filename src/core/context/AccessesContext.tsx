import * as React from 'react'
import {ReactNode, useContext} from 'react'
import {UseFetcher, useFetcher} from '@alexandreannic/react-hooks-lib/lib'
import {SignalConsoSecuredSdk} from 'core/api'
import {SignalConsoApiSdk} from '../../App'

export interface AccessesContextProps {
  acceptToken: UseFetcher<SignalConsoSecuredSdk['accesses']['acceptToken']>
}

interface Props {
  children: ReactNode
  api: SignalConsoApiSdk
}

const defaultContext: Partial<AccessesContextProps> = {}

const AccessesContext = React.createContext<AccessesContextProps>(defaultContext as AccessesContextProps)

export const AccessesProvider = ({api, children}: Props) => {

  const acceptToken = useFetcher(api.secured.accesses.acceptToken)

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
