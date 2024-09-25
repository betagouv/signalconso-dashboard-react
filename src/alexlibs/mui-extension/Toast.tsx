import {
  Button,
  CircularProgress,
  Icon,
  Slide,
  SlideProps,
  Snackbar,
  SnackbarCloseReason,
  SnackbarProps,
} from '@mui/material'
import * as React from 'react'
import { ReactNode, useContext, useState } from 'react'
import { colorError, colorInfo, colorSuccess, colorWarning } from './color'
const noop = (_: string) => {}

const toastContext = React.createContext<ToastContext>({
  toastError: noop,
  toastSuccess: noop,
  toastWarning: noop,
  toastInfo: noop,
  toastLoading: noop,
})

type ToastType =
  | 'error'
  | 'loading'
  | 'warning'
  | 'success'
  | 'info'
  | undefined

type ToastOptions = Pick<SnackbarProps, 'autoHideDuration' | 'action'>

interface ToastContext {
  toastError: (m: string, options?: ToastOptions) => void
  toastSuccess: (m: string, options?: ToastOptions) => void
  toastWarning: (m: string, options?: ToastOptions) => void
  toastInfo: (m: string, options?: ToastOptions) => void
  toastLoading: (m: string, options?: ToastOptions) => void
}

interface ToastProviderProps {
  children: ReactNode
}

export const ToastProvider = ({ children }: ToastProviderProps) => {
  const [type, setType] = useState<ToastType | undefined>(undefined)
  const [message, setMessage] = useState<string | undefined>(undefined)
  const [open, setOpen] = useState(false)

  const pop = (type: ToastType) => (message: string) => {
    setOpen(true)
    setType(type)
    setMessage(message)
  }

  const renderIcon = (type: ToastType) => {
    switch (type!) {
      case 'error':
        return <Icon sx={{ color: colorError }}>error</Icon>
      case 'success':
        return <Icon sx={{ color: colorSuccess }}>check_circle</Icon>
      case 'warning':
        return <Icon sx={{ color: colorWarning }}>warning</Icon>
      case 'info':
        return <Icon sx={{ color: colorInfo }}>info</Icon>
      case 'loading':
        return <CircularProgress size={24} thickness={5} />
      default:
        return <></>
    }
  }

  const handleClose = (event: unknown, reason?: SnackbarCloseReason) => {
    if (reason === 'clickaway') {
    } else {
      setOpen(false)
    }
  }

  return (
    <toastContext.Provider
      value={{
        toastError: pop('error'),
        toastSuccess: pop('success'),
        toastWarning: pop('warning'),
        toastInfo: pop('info'),
        toastLoading: pop('loading'),
      }}
    >
      {children}
      <Snackbar
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
        open={open}
        autoHideDuration={type === 'error' ? null : 6000}
        onClose={handleClose}
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
              onClick={handleClose}
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

export const useToastContext = () => useContext(toastContext)

function TransitionLeft(props: SlideProps) {
  return <Slide {...props} direction="down" />
}
