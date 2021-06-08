import * as React from 'react'
import {createStyles, Theme} from '@material-ui/core'
import classNames from 'classnames'
import {makeStyles} from '@material-ui/core'

const useStyles = makeStyles((t: Theme) => createStyles({
  root: {
    height: 1,
    background: t.palette.divider,
  },
  rootMargin: {
    margin: t.spacing(2, 0),
  }
}))

export interface SidebarHrProps {
  className?: any;
  margin?: boolean;
}

export const SidebarHr = ({className, margin}: SidebarHrProps) => {
  const classes = useStyles()
  return (
    <div className={classNames(classes.root, className, margin && classes.rootMargin)}/>
  )
}
