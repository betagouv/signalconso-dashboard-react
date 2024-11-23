import { Box, BoxProps, CircularProgress, Icon } from '@mui/material'
import { ReactNode } from 'react'
import { colorError, colorGray, colorSuccess } from './color'

type State = 'loading' | 'error' | 'empty' | 'success'

interface FenderProps extends Omit<BoxProps, 'title'> {
  type?: State
  icon?: string
  title?: ReactNode
  description?: ReactNode
}

export const Fender = ({
  children,
  icon,
  type = 'empty',
  title,
  description,
  sx,
  ...props
}: FenderProps) => {
  const iconSize = 100
  const getIcon = () => {
    if (icon) return renderIcon(icon)
    switch (type) {
      case 'empty':
        return renderIcon('do_not_disturb')
      case 'error':
        return renderIcon('error_outline')
      case 'success':
        return renderIcon('check_circle_outline')
      case 'loading':
        return <CircularProgress size={iconSize - 10} />
    }
  }

  const renderIcon = (name: string) => (
    <Icon sx={{ fontSize: `${iconSize}px !important` }}>{name}</Icon>
  )

  return (
    <Box
      {...props}
      sx={{
        transition: (t) => t.transitions.create('all'),
        display: 'flex',
        textAlign: 'center',
        alignItems: 'center',
        justifyContent: 'center',
        ...sx,
      }}
    >
      <div>
        <Box
          sx={{
            height: iconSize + 10,
            mt: 1,
            lineHeight: 1,
            ...{
              error: {
                color: colorError,
              },
              empty: {
                color: colorGray,
              },
              success: {
                color: colorSuccess,
              },
              loading: null,
            }[type],
          }}
        >
          {getIcon()}
        </Box>
        <Box sx={{ mt: 1 }}>
          {title && <Box sx={{ fontSize: 24 }}>{title}</Box>}
          {description && <Box>{description}</Box>}
          {children}
        </Box>
      </div>
    </Box>
  )
}
