import * as React from 'react'
import { Box, BoxProps } from '@mui/material'

type SidebarBodyProps = BoxProps

export const SidebarBody = ({ children, sx, ...props }: SidebarBodyProps) => {
  return (
    <Box
      sx={{
        py: 1,
        flex: 1,
        overflowY: 'auto',
        ...sx,
      }}
      {...props}
    >
      {children}
    </Box>
  )
}
