import makeStyles from '@mui/styles/makeStyles'
import {Box, Theme} from '@mui/material'
import React, {ReactNode} from 'react'

export interface DialogInputRowProps {
  label: string | ReactNode
  children: ReactNode
}

export interface DialogInputRowExtraProps {
  children: ReactNode
}

export const DialogInputRow = ({label, children}: DialogInputRowProps) => {
  const useRowStyles = makeStyles((t: Theme) => ({
    root: {
      display: 'flex',
      alignItems: 'flex-start',
    },
    label: {
      display: 'flex',
      alignItems: 'center',
      minHeight: 50,
      color: t.palette.text.secondary,
      minWidth: 130,
      maxWidth: 130,
      flexWrap: 'wrap',
    },
    content: {
      maxWidth: 240,
      width: '100%',
      minHeight: 50,
      flex: 1,
      overflow: 'hidden',
    },
  }))
  const css = useRowStyles()
  return (
    <div className={css.root}>
      <div className={css.label}>{label}</div>
      <div className={css.content}>{children}</div>
    </div>
  )
}

export const DialogInputRowExtra = ({children}: DialogInputRowExtraProps) => {
  return (
    <Box
      sx={{
        pb: 2,
        mb: 2,
        borderBottom: t => `1px solid ${t.palette.divider}`,
      }}
    >
      {children}
    </Box>
  )
}
