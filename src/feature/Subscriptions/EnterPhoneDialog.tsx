import { ScDialog } from '../../shared/ScDialog'
import React, { ChangeEvent, ReactElement, useState } from 'react'
import { useI18n } from '../../core/context/i18n/i18nContext'
import { TextField } from '@mui/material'

interface Props {
  children: ReactElement<any>
  onChange: (_: string) => void
}

export const EnterPhoneDialog = ({ children, onChange }: Props) => {
  const { m } = useI18n()
  const [raw, setRaw] = useState<string | undefined>()
  const [error, setError] = useState<boolean>(false)
  const test = (e: ChangeEvent<HTMLTextAreaElement>) => {
    setRaw(e.target.value)
    const r = /^((((\+)33|0|0033)[1-9]([.\-\s+]?\d{2}){4})|(\d{2,5}))$/g

    if (r.test(e.target.value)) {
      setError(false)
    } else {
      setError(true)
    }
  }

  const errorText = error ? 'Téléphone invalide' : undefined

  return (
    <ScDialog
      maxWidth="sm"
      title={m.phone}
      content={(close) => (
        <TextField
          size="small"
          error={error}
          helperText={errorText}
          value={raw}
          onChange={test}
        />
      )}
      confirmDisabled={!raw || error}
      onConfirm={(e, close) => {
        if (raw) {
          onChange(raw)
          return close()
        }
      }}
      confirmLabel={m.validate}
    >
      {children}
    </ScDialog>
  )
}
