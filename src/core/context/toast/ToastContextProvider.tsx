import { Button, Icon, Slide, SlideProps, Snackbar } from '@mui/material'
import {
  colorError,
  colorInfo,
  colorSuccess,
} from 'alexlibs/mui-extension/color'
import { ApiError } from 'core/client/ApiClient'
import { Index } from 'core/helper'
import { ReactNode, useState } from 'react'
import { apiErrorsCode, toastContext, ToastContext } from './toastContext'

type ToastType = 'error' | 'success' | 'info'

export const ToastProvider = ({ children }: { children: ReactNode }) => {
  const [type, setType] = useState<ToastType>('error')
  const [message, setMessage] = useState<string | undefined>(undefined)
  const [open, setOpen] = useState(false)

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
      const message = buildMessageFromApiError(err)
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
        autoHideDuration={6000}
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

function buildMessageFromApiError(error: Partial<ApiError>) {
  const askForRefreshMessage =
    'Merci de rafraîchir la page, puis de réessayer. Si cela ne fonctionne toujours pas, réessayez plus tard ou contactez le support.'

  const getErrorMessage = (err: Partial<ApiError>) => {
    console.error(JSON.stringify(err.details))
    if (err.details?.id && (apiErrorsCode as Index<string>)[err.details.id]) {
      return (apiErrorsCode as any)[err.details.id]
    }
    if (err.message && err.message !== '') {
      return err.message
    }
    return "Une erreur s'est produite."
  }

  const baseErrorMessage = getErrorMessage(error)
  return error.details?.code === 400
    ? `${baseErrorMessage} ${askForRefreshMessage}`
    : baseErrorMessage
}
