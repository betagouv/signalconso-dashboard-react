import { ScDialog } from '../../shared/ScDialog'
import React, { ChangeEvent, ReactElement, useState } from 'react'
import { useI18n } from '../../core/context/i18n/i18nContext'
import { TextField } from '@mui/material'

interface Props {
  children: ReactElement<any>
  onChange: (_: string) => void
}

function getHostname(input: string): string | undefined {
  try {
    const url = new URL(input)
    return url.hostname
  } catch (error) {
    // Si ce n'est pas une URL valide, vérifie si c'est un nom d'hôte
    const hostnameRegex = /^([a-z0-9]+(-[a-z0-9]+)*\.)+[a-z]{2,}$/i
    if (hostnameRegex.test(input)) {
      return input
    }
    return undefined
  }
}

export const EnterHostnameDialog = ({ children, onChange }: Props) => {
  const { m } = useI18n()
  const [raw, setRaw] = useState<string | undefined>()
  const [hostname, setHostname] = useState<string | undefined>()
  const test = (e: ChangeEvent<HTMLTextAreaElement>) => {
    setRaw(e.target.value)
    const hostname = getHostname(e.target.value)
    setHostname(hostname)
  }

  const error =
    !raw || hostname ? undefined : 'Entrez une URL valide ou un nom de domaine'

  return (
    <ScDialog
      maxWidth="sm"
      title={m.website}
      content={(close) => (
        <TextField
          size="small"
          error={!!error}
          helperText={error}
          value={raw}
          onChange={test}
        />
      )}
      confirmDisabled={!raw || !!error}
      onConfirm={(e, close) => {
        if (hostname) {
          onChange(hostname)
          return close()
        }
      }}
      confirmLabel={m.validate}
    >
      {children}
    </ScDialog>
  )
}
