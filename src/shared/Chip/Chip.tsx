import React from 'react'
import {Chip as MatChip, ChipProps as MatChipProps} from '@material-ui/core'

interface ChipProps extends MatChipProps {
}

export const Chip = ({variant = 'outlined', ...props}: ChipProps) => {
  return (
    <MatChip variant={variant} {...props}/>
  )

}
