import React from 'react'
import {Chip as MatChip, ChipProps as MatChipProps, Theme} from '@material-ui/core'
import {makeStyles} from '@material-ui/core/styles'
import {classes} from '../../core/helper/utils'
import {utilsStyles} from '../../core/theme'

interface ChipProps extends MatChipProps {
}

const useStyles = makeStyles((t: Theme) => ({
  root: {
    fontSize: utilsStyles(t).fontSize.normal,
  }
}))

export const ScChip = ({variant = 'outlined', ...props}: ChipProps) => {
  const css = useStyles()
  return (
    <MatChip variant={variant} {...props} className={classes(props.className, css.root)}/>
  )
}
