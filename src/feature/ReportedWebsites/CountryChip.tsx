import {Box, BoxProps, Chip, Theme, Tooltip} from '@mui/material'
import {Txt} from 'mui-extension/lib/Txt/Txt'
import React, {ReactElement} from 'react'
import {useI18n} from '../../core/i18n'
import {CompanySearchResult, Country, Id} from '@signal-conso/signalconso-api-sdk-js'
import {makeSx} from 'mui-extension'

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
    fontSize: t.typography.fontSize * 0.875,
    fontWeight: 'bold',
  }),
})

export const CountryChip = ({country, ...props}: Props) => {
  const {m} = useI18n()

  return (
    <Tooltip title={m.linkCountry}>
      <Chip
        onClick={props.onClick}
        variant={'outlined'}
        sx={{height: 42, borderRadius: 42}}
        label={
          <Txt sx={{
            display: 'flex'
          }} truncate block>
            <Box
              sx={{
                fontSize: t => t.typography.fontSize * 0.875,
              }}
            >
              {countryToFlag(country.code)}
            </Box>
            &nbsp;
            <Box sx={sx.tdName_desc}>{country.name.toUpperCase()}</Box>
          </Txt>
        }
      />
    </Tooltip>
  )
}
