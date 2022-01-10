import * as React from 'react'
import {ReactNode} from 'react'
import {Theme, Typography} from '@mui/material'
import makeStyles from '@mui/styles/makeStyles'
import {classes} from '../../../core/helper/utils'

const useStyles = makeStyles((t: Theme) => ({
  root: {
    marginTop: t.spacing(1),
    marginBottom: t.spacing(3),
    display: 'flex',
    alignItems: 'center',
  },
  action: {
    marginLeft: 'auto',
  },
}))

interface Props {
  children?: ReactNode
  action?: ReactNode
  className?: string
}

export const PageTitle = ({className, action, children, ...props}: Props) => {
  const css = useStyles()
  return (
    <Typography variant="h5" className={classes(css.root, className)} {...props}>
      {children}
      {action && <div className={css.action}>{action}</div>}
    </Typography>
  )
}
