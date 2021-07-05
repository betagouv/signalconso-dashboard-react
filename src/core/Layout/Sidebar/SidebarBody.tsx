import * as React from 'react'
import {ReactNode} from 'react'
import {createStyles, makeStyles, Theme} from '@material-ui/core'
import classNames from 'classnames'

const useStyles = makeStyles((t: Theme) => createStyles({
  root: {
    paddingTop: t.spacing(1),
    paddingBottom: t.spacing(1),
    flex: 1,
    overflowY: 'auto',
  },
}))

export interface SidebarBodyProps {
  children?: ReactNode
  className?: string
}

export const SidebarBody = ({children, className}: SidebarBodyProps) => {
  const classes = useStyles()
  return (
    <main className={classNames(classes.root, className)}>
      {children}
    </main>
  )
}
