import {Box, BoxProps, Tooltip} from '@mui/material'
import {Txt} from '../../../alexlibs/mui-extension'
import React from 'react'
import {useI18n} from '../../../core/i18n'
import {Country} from '@signal-conso/signalconso-api-sdk-js'
import {styleUtils} from '../../../core/theme'
import {ScChip} from '../../../shared/Chip/ScChip'
import {countryToFlag} from '../../../core/helper/utils'

interface Props extends BoxProps {
  country: Country
}

export const ChipCountry = ({country, ...props}: Props) => {
  const {m} = useI18n()

  return (
    <Tooltip title={m.linkCountry}>
      <ScChip
        icon={
          <Box
            sx={{
              fontSize: t => styleUtils(t).fontSize.big,
            }}
          >
            {countryToFlag(country.code)}
          </Box>
        }
        onClick={props.onClick}
        label={
          <Txt truncate block>
            {country.name.toUpperCase()}
          </Txt>
        }
      />
    </Tooltip>
  )
}
