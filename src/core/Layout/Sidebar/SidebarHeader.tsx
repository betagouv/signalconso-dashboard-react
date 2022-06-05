import * as React from 'react'
import {Box, BoxProps} from '@mui/material'

export interface SidebarHeaderProps extends BoxProps {
}

export const SidebarHeader = ({sx, ...props}: SidebarHeaderProps) => {
  return <Box {...props} sx={{
    ...sx,
    py: 1,
    borderTop: t => '1px solid ' + t.palette.divider,
    borderBottom: t => '1px solid ' + t.palette.divider,
  }}/>
}
