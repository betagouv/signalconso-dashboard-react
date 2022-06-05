import * as React from 'react'
import {Box, BoxProps} from '@mui/material'

export interface SidebarHrProps extends Omit<BoxProps, 'margin'> {
  margin?: boolean
}

export const SidebarHr = ({sx, margin, ...props}: SidebarHrProps) => {
  return <Box {...props} sx={{
    ...sx,
    height: '1px',
    background: t => t.palette.divider,
    ...margin && {my: 2}
  }} />
}
