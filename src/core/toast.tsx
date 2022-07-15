import {useToast as useMuiToast} from '../alexlibs/mui-extension'
import {useI18n} from './i18n'
import {ApiError} from './client/ApiClient'
import {Index} from './helper'

export const useToast = () => {
  const {toastError, ...toasts} = useMuiToast()
  const {m} = useI18n()

  const getErrorMessage = (err: Partial<ApiError>) => {
    console.error(JSON.stringify(err.details))
    if (err.details?.id && (m.apiErrorsCode as Index<string>)[err.details.id]) {
      return (m.apiErrorsCode as any)[err.details.id]
    }
    if (err.message && err.message !== '') {
      return err.message
    }
    return m.anErrorOccurred
  }

  return {
    toastError: (error: Partial<ApiError>) => toastError(getErrorMessage(error)),
    ...toasts,
  }
}
