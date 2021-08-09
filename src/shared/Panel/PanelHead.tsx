import * as React from 'react'
import {ReactNode} from 'react'
import {makeStyles, Theme} from '@material-ui/core'
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
}))

interface Props {
  className?: string
  children: ReactNode
  action?: ReactNode
}

export const PanelHead = ({className, children, action, ...other}: Props) => {
  const css = useStyles()
  return (
    <PanelTitle {...other} className={classes(css.root, className)}>
      <div className={css.content}>{children}</div>
      {action}
    </PanelTitle>
  )
}
