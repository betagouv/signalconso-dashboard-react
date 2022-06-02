import makeStyles from '@mui/styles/makeStyles'
import {Box, Icon, Theme} from '@mui/material'
import React, {ReactNode} from 'react'

export interface DialogInputRowProps {
  icon?: string
  label: string | ReactNode
  children: ReactNode
}

export interface DialogInputRowExtraProps {
  children: ReactNode
}

export const DialogInputRow = ({icon, label, children}: DialogInputRowProps) => {
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
      minWidth: 136,
      maxWidth: 136,
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
      <Box sx={{
        display: 'flex',
        alignItems: 'center'
      }}>
        {/*{icon && (*/}
        {/*  <Icon fontSize="small" sx={{*/}
        {/*    color: t => t.palette.text.disabled,*/}
        {/*    mr: 1*/}
        {/*  }}>{icon}</Icon>*/}
        {/*)}*/}
        <div className={css.label}>{label}</div>
      </Box>
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
