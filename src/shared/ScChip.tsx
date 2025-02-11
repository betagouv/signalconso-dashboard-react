import { Chip as MatChip, ChipProps as MatChipProps } from '@mui/material'
import { forwardRef, Ref } from 'react'
import { combineSx, sxUtils } from '../core/theme'

type ChipProps = MatChipProps

export const ScChip = forwardRef(
  (
    { variant = 'outlined', sx = {}, ...props }: ChipProps,
    ref: Ref<HTMLDivElement>,
  ) => {
    return (
      <MatChip
        ref={ref}
        variant={variant}
        {...props}
        sx={combineSx(sxUtils.fontNormal, sx)}
      />
    )
  },
)
