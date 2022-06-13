import * as React from 'react'
import {ReactNode} from 'react'
import {Box, BoxProps, Theme} from '@mui/material'
import createStyles from '@mui/styles/createStyles'
import makeStyles from '@mui/styles/makeStyles'

export interface SidebarBodyProps extends BoxProps {
}

export const SidebarBody = ({children, sx, ...props}: SidebarBodyProps) => {
  return <Box sx={{
    py: 1,
    flex: 1,
    overflowY: 'auto',
    ...sx
  }} {...props}>{children}</Box>
}
