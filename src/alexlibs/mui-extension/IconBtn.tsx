import {
  CircularProgress,
  Icon,
  IconButton,
  IconButtonProps,
} from '@mui/material'
import { forwardRef, ReactNode, Ref } from 'react'

interface IconBtnProps extends IconButtonProps {
  loading?: boolean
  icon?: string
  children: ReactNode
  tooltip?: string
}

export const IconBtn = forwardRef(
  (
    { icon, loading, children, disabled, ...props }: IconBtnProps,
    ref: Ref<HTMLButtonElement>,
  ) => {
    return (
      <IconButton {...props} disabled={disabled || loading} ref={ref}>
        {loading ? (
          <CircularProgress size={24} />
        ) : (
          <>{icon ? <Icon>{icon}</Icon> : children}</>
        )}
      </IconButton>
    )
  },
)
