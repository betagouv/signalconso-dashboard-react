import * as React from 'react'

import {Box, BoxProps, Theme} from '@mui/material'


export interface EmoticonProps extends BoxProps{
  label: string,
  children: React.ReactNode
}


export const Emoticon = ({ label, children,sx}: EmoticonProps) => {
  return (
    <Box  sx={sx} role="img" aria-label={label}>{children}</Box>
  )
}
