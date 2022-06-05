import * as React from 'react'
import {Box, BoxProps} from '@mui/material'

export interface SidebarFooterProps extends BoxProps {
}

export const SidebarFooter = ({sx, ...props}: SidebarFooterProps) => {
  return <Box {...props} sx={{
    ...sx,
    py: 1 / 2,
    borderTop: t => '1px solid ' + t.palette.divider
  }} />
}
