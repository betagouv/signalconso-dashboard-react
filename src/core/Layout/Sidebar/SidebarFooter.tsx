import * as React from 'react'
import {ReactNode} from 'react'
import {Theme} from '@mui/material'
import createStyles from '@mui/styles/createStyles'
import makeStyles from '@mui/styles/makeStyles'
import classNames from 'classnames'

const useStyles = makeStyles((t: Theme) =>
  createStyles({
    root: {
      paddingTop: t.spacing(1 / 2),
      paddingBottom: t.spacing(1 / 2),
      borderTop: '1px solid ' + t.palette.divider,
    },
  }),
)

export interface SidebarFooterProps {
  children?: ReactNode
  className?: string
}

export const SidebarFooter = ({children, className}: SidebarFooterProps) => {
  const classes = useStyles()
  return <footer className={classNames(classes.root, className)}>{children}</footer>
}
