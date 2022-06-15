import {Box, BoxProps, Tooltip} from '@mui/material'
import {Txt} from 'mui-extension/lib/Txt/Txt'
import React from 'react'
import {useI18n} from '../../../core/i18n'
import {Country} from '@signal-conso/signalconso-api-sdk-js'
import {makeSx} from 'mui-extension'
import {styleUtils} from '../../../core/theme'
import {ScChip} from '../../../shared/Chip/ScChip'

interface Props extends BoxProps {
  country: Country
}

const countryToFlag = (isoCode: string) => {
  return typeof String.fromCodePoint !== 'undefined'
    ? isoCode.toUpperCase().replace(/./g, char => String.fromCodePoint(char.charCodeAt(0) + 127397))
    : isoCode
}

const sx = makeSx({
  tdName_desc: t => ({

  }),
})

export const ChipCountry = ({country, ...props}: Props) => {
  const {m} = useI18n()

  return (
    <Tooltip title={m.linkCountry}>
      <ScChip
        icon={
          <Box sx={{
            fontSize: t => styleUtils(t).fontSize.big,
          }}>
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
