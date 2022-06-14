import {BoxProps, Tooltip} from '@mui/material'
import {Txt} from 'mui-extension/lib/Txt/Txt'
import React from 'react'
import {ScChip} from 'shared/Chip/ScChip'

interface Props extends BoxProps {
  tooltipTitle: string
  value?: string
}

export const StatusChip = ({value, tooltipTitle, ...props}: Props) => {
  return (
    <Tooltip title={tooltipTitle}>
      <ScChip
        onClick={props.onClick}
        label={
          <Txt
            truncate
            sx={{
              fontWeight: 'bold',
              maxWidth: 200,
            }}
            block
          >
            {value}
          </Txt>
        }
      />
    </Tooltip>
  )
}
