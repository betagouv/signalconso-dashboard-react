import * as React from 'react'
import {ReactNode} from 'react'
import {Box, BoxProps, Theme} from '@mui/material'
import createStyles from '@mui/styles/createStyles'
import makeStyles from '@mui/styles/makeStyles'
import classNames from 'classnames'

export interface SidebarFooterProps extends BoxProps {
}

export const SidebarFooter = ({children, sx, ...props}: SidebarFooterProps) => {
  return <Box sx={{
    py: 1/2,
    borderTop: t => '1px solid ' + t.palette.divider,
    ...sx,
  }} {...props}>{children}</Box>
}
