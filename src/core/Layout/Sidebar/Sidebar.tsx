import { Box, BoxProps, SwipeableDrawer } from '@mui/material'
import { useEffect } from 'react'
import { useLayoutContext } from '../../context/layoutContext/layoutContext'
import { layoutConfig } from '../layoutConfig'
import { SidebarBody } from './SidebarBody'
import { SidebarHeader } from './SidebarHeader'

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

  useEffect(() => {
    // Element has been re-created by SwipeableDrawer, thus variable point to nothing.
    sidebar = null
    stickSidebarToHeader()
    setSidebarOpen((_) => !isMobileWidth)
    // eslint-disable-next-line react-hooks/exhaustive-deps
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
