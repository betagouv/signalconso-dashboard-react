import {Icon, Theme} from '@mui/material'
import makeStyles from '@mui/styles/makeStyles'
import * as React from 'react'
import {classes} from '../../core/helper/utils'

export interface DotProps {
  className?: string
}

export const Dot = ({className}: DotProps) => {
  return <Icon className={className} sx={{
    fontSize: '9px !important',
    verticalAlign: 'middle',
    mx: 1,
  }}>fiber_manual_record</Icon>
}
