import React, {ReactElement, useEffect, useState} from 'react'
import {useI18n} from '../../core/i18n'
import {Country} from '@signal-conso/signalconso-api-sdk-js'
import {TextField, Theme} from '@mui/material'
import makeStyles from '@mui/styles/makeStyles'
import {useConstantContext} from '../../core/context/ConstantContext'
import {ScDialog} from '../../shared/Confirm/ScDialog'
import {Autocomplete} from '@mui/material'
import {fromNullable} from 'fp-ts/es6/Option'





interface Props {
  children: ReactElement<any>
  getValue :
  country?: T
  onChange: (_: Country) => void
}

const useStyles = makeStyles((t: Theme) => ({
  input: {
    marginBottom: t.spacing(1.5),
    minWidth: 280,
    width: 300,
  },
}))

export const SelectXXXX = <T extends unknown> ({children, onChange, country}: Props) => {
  const {m} = useI18n()
  const _countries = useConstantContext().countries
  const [countries, setCountries] = useState<Country[]>([])
  const [value, setValue] = React.useState<T | undefined>(country)
  const css = useStyles()

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
            className={css.input}
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
