import * as React from 'react'
import { Box, BoxProps } from '@mui/material'

interface SidebarFooterProps extends BoxProps {}

export const SidebarFooter = ({
  children,
  sx,
  ...props
}: SidebarFooterProps) => {
  return (
    <Box
      sx={{
        py: 1 / 2,
        borderTop: (t) => '1px solid ' + t.palette.divider,
        ...sx,
      }}
      {...props}
    >
      {children}
    </Box>
  )
}
