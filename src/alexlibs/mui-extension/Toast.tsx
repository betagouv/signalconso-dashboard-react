import {
  Box,
  CircularProgress,
  Icon,
  IconButton,
  Snackbar,
  SnackbarCloseReason,
  SnackbarProps,
} from '@mui/material'
import * as React from 'react'
import { ReactNode, useContext, useState } from 'react'
import { colorInfo, colorSuccess, colorWarning } from './color'

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

interface ToastOptions
  extends Pick<SnackbarProps, 'autoHideDuration' | 'action'> {
  keepOpenOnClickAway?: boolean
}

interface ToastContext {
  toastError: (m: string, options?: ToastOptions) => void
  toastSuccess: (m: string, options?: ToastOptions) => void
  toastWarning: (m: string, options?: ToastOptions) => void
  toastInfo: (m: string, options?: ToastOptions) => void
  toastLoading: (m: string, options?: ToastOptions) => void
}

interface ToastProviderProps {
  children: ReactNode
  vertical?: 'top' | 'bottom'
  horizontal?: 'left' | 'center' | 'right'
}

export const ToastProvider = ({
  children,
  vertical = 'bottom',
  horizontal = 'left',
}: ToastProviderProps) => {
  const [type, setType] = useState<ToastType | undefined>(undefined)
  const [message, setMessage] = useState<string | undefined>(undefined)
  const [open, setOpen] = useState(false)
  const [options, setOptions] = useState<ToastOptions | undefined>()

  const pop =
    (type: ToastType) => (message: string, options?: ToastOptions) => {
      setOpen(true)
      setType(type)
      setMessage(message)
      setOptions(options)
    }

  const renderIcon = (type: ToastType) => {
    switch (type!) {
      case 'error':
        return <Icon sx={{ color: (t) => t.palette.error.main }}>error</Icon>
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
    if (reason === 'clickaway' && options?.keepOpenOnClickAway) {
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
        anchorOrigin={{ vertical, horizontal }}
        open={open}
        autoHideDuration={
          options?.autoHideDuration === undefined
            ? type === 'error'
              ? null
              : 6000
            : options.autoHideDuration
        }
        onClose={handleClose}
        message={
          <div style={{ display: 'flex', alignItems: 'center' }}>
            {renderIcon(type)}
            <Box component="span" sx={{ ml: 2 }}>
              {message}
            </Box>
          </div>
        }
        action={
          <>
            {options?.action}
            <IconButton
              onClick={handleClose}
              color="inherit"
              size="large"
              sx={options?.action ? { ml: 1 } : {}}
            >
              <Icon>close</Icon>
            </IconButton>
          </>
        }
      />
    </toastContext.Provider>
  )
}

export const useToastContext = () => useContext(toastContext)
