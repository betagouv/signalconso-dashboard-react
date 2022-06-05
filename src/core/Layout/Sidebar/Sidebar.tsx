import * as React from 'react'
import {Box, BoxProps, SwipeableDrawer} from '@mui/material'
import {sidebarWith} from '../Layout'
import {SidebarTitle} from './SidebarTitle'
import {useLayoutContext} from '../LayoutContext'

export interface SidebarProps extends BoxProps {
}

export const Sidebar = ({children, sx, ...props}: SidebarProps) => {
  const {isMobileWidth, isMobileSidebarOpened, openMobileSidebar, closeMobileSidebar} = useLayoutContext()
  const opened = !isMobileWidth || isMobileSidebarOpened

  return (
    <SwipeableDrawer
      open={opened}
      onOpen={openMobileSidebar}
      onClose={closeMobileSidebar}
      variant={isMobileWidth ? 'temporary' : 'permanent'}
    >
      <>
        <Box {...props} sx={{
          ...sx,
          width: sidebarWith,
          height: '100vh',
          display: 'flex',
          flexDirection: 'column',
          borderRadius: 0,
        }}>
          <SidebarTitle />
          {children}
        </Box>
      </>
    </SwipeableDrawer>
  )
}
