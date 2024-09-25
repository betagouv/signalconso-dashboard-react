import { Button, Icon, Slide, SlideProps, Snackbar } from '@mui/material'
import {
  colorError,
  colorInfo,
  colorSuccess,
} from 'alexlibs/mui-extension/color'
import { ApiError } from 'core/client/ApiClient'
import { Index } from 'core/helper'
import { I18nContextProps, useI18n } from 'core/i18n/I18n'
import { noop } from 'lodash'
import * as React from 'react'
import { ReactNode, useContext, useState } from 'react'

type ToastType = 'error' | 'success' | 'info'

type ToastContext = {
  toastError: (e: Partial<ApiError>) => void
  toastSuccess: (m: string) => void
  toastInfo: (m: string) => void
}

const toastContext = React.createContext<ToastContext>({
  toastError: noop,
  toastSuccess: noop,
  toastInfo: noop,
})

export const ToastProvider = ({ children }: { children: ReactNode }) => {
  const [type, setType] = useState<ToastType>('error')
  const [message, setMessage] = useState<string | undefined>(undefined)
  const [open, setOpen] = useState(false)
  const { m } = useI18n()

  function buildToastFunction(type: ToastType) {
    return function (message: string) {
      setOpen(false)
      setType(type)
      setMessage(message)
      setOpen(true)
    }
  }

  function onClose() {
    setOpen(false)
  }

  const contextValue: ToastContext = {
    toastError: (err) => {
      const message = buildMessageFromApiError(err, m)
      buildToastFunction('error')(message)
    },
    toastSuccess: buildToastFunction('success'),
    toastInfo: buildToastFunction('info'),
  }

  return (
    <toastContext.Provider value={contextValue}>
      {children}
      <Snackbar
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
        open={open}
        autoHideDuration={type === 'error' ? null : 6000}
        onClose={(e, reason) => {
          if (reason !== 'clickaway') {
            onClose()
          }
        }}
        sx={{
          '& .MuiSnackbarContent-root': {
            background: 'black',
            color: 'white',
          },
        }}
        TransitionComponent={TransitionLeft}
        message={
          <div className="flex items-center font-bold gap-2 text-lg">
            {renderIcon(type)}
            <span>{message}</span>
          </div>
        }
        action={
          <>
            <Button
              onClick={onClose}
              size="small"
              color="inherit"
              endIcon={<Icon>close</Icon>}
            >
              Fermer
            </Button>
          </>
        }
      />
    </toastContext.Provider>
  )
}

export const useToast = () => useContext(toastContext)

function TransitionLeft(props: SlideProps) {
  return <Slide {...props} direction="down" />
}

function renderIcon(type: ToastType) {
  switch (type!) {
    case 'error':
      return <Icon sx={{ color: colorError }}>error</Icon>
    case 'success':
      return <Icon sx={{ color: colorSuccess }}>check_circle</Icon>
    case 'info':
      return <Icon sx={{ color: colorInfo }}>info</Icon>
    default:
      return <></>
  }
}

function buildMessageFromApiError(
  error: Partial<ApiError>,
  m: I18nContextProps['m'],
) {
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

  const baseErrorMessage = getErrorMessage(error)
  return error.details?.code === 400
    ? `${baseErrorMessage} ${askForRefreshMessage}`
    : baseErrorMessage
}
