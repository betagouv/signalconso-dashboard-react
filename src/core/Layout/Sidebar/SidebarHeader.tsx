import * as React from 'react'
import {ReactNode} from 'react'
import {Box, BoxProps, Theme} from '@mui/material'
import createStyles from '@mui/styles/createStyles'
import makeStyles from '@mui/styles/makeStyles'
import classNames from 'classnames'

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
