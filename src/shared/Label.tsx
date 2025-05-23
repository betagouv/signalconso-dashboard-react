import * as React from 'react'
import { CSSProperties, forwardRef, ReactNode, Ref } from 'react'
import {
  Box,
  BoxProps,
  Paper,
  PaperProps,
  Theme,
  useTheme,
} from '@mui/material'
import { alpha } from '@mui/material/styles'
import { styleUtils } from '../core/theme'

export interface LabelProps extends BoxProps {
  children: ReactNode
  fullWidth?: boolean
  dense?: boolean
  inSelectOptions?: boolean
}

const colorize = (color: string): CSSProperties => ({
  background: alpha(color, 0.14),
  color: color,
})

const colors = (t: Theme) => ({
  error: {
    ...colorize(styleUtils(t).color.error),
  },
  warning: {
    ...colorize(styleUtils(t).color.warning),
  },
  success: {
    ...colorize(styleUtils(t).color.success),
  },
  info: {
    ...colorize(styleUtils(t).color.info),
  },
  disable: {
    ...colorize(t.palette.text.disabled),
  },
})

export const Label = forwardRef(
  (
    { children, sx, fullWidth, dense, inSelectOptions, ...props }: LabelProps,
    ref: Ref<unknown>,
  ) => {
    const t = useTheme()
    return (
      <Box
        component="span"
        sx={{
          whiteSpace: 'nowrap',
          borderRadius: 40,
          py: 1 / 1.5,
          px: 2,
          display: 'inline-flex',
          minHeight: 24,
          alignItems: 'center',
          transition: (t) => t.transitions.create('all'),
          ...colorize(t.palette.text.disabled),
          // ...elevation > 0 && {
          //   border: 'none'
          // },
          ...(fullWidth && {
            width: '100%',
          }),
          ...(dense && {
            fontWeight: '500' as any,
            fontSize: (t) => styleUtils(t).fontSize.small,
            py: 0,
            px: 1,
          }),
          ...(inSelectOptions && {
            marginTop: -10,
            marginBottom: -10,
          }),
          ...sx,
        }}
        ref={ref}
        {...props}
      >
        {children}
      </Box>
    )
  },
)
