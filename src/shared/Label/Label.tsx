import * as React from 'react'
import {CSSProperties, ReactNode} from 'react'
import {Paper, PaperProps, Theme} from '@mui/material'
import makeStyles from '@mui/styles/makeStyles'
import {alpha} from '@mui/material/styles'
import {styleUtils} from '../../core/theme'
import {classes} from '../../core/helper/utils'

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

const useStyles = makeStyles((t: Theme) => ({
  root: {
    whiteSpace: 'nowrap',
    borderRadius: 40,
    paddingTop: t.spacing(1 / 1.5),
    paddingBottom: t.spacing(1 / 1.5),
    paddingRight: t.spacing(2),
    paddingLeft: t.spacing(2),
    fontWeight: 'bold',
    letterSpacing: '1px',
    display: 'inline-flex',
    minHeight: 24,
    alignItems: 'center',
    transition: t.transitions.create('all'),
    ...colorize(t.palette.text.disabled),
  },
  border: {
    // border: `1px solid ${t.palette.divider}`,
  },
  dense: {
    fontWeight: '500' as any,
    fontSize: styleUtils(t).fontSize.small,
    padding: t.spacing(0, 1, 0, 1),
  },
  fullWidth: {
    width: '100%',
  },
  inSelectOptions: {
    marginTop: -10,
    marginBottom: -10,
  },
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
}))

export const Label = ({
  type,
  children,
  className,
  fullWidth,
  dense,
  elevation = 0,
  inSelectOptions,
  ...props
}: LabelProps) => {
  const css = useStyles()
  return (
    <Paper
      elevation={elevation}
      className={classes(
        css.root,
        type && css[type],
        elevation === 0 && css.border,
        fullWidth && css.fullWidth,
        dense && css.dense,
        inSelectOptions && css.inSelectOptions,
        className,
      )}
      {...props}
    >
      {children}
    </Paper>
  )
}
