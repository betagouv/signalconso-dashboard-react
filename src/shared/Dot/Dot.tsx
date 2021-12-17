import {Icon, Theme} from '@mui/material'
import makeStyles from '@mui/styles/makeStyles'
import * as React from 'react'
import {classes} from '../../core/helper/utils'

export interface DotProps {
  className?: string
}

const useStyles = makeStyles((t: Theme) => ({
  root: {
    fontSize: '9px !important',
    verticalAlign: 'middle',
    marginLeft: t.spacing(1),
    marginRight: t.spacing(1),
  },
}))

export const Dot = ({className}: DotProps) => {
  const css = useStyles()
  return <Icon className={classes(css.root, className)}>fiber_manual_record</Icon>
}
