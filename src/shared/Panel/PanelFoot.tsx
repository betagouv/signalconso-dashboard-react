import * as React from 'react'
import {ReactNode} from 'react'
import {CardActions, CardActionsProps, makeStyles, Theme} from '@material-ui/core'
import {classes} from '../../core/helper/utils'

export interface PanelFootProps extends CardActionsProps {
  alignEnd?: boolean
  border?: boolean
}

const useStyles = makeStyles((t: Theme) => ({
  root: {
    marginTop: 'auto',
  },
  border: {
    borderTop: '1px solid ' + t.palette.divider,
  },
  alignEnd: {
    display: 'flex',
    justifyContent: 'flex-end',
  },
}))

export const PanelFoot = ({children, className, alignEnd, border, ...props}: PanelFootProps) => {
  const css = useStyles()
  return (
    <CardActions {...props} className={classes(className, css.root, alignEnd && css.alignEnd, border && css.border)}>
      {children}
    </CardActions>
  )
}
