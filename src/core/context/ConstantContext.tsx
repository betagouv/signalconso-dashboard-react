import * as React from 'react'
import {ReactNode, useContext} from 'react'
import {UseFetcher, useFetcher} from '@alexandreannic/react-hooks-lib/lib'
import {ApiError} from '@signal-conso/signalconso-api-sdk-js'
import {SignalConsoApiSdk} from '../ApiSdkInstance'

export interface ConstantContextProps {
  regions: UseFetcher<SignalConsoApiSdk['public']['constant']['getRegions'], ApiError>
  countries: UseFetcher<SignalConsoApiSdk['public']['constant']['getCountries'], ApiError>
}

interface Props {
  children: ReactNode
  api: SignalConsoApiSdk
}

const defaultContext: Partial<ConstantContextProps> = {}

const ConstantContext = React.createContext<ConstantContextProps>(defaultContext as ConstantContextProps)

export const ConstantProvider = ({api, children}: Props) => {
  const _regions = useFetcher(api.public.constant.getRegions)
  const _countries = useFetcher(api.public.constant.getCountries)

  return (
    <ConstantContext.Provider
      value={{
        regions: _regions,
        countries: _countries,
      }}
    >
      {children}
    </ConstantContext.Provider>
  )
}

export const useConstantContext = (): ConstantContextProps => {
  return useContext<ConstantContextProps>(ConstantContext)
}
