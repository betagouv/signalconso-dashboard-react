import { Button, Icon, Slide, SlideProps, Snackbar } from '@mui/material'
import {
  colorError,
  colorInfo,
  colorSuccess,
} from 'alexlibs/mui-extension/color'
import { ApiError } from 'core/client/ApiClient'
import { Index } from 'core/helper'
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

export const apiErrorsCode = {
  'SC-0001': `Une erreur s'est produite`,
  'SC-0002': `L'utilisateur DGCCRF n'existe pas.`,
  'SC-0003': `Le professionnel n'existe pas.`,
  'SC-0004': `L'entreprise n'existe pas.`,
  'SC-0005': `Le site web n'existe pas.`,
  'SC-0006': `L'entreprise est déjà associée à un site.`,
  'SC-0007': `URL invalide.`,
  'SC-0008': `Email invalide pour ce type d'utilisateur.`,
  'SC-0009': `L'utilisateur existe déjà.`,
  'SC-0010': `L'entreprise a déjà été activée.`,
  'SC-0011': `L'entreprise n'existe pas.`,
  'SC-0012': `Le code d'activation est périmé.`,
  'SC-0013': `Le code d'activation est invalide.`,
} as const
