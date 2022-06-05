import * as React from 'react'
import {CSSProperties, ReactNode} from 'react'
import {Paper, PaperProps} from '@mui/material'
import {alpha} from '@mui/material/styles'
import {styleUtils} from '../../core/theme'
import {makeSx} from 'mui-extension'

export type LabelColor = 'error' | 'warning' | 'info' | 'success' | 'disable'

export interface LabelProps extends PaperProps {
  type?: LabelColor
  className?: string
  children: ReactNode
  fullWidth?: boolean
  dense?: boolean
  inSelectOptions?: boolean
  elevation?: number
}

const colorize = (color: string): CSSProperties => ({
  background: alpha(color, 0.14),
  color: color,
})

const sx = makeSx({
  root: t => ({
    whiteSpace: 'nowrap',
    borderRadius: '40px',
    pt: 1 / 1.5,
    pb: 1 / 1.5,
    pr: 2,
    pl: 2,
    fontWeight: 'bold',
    letterSpacing: '1px',
    display: 'inline-flex',
    minHeight: 24,
    alignItems: 'center',
    transition: t.transitions.create('all'),
    ...colorize(t.palette.text.disabled),
  }),
  border: {
    // border: `1px solid ${t.palette.divider}`,
  },
  dense: {
    fontWeight: '500' as any,
    fontSize: t => styleUtils(t).fontSize.small,
    padding: t => t.spacing(0, 1, 0, 1),
  },
  fullWidth: {
    width: '100%',
  },
  inSelectOptions: {
    marginTop: -10,
    marginBottom: -10,
  },
  error: t => ({
    ...colorize(styleUtils(t).color.error),
  }),
  warning: t => ({
    ...colorize(styleUtils(t).color.warning),
  }),
  success: t => ({
    ...colorize(styleUtils(t).color.success),
  }),
  info: t => ({
    ...colorize(styleUtils(t).color.info),
  }),
  disable: t => ({
    ...colorize(t.palette.text.disabled),
  }),
})

export const Label = ({type, children, className, fullWidth, dense, elevation = 0, inSelectOptions, ...props}: LabelProps) => {
  return (
    <Paper
      elevation={elevation}
      sx={{
        ...sx.root,
        ...type && sx[type],
        ...elevation === 0 && sx.border,
        ...fullWidth && sx.fullWidth,
        ...dense && sx.dense,
        ...inSelectOptions && sx.inSelectOptions,
      }}
      className={className}
      {...props}
    >
      {children}
    </Paper>
  )
}
