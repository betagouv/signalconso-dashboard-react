import * as React from 'react'
import {Box, BoxProps, SwipeableDrawer, Switch, useScrollTrigger} from '@mui/material'
import {useLayoutContext} from '../LayoutContext'
import {layoutConfig} from '../index'
import {useI18n} from '../../i18n'
import {SidebarFooter} from './SidebarFooter'
import {SidebarItem} from './SidebarItem'
import {SidebarBody} from './SidebarBody'
import {SidebarHeader} from './SidebarHeader'
import {useScroll} from '../../../shared/useScroll'

export const Sidebar = ({children, sx, ...props}: BoxProps) => {
  const {
    isMobileWidth,
    sidebarOpen,
    setSidebarOpen,
    sidebarPinned,
    setSidebarPinned
  } = useLayoutContext()
  const scrolled = useScrollTrigger({
    disableHysteresis: true,
    threshold: layoutConfig.headerHeight
  })
  const {m} = useI18n()

  const {scrollY} = useScroll()

  const isTemporary = isMobileWidth || !sidebarPinned
  return (
    <SwipeableDrawer
      // hideBackdrop
      sx={{
        // height: `calc(100vh - ${layoutConfig.headerHeight})`,
        // width: '100vw'
      }}
      PaperProps={{
        sx: {
          position: 'fixed',
          border: 'none',
          bottom: 0,
          top: Math.max(layoutConfig.headerHeight - scrollY, 0),
          // width: layoutConfig.sidebarWith,
          // ...scrolled || isTemporary ? {
          // minHeight: '100vh',
          // } : {
          //   // minHeight: `calc(100vh - ${layoutConfig.headerHeight}px)`,
          //   // top: 'auto',
          //   position: 'absolute'
          //   // top: layoutConfig.headerHeight,
          //   // bottom: 0,
          //   // mt: layoutConfig.headerHeight + 'px'
          //   // position: 'absolute',
          // }
        }
      }}
      open={sidebarOpen}
      onOpen={() => setSidebarOpen(true)}
      onClose={() => setSidebarOpen(false)}
      variant={isTemporary ? 'temporary' : 'persistent'}
    >
      <Box sx={{
        // height: '100%',
        // ...scrolled || isTemporary ? {
        // } : {
        //   minHeight: `calc(100vh - ${layoutConfig.headerHeight}px)`
        // },
        transition: t => t.transitions.create('all'),
        overflowY: 'auto',
        background: t => t.palette.background.default,
        // height: `calc(100vh - ${headerHeight})`,
        display: 'flex',
        flexDirection: 'column',
        borderRadius: 0,
        ...sx
      }} {...props}>
        <SidebarHeader hidden={!isTemporary} />
        <SidebarBody>
          {/*<IconBtn size="small" color={sidebarPinned ? 'primary' : undefined}>*/}
          {/*  <Icon*/}
          {/*    fontSize="small"*/}
          {/*    onClick={() => setSidebarPinned(_ => !_)}*/}
          {/*  >*/}
          {/*    pin*/}
          {/*  </Icon>*/}
          {/*</IconBtn>*/}
          {children}
        </SidebarBody>
        <SidebarFooter>
          <SidebarItem icon="lock">
            {m.pin}
            <Switch
              color="primary"
              sx={{ml: 'auto'}}
              checked={sidebarPinned}
              onChange={() => setSidebarPinned(_ => !_)} />
          </SidebarItem>
        </SidebarFooter>
      </Box>
    </SwipeableDrawer>
  )
}
