import {Box, BoxProps, Icon, Theme} from '@mui/material'
import createStyles from '@mui/styles/createStyles'
import makeStyles from '@mui/styles/makeStyles'
import * as React from 'react'
import {useLayoutContext} from '../LayoutContext'
import classNames from 'classnames'
import {IconBtn} from 'mui-extension/lib'

export const headerHeight = 52

export const SidebarTitle = ({sx, ...props}: BoxProps) => {
  const {title, isMobileWidth, isMobileSidebarOpened, toggleMobileSidebar} = useLayoutContext()
  return (
    <Box {...props} sx={{
      ...sx,
      height: headerHeight,
      display: 'flex',
      alignItems: 'center',
      pr: 2,
      pl: 1.25,
      background: t => t.palette.background.paper,
    }}>
      <IconBtn onClick={toggleMobileSidebar} sx={{...(!isMobileWidth && {visibility: 'hidden'})}}>
        <Icon>{isMobileSidebarOpened ? 'clear' : 'menu'}</Icon>
      </IconBtn>
      <Box sx={{
        flex: 1,
        fontSize: t => t.typography.h6.fontSize,
      }}>
        {title}
      </Box>
    </Box>
  )
}
