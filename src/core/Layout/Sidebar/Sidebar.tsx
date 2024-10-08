import * as React from 'react'
import { useEffect } from 'react'
import { Box, BoxProps, SwipeableDrawer, Switch } from '@mui/material'
import { useLayoutContext } from '../LayoutContext'
import { layoutConfig } from '../index'
import { useI18n } from '../../i18n'
import { SidebarFooter } from './SidebarFooter'
import { SidebarItem } from './SidebarItem'
import { SidebarBody } from './SidebarBody'
import { SidebarHeader } from './SidebarHeader'
import { stopPropagation } from '../../helper'

const sidebarId = 'signalconso-sidebar-id'

let sidebar: HTMLElement | null = null

/**
 * Don't do it the React way to improve perfs
 */
const stickSidebarToHeader = () => {
  if (!sidebar) {
    sidebar = document.getElementById(sidebarId)
  }
  if (sidebar) {
    sidebar.style.top =
      Math.max(layoutConfig.headerHeight - window.scrollY, 0) + 'px'
  }
}

export const Sidebar = ({ children, sx, ...props }: BoxProps) => {
  const { isMobileWidth, sidebarOpen, setSidebarOpen } = useLayoutContext()
  const { m } = useI18n()

  useEffect(() => {
    // Element has been re-created by SwipeableDrawer, thus variable point to nothing.
    sidebar = null
    stickSidebarToHeader()
    setSidebarOpen((_) => !isMobileWidth)
  }, [isMobileWidth])

  useEffect(() => {
    window.addEventListener('scroll', stickSidebarToHeader)
  }, [])

  const isTemporary = isMobileWidth

  return (
    <SwipeableDrawer
      PaperProps={{
        id: sidebarId,
        sx: {
          position: 'fixed',
          border: 'none',
          bottom: 0,
          height: 'auto',
          ...(isTemporary && {
            top: '0 !important',
          }),
        },
      }}
      open={sidebarOpen}
      onOpen={() => setSidebarOpen(true)}
      onClose={() => setSidebarOpen(false)}
      variant={isTemporary ? 'temporary' : 'persistent'}
    >
      <Box
        sx={{
          width: layoutConfig.sidebarWidth,
          height: '100%',
          transition: (t) => t.transitions.create('width'),
          overflowY: 'auto',
          background: (t) => t.palette.background.default,
          display: 'flex',
          flexDirection: 'column',
          borderRadius: 0,
          ...sx,
        }}
        {...props}
      >
        <SidebarHeader hidden={!isTemporary} />
        <SidebarBody>{children}</SidebarBody>
      </Box>
    </SwipeableDrawer>
  )
}
