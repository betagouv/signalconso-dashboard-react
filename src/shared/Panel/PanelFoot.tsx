import * as React from 'react'
import {ReactNode} from 'react'
import {CardActions, makeStyles, Theme} from '@material-ui/core'
import {classes} from '../../core/helper/utils'

export interface PanelFootProps {
  children?: ReactNode
  className?: string
  alignEnd?: boolean
}

const useStyles = makeStyles((t: Theme) => ({
  root: {
    marginTop: 'auto',
    borderTop: '1px solid ' + t.palette.divider,
  },
  alignEnd: {
    display: 'flex',
    justifyContent: 'flex-end',
  },
}))

export const PanelFoot = ({children, className, alignEnd}: PanelFootProps) => {
  const css = useStyles()
  return <CardActions className={classes(className, css.root, alignEnd && css.alignEnd)}>{children}</CardActions>
}
