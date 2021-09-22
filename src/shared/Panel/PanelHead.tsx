import * as React from 'react'
import {ReactNode} from 'react'
import {Icon, makeStyles, Theme} from '@material-ui/core'
import {styleUtils} from '../../core/theme'
import {classes} from '../../core/helper/utils'
import {PanelTitle} from './PanelTitle'

const useStyles = makeStyles((t: Theme) => ({
  root: {
    padding: styleUtils(t).spacing(2, 2, 0, 2),
    margin: 0,
    display: 'flex',
    alignItems: 'center',
  },
  content: {
    flex: 1,
  },
  icon: {
    color: t.palette.text.disabled,
    marginRight: t.spacing(1),
  }
}))

interface Props {
  className?: string
  children: ReactNode
  action?: ReactNode
  icon?: string
}

export const PanelHead = ({className, icon, children, action, ...other}: Props) => {
  const css = useStyles()
  return (
    <PanelTitle {...other} className={classes(css.root, className)}>
      {icon && <Icon className={css.icon}>{icon}</Icon>}
      <div className={css.content}>{children}</div>
      {action}
    </PanelTitle>
  )
}
