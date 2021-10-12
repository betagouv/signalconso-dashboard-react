import {useToast as useMuiToast} from 'mui-extension/lib/Toast/Toast'
import {ApiError} from '@signal-conso/signalconso-api-sdk-js'
import {useI18n} from './i18n'

export const useToast = () => {
  const {toastError, ...toasts} = useMuiToast()
  const {m} = useI18n()
  return {
    toastError: (error: Partial<ApiError>) => {
      console.error('[useToast]', error)
      // const errorMessage = error.message || error.code ? error.message + ' ' + (error.code || '') : m.anErrorOccurred
      toastError(!error.message || error.message === '' ? m.anErrorOccurred : error.message)
    },
    ...toasts,
  }
}
