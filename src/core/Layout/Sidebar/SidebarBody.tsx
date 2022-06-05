import * as React from 'react'
import {Box, BoxProps} from '@mui/material'

export interface SidebarBodyProps extends BoxProps {
}

export const SidebarBody = ({sx, ...props}: SidebarBodyProps) => {
  return <Box {...props} sx={{
    ...sx,
    py: 1,
    flex: 1,
    overflowY: 'auto',
  }}/>
}
