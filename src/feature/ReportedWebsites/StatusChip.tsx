import { ChipProps, Tooltip } from '@mui/material'
import { Txt } from '../../alexlibs/mui-extension'
import React from 'react'
import { ScChip } from 'shared/ScChip'

interface Props extends ChipProps {
  tooltipTitle: string
  value?: string
}

export const StatusChip = ({ value, tooltipTitle, ...props }: Props) => {
  return (
    <Tooltip title={tooltipTitle}>
      <ScChip
        label={
          <Txt
            truncate
            sx={{
              maxWidth: 200,
            }}
            block
          >
            {value}
          </Txt>
        }
        {...props}
      />
    </Tooltip>
  )
}
