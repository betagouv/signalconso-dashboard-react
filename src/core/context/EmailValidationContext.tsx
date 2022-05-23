import * as React from 'react'
import {ReactNode, useCallback, useContext} from 'react'
import {UsePaginate, useSetState} from '@alexandreannic/react-hooks-lib/lib'
import {SignalConsoApiSdk} from '../ApiSdkInstance'
import {ConsumerEmailValidation, ConsumerEmailValidationSearch} from '../../../../signalconso-api-sdk-js/lib/client/consumer-email-validation/ConsumerEmailValidation'
import {useScPaginate} from '../../shared/usePaginate/usePaginate'

export interface ConsumerEmailValidationContextProps {
  search: UsePaginate<ConsumerEmailValidation, ConsumerEmailValidationSearch>
  validate: {
    call: SignalConsoApiSdk['secured']['consumerEmailValidation']['validate']
    isLoading: (t: string) => boolean
    isNowValid: (t: string) => boolean
    hasError: (t: string) => boolean
  }
}

interface Props {
  children: ReactNode
  api: SignalConsoApiSdk
}

const defaultContext: Partial<ConsumerEmailValidationContextProps> = {}

const ConsumerEmailValidationContext = React.createContext<ConsumerEmailValidationContextProps>(defaultContext as ConsumerEmailValidationContextProps)

export const ConsumerEmailValidationProvider = ({api, children}: Props) => {
  const search = useScPaginate(api.secured.consumerEmailValidation.search, {
    limit: 10,
    offset: 0,
  })
  const validateLoading = useSetState<string>()
  const validated = useSetState<string>()
  const validateError = useSetState<string>()
  const validate = useCallback(async (email: string) => {
    try {
      validateLoading.add(email)
      validateError.delete(email)
      const res = await api.secured.consumerEmailValidation.validate(email)
      validated.add(email)
      validateLoading.delete(email)
      return res
    } catch (e: any) {
      console.error(e)
      validateError.add(email)
      return {valid: false}
    }
  }, [])

  return (
    <ConsumerEmailValidationContext.Provider
      value={{
        search,
        validate: {
          call: validate,
          isLoading: validateLoading.has,
          isNowValid: validated.has,
          hasError: validateError.has,
        },
      }}
    >
      {children}
    </ConsumerEmailValidationContext.Provider>
  )
}

export const useConsumerEmailValidationContext = (): ConsumerEmailValidationContextProps => {
  return useContext<ConsumerEmailValidationContextProps>(ConsumerEmailValidationContext)
}
