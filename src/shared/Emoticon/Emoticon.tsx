import * as React from 'react'

import {Box, Theme} from '@mui/material'


export interface EmoticonProps {
  label: string,
  className?: string
  large?: boolean
  children: React.ReactNode
}


export const Emoticon = ({ label, className, children}: EmoticonProps) => {
  return (
    <Box className={className} role="img" aria-label={label}>{children}</Box>
  )
}
