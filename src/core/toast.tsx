import {useToast as useMuiToast} from 'mui-extension/lib/Toast/Toast'
import {ApiError} from 'core/api'
import {useI18n} from './i18n'

export const useToast = () => {
  const {toastError, ...toasts} = useMuiToast();
  const {m} = useI18n()
  return {
    toastError: (error: Partial<ApiError>) => {
      const errorMessage =  error.message || error.code ? error.message + ' ' + (error.code || '') : m.anErrorOccurred
      toastError(errorMessage)
    },
    ...toasts,
  };
};
