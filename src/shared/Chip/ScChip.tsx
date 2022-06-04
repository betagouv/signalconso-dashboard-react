import React from 'react'
import {Chip as MatChip, ChipProps as MatChipProps} from '@mui/material'
import {sxUtils} from '../../core/theme'

interface ChipProps extends MatChipProps {
}

export const ScChip = ({variant = 'outlined', sx = {}, ...props}: ChipProps) => {
  return <MatChip variant={variant} {...props} sx={{...sxUtils.fontNormal, ...sx}} />
}
