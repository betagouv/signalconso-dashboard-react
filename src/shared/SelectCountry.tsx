import React from 'react'
import {useI18n} from '../core/i18n'

import {Autocomplete, Box} from '@mui/material'
import {ScInput} from './ScInput'
import {combineSx} from '../core/theme'
import {makeSx} from '../alexlibs/mui-extension'
import {Country} from '../core/client/constant/Country'
import {countryToFlag} from '../core/helper'
import {ScOption} from 'core/helper/ScOption'
import {useCountriesQuery} from '../core/queryhooks/constantQueryHooks'

interface Props {
  country?: Country
  onChange: (_: Country) => void
}

const css = makeSx({
  menuItem: {
    minHeight: 36,
    display: 'flex',
    alignItems: 'center',
    p: 0,
    pr: 1,
    cursor: 'pointer',
    color: t => t.palette.text.secondary,
    '&:hover': {
      background: t => t.palette.action.hover,
    },
    '&:active, &:focus': {
      background: t => t.palette.action.focus,
    },
  },
  flag: {
    color: 'rgba(0, 0, 0, 1)',
    fontSize: 18,
    textAlign: 'center',
  },
  iconWidth: {
    width: 50,
  },
})

export const SelectCountry = ({onChange, country}: Props) => {
  const {m} = useI18n()
  const _countries = useCountriesQuery()

  return (
    <>
      <Autocomplete
        disablePortal
        multiple={false}
        defaultValue={country}
        id="combo-country"
        sx={{
          mb: 1.5,
          minWidth: 280,
        }}
        onChange={(event, newInputValue) => {
          const newCountry = ScOption.from(newInputValue).toUndefined()
          newCountry && onChange(newCountry)
        }}
        options={_countries.data ?? []}
        getOptionLabel={option => option.name}
        renderOption={(props, option) => (
          <Box component="li" key={option.code + Math.random()} sx={css.menuItem} {...props}>
            <Box component="span" sx={combineSx(css.flag, css.iconWidth)}>
              {countryToFlag(option.code)}
            </Box>
            <span>{option.name}</span>
          </Box>
        )}
        renderInput={params => <ScInput {...params} label={m.foreignCountry} />}
      />
    </>
  )
}
