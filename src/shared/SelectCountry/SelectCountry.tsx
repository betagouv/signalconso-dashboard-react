import React, {useEffect, useState} from 'react'
import {useI18n} from '../../core/i18n'
import {Country} from '@signal-conso/signalconso-api-sdk-js'
import {fromNullable} from 'fp-ts/lib/Option'
import {Autocomplete, Box} from '@mui/material'
import {ScInput} from '../Input/ScInput'
import {useConstantContext} from '../../core/context/ConstantContext'
import {combineSx} from '../../core/theme'
import {makeSx} from '../../alexlibs/mui-extension'
import {countryToFlag} from '../../core/helper/utils'

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
  const _countries = useConstantContext().countries
  const [countries, setCountries] = useState<Country[]>([])

  useEffect(() => {
    _countries.fetch({}).then(setCountries)
  }, [country])

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
          const newCountry = fromNullable(newInputValue).toUndefined()
          newCountry && onChange(newCountry)
        }}
        options={countries ?? []}
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
