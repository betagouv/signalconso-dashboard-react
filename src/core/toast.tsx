import {useToast as useMuiToast} from 'mui-extension/lib/Toast/Toast';
import {ApiError} from '@signalconso/signalconso-api-sdk-js';

export const useToast = () => {
  const {toastError, ...toasts} = useMuiToast();
  return {
    toastError: (error: ApiError) => toastError(error.message + ' ' + (error.code || '')),
    ...toasts,
  };
};
