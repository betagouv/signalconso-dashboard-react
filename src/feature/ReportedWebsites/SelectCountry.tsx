import React, {ReactElement, useEffect, useState} from 'react'
import {useI18n} from '../../core/i18n'
import {Country} from '@signal-conso/signalconso-api-sdk-js'
import {Autocomplete, TextField} from '@mui/material'
import {useConstantContext} from '../../core/context/ConstantContext'
import {ScDialog} from '../../shared/Confirm/ScDialog'
import {fromNullable} from 'fp-ts/es6/Option'

interface Props {
  children: ReactElement<any>
  country?: Country
  onChange: (_: Country) => void
}

export const SelectCountry = ({children, onChange, country}: Props) => {
  const {m} = useI18n()
  const _countries = useConstantContext().countries
  const [countries, setCountries] = useState<Country[]>([])
  const [value, setValue] = React.useState<Country | undefined>(country)

  useEffect(() => {
    _countries.fetch({}).then(setCountries)
  }, [])

  return (
    <ScDialog
      PaperProps={{style: {position: 'static'}}}
      confirmDisabled={!value}
      maxWidth="sm"
      title={m.identification}
      content={_ => (
        <>
          <Autocomplete
            disablePortal
            multiple={false}
            defaultValue={country}
            id="combo-country"
            sx={{
              mb: 1.5,
              minWidth: 280,
              width: 300,
            }}
            onChange={(event, newInputValue) => {
              setValue(fromNullable(newInputValue).toUndefined())
            }}
            options={countries}
            getOptionLabel={option => option.name}
            renderInput={params => <TextField {...params} label={m.foreignCountry} />}
          />
        </>
      )}
      onConfirm={(_, close) => {
        value && onChange(value)
        close()
      }}
      confirmLabel={m.edit}
    >
      {children}
    </ScDialog>
  )
}
