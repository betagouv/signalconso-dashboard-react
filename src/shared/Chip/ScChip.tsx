import React from 'react'
import {Chip as MatChip, ChipProps as MatChipProps, Theme} from '@mui/material'
import makeStyles from '@mui/styles/makeStyles'
import {classes} from '../../core/helper/utils'
import {styleUtils} from '../../core/theme'

interface ChipProps extends MatChipProps {}

const useStyles = makeStyles((t: Theme) => ({
  root: {
    fontSize: styleUtils(t).fontSize.normal,
  },
}))

export const ScChip = ({variant = 'outlined', ...props}: ChipProps) => {
  const css = useStyles()
  return <MatChip variant={variant} {...props} className={classes(props.className, css.root)} />
}
