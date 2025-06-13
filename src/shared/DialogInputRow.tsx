import { Box } from '@mui/material'
import React, { ReactNode } from 'react'

interface DialogInputRowProps {
  icon?: string
  label: string | ReactNode
  children: ReactNode
  id?: string
}

interface DialogInputRowExtraProps {
  children: ReactNode
}

export const DialogInputRow = ({
  icon,
  label,
  children,
  id,
}: DialogInputRowProps) => {
  return (
    <Box
      sx={{
        display: 'flex',
        alignItems: 'flex-start',
      }}
    >
      <Box
        id={id}
        sx={{
          display: 'flex',
          alignItems: 'center',
          minHeight: 50,
          color: (t) => t.palette.text.secondary,
          minWidth: 162,
          maxWidth: 162,
          flexWrap: 'wrap',
        }}
      >
        {label}
      </Box>
      <Box
        sx={{
          maxWidth: 500,
          width: '100%',
          minHeight: 50,
          flex: 1,
          overflow: 'hidden',
        }}
      >
        {children}
      </Box>
    </Box>
  )
}

const DialogInputRowExtra = ({ children }: DialogInputRowExtraProps) => {
  return (
    <Box
      sx={{
        pb: 2,
        mb: 2,
        borderBottom: (t) => `1px solid ${t.palette.divider}`,
      }}
    >
      {children}
    </Box>
  )
}
