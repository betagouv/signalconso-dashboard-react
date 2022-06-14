import React, {ReactElement} from 'react'
import {useI18n} from '../../core/i18n'
import {Autocomplete, TextField, Theme} from '@mui/material'
import makeStyles from '@mui/styles/makeStyles'
import {ScDialog} from '../../shared/Confirm/ScDialog'
import {fromNullable} from 'fp-ts/es6/Option'
import {ScInput} from "../../shared/Input/ScInput";

interface Props<T> {
  children: ReactElement<any>
  inputLabel: string
  title: string
  defaultValue?: T
  getValueName: (_: T) => string
  onChange: (_?: T) => void
  options?: T[]
}

const useStyles = makeStyles((t: Theme) => ({
  input: {
    marginBottom: t.spacing(1.5),
    minWidth: 280,
    width: 300,
  },
}))

export const SelectInvestigationAttributes = <T extends unknown>({
  children,
  inputLabel,
  title,
  defaultValue,
  getValueName,
  onChange,
  options,
}: Props<T>) => {
  const {m} = useI18n()
  const [value, setValue] = React.useState<T | undefined>(defaultValue)
  const css = useStyles()

  return (
    <ScDialog
      PaperProps={{style: {position: 'static'}}}
      maxWidth="sm"
      title={title}
      content={_ => (
        <>
          <Autocomplete
            disablePortal
            multiple={false}
            defaultValue={defaultValue}
            className={css.input}
            onChange={(event, newInputValue) => {
              setValue(fromNullable(newInputValue).toUndefined())
            }}
            options={options ?? []}
            getOptionLabel={getValueName}
            renderInput={params => <ScInput {...params} label={inputLabel} />}
          />
        </>
      )}
      onConfirm={(_, close) => {
        onChange(value)
        close()
      }}
      confirmLabel={m.edit}
    >
      {children}
    </ScDialog>
  )
}
