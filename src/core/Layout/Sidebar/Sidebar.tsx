import * as React from 'react'
import {ReactNode} from 'react'
import {SwipeableDrawer, Theme} from '@mui/material'
import createStyles from '@mui/styles/createStyles'
import makeStyles from '@mui/styles/makeStyles'
import classNames from 'classnames'
import {sidebarWith} from '../Layout'
import {SidebarTitle} from './SidebarTitle'
import {useLayoutContext} from '../LayoutContext'

const useStyles = makeStyles((t: Theme) =>
  createStyles({
    root: {
      width: sidebarWith,
      height: '100vh',
      display: 'flex',
      flexDirection: 'column',
      borderRadius: 0,
    },
  }),
)

export interface SidebarProps {
  className?: string
  children?: ReactNode
}

export const Sidebar = ({children, className}: SidebarProps) => {
  const classes = useStyles()
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
        <div className={classNames(classes.root, className)}>
          <SidebarTitle />
          {children}
        </div>
      </>
    </SwipeableDrawer>
  )
}
