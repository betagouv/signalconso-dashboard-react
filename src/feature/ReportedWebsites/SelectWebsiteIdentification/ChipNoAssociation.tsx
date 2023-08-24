import {ChipProps, Tooltip} from '@mui/material'
import React from 'react'
import {useI18n} from '../../../core/i18n'
import {ScChip} from '../../../shared/ScChip'
import {Txt} from '../../../alexlibs/mui-extension'

export const ChipNoAssociation = ({...props}: ChipProps) => {
  const {m} = useI18n()

  return (
    <Tooltip title={m.noAssociation}>
      <ScChip
        label={
          <Txt
            truncate
            sx={{
              maxWidth: 200,
            }}
            block
          >
            {m.noValue}
          </Txt>
        }
        {...props}
      />
    </Tooltip>
  )
}
