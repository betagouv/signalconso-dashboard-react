import * as React from 'react'
import {ReactNode} from 'react'
import {createStyles, makeStyles, Theme} from '@material-ui/core'
import classNames from 'classnames'
import {LayoutProvider, useLayoutContext} from './LayoutContext'
import {SidebarToggleBtnPortal} from './Sidebar/SidebarToggleBtnPortal'

export const sidebarWith = 220

const useStyles = makeStyles((t: Theme) => createStyles({
  root: {
    overflow: 'hidden',
    position: 'relative',
    display: 'flex',
  },
  rootDesktop: {
    marginLeft: sidebarWith,
  },
}))

export interface LayoutProps {
  title?: string
  children?: ReactNode
  mobileBreakpoint?: number
  sidebar?: ReactNode,
  toggleSidebarBtnHostElementSelector: string
}

export const Layout = ({title, mobileBreakpoint, children, sidebar, toggleSidebarBtnHostElementSelector}: LayoutProps) => {
  return (
    <LayoutProvider title={title} mobileBreakpoint={mobileBreakpoint}>
      <LayoutUsingContext sidebar={sidebar}>
        <SidebarToggleBtnPortal hostElementId={toggleSidebarBtnHostElementSelector}/>
        {children}
      </LayoutUsingContext>
    </LayoutProvider>
  )
}

const LayoutUsingContext = ({children, sidebar: Sidebar}: any) => {
  const classes = useStyles()
  const {isMobileWidth} = useLayoutContext()
  return (
    <>
      <div className={classNames(classes.root, !isMobileWidth && classes.rootDesktop)}>
        {Sidebar && <Sidebar/>}
        {children}
      </div>
    </>
  )
}
