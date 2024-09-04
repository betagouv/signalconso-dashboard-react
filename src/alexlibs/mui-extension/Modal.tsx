import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogProps,
  DialogTitle,
  LinearProgress,
  PaperProps,
} from '@mui/material'
import * as React from 'react'
import { ReactElement, ReactNode, SyntheticEvent, useState } from 'react'

export interface ModalProps
  extends Omit<DialogProps, 'children' | 'onClick' | 'open' | 'content'> {
  disabled?: boolean
  title?: string
  confirmLabel?: string
  cancelLabel?: string
  content?: ((content: () => void) => ReactNode) | ReactNode | string
  children: ReactElement<any>
  onOpen?: () => void
  onClose?: () => void
  onConfirm?: (event: SyntheticEvent<any>, close: () => void) => void
  confirmDisabled?: boolean
  PaperProps?: Partial<PaperProps>
  loading?: boolean
  overrideActions?: (_: () => void) => ReactNode
}

export const Modal = ({
  children,
  title,
  content,
  confirmLabel,
  cancelLabel,
  onConfirm,
  onOpen,
  onClose,
  confirmDisabled,
  loading,
  PaperProps,
  overrideActions,
  ...props
}: ModalProps) => {
  const [isOpen, setIsOpen] = useState<boolean>(false)

  const open = () => {
    onOpen?.()
    setIsOpen(true)
  }

  const close = () => {
    onClose?.()
    setIsOpen(false)
  }

  const confirm = (event: SyntheticEvent<any>) => {
    if (onConfirm) onConfirm(event, close)
  }

  return (
    <>
      {React.cloneElement(children, {
        onClick: (event: Event) => {
          if (children.props.onClick) children.props.onClick(event)
          open()
        },
      })}
      <Dialog open={isOpen} {...props} PaperProps={PaperProps}>
        {loading && (
          <LinearProgress
            sx={{
              position: 'absolute',
              top: 0,
              right: 0,
              left: 0,
            }}
          />
        )}
        <DialogTitle>{title}</DialogTitle>
        <DialogContent>
          {typeof content === 'function' ? content(close) : content}
        </DialogContent>
        <DialogActions>
          {overrideActions ? (
            overrideActions(close)
          ) : (
            <>
              <Button color="primary" onClick={close}>
                {cancelLabel || 'Cancel'}
              </Button>
              {onConfirm && (
                <Button
                  color="primary"
                  onClick={confirm}
                  disabled={confirmDisabled}
                >
                  {confirmLabel || 'Confirm'}
                </Button>
              )}
            </>
          )}
        </DialogActions>
      </Dialog>
    </>
  )
}
