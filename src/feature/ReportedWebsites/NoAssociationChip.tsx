import {Box, BoxProps, Chip, Theme, Tooltip} from '@mui/material'
import React, {ReactElement} from 'react'
import {useI18n} from '../../core/i18n'
import {makeSx} from 'mui-extension'


const sx = makeSx({
  tdName_desc: t => ({
    fontSize: t.typography.fontSize * 0.875,
    color: t.palette.text.disabled,
  }),
})

export const NoAssociationChip = ({...props}: BoxProps) => {
  const {m} = useI18n()

  return (
    <Tooltip title={m.linkCountry}>
      <Chip
        onClick={props.onClick}
        variant={'outlined'}
        sx={{height: 42, borderRadius: 42}}
        label={
           (
             <Box sx={sx.tdName_desc}>{m.noAssociation}</Box>
          )
        }
      />
    </Tooltip>
  )
}
