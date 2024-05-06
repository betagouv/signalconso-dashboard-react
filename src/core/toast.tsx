import {useToast as useMuiToast} from '../alexlibs/mui-extension'
import {useI18n} from './i18n'
import {ApiError} from './client/ApiClient'
import {Index} from './helper'

export const useToast = () => {
  const {toastError, ...toasts} = useMuiToast()
  const {m} = useI18n()

  const askForRefreshMessage =
    'Merci de rafraîchir la page, puis de réessayer. Si cela ne fonctionne toujours pas, réessayez plus tard ou contactez le support.'

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

  const doToastError = (error: Partial<ApiError>) => {
    const baseErrorMessage = getErrorMessage(error)
    const errorDetailsCode = error.details?.code === 400 ? `${baseErrorMessage} ${askForRefreshMessage}` : baseErrorMessage
    toastError(errorDetailsCode)
  }

  return {
    toastError: doToastError,
    toastErrorIfDefined: (error: Partial<ApiError> | undefined) => {
      if (error !== undefined) {
        doToastError(error)
      }
    },
    ...toasts,
  }
}
