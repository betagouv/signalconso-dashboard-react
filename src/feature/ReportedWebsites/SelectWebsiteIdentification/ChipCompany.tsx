import {Box, BoxProps, Tooltip} from '@mui/material'
import {Txt} from 'mui-extension/lib/Txt/Txt'
import React from 'react'
import {useI18n} from '../../../core/i18n'
import {Company} from '@signal-conso/signalconso-api-sdk-js'
import {ScChip} from '../../../shared/Chip/ScChip'

interface Props extends BoxProps {
  company: Company
}

export const ChipCompany = ({company, ...props}: Props) => {
  const {m} = useI18n()

  return (
    <Tooltip title={m.linkCountry}>
      <ScChip
        onClick={props.onClick}
        sx={{
          minHeight: 40,
          borderRadius: 50,
        }}
        label={
          <Box sx={{mx: 0.5}}>
            <Txt
              block
              truncate
              bold
              sx={{
                marginBottom: -0.5,
                maxWidth: 200,
              }}
            >
              {company.name}
            </Txt>
            <Txt color="hint" fontSize="small">
              {company.siret}
            </Txt>
          </Box>
        }
      />
    </Tooltip>
  )
}
