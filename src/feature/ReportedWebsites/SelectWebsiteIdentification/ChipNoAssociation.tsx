import {ChipProps, Tooltip} from '@mui/material'
import React from 'react'
import {useI18n} from '../../../core/i18n'
import {ScChip} from '../../../shared/Chip/ScChip'

export const ChipNoAssociation = ({...props}: ChipProps) => {
  const {m} = useI18n()

  return (
    <Tooltip title={m.linkCountry}>
      <ScChip size="small" onClick={props.onClick} label={m.noAssociation} {...props} />
    </Tooltip>
  )
}
