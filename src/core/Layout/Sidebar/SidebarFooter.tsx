import * as React from 'react'
import {Box, BoxProps, Theme} from '@mui/material'
import createStyles from '@mui/styles/createStyles'
import makeStyles from '@mui/styles/makeStyles'

export interface SidebarFooterProps extends BoxProps {
}

export const SidebarFooter = ({sx, ...props}: SidebarFooterProps) => {
  return <Box {...props} sx={{
    ...sx,
    py: 1 / 2,
    borderTop: t => '1px solid ' + t.palette.divider
  }} />
}
