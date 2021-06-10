import * as React from 'react'
import {ReactNode} from 'react'
import {createStyles, makeStyles, Theme} from '@material-ui/core'
import classNames from 'classnames'
import {LayoutProvider, useLayoutContext} from './LayoutContext'
import {Header} from './Header/Header'

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
  toggleSidebarBtnHostElementSelector: string
}

export const Layout = ({title, mobileBreakpoint, children, toggleSidebarBtnHostElementSelector}: LayoutProps) => {
  return (
    <LayoutProvider title={title} mobileBreakpoint={mobileBreakpoint}>
      <LayoutUsingContext>
        {children}
      </LayoutUsingContext>
    </LayoutProvider>
  )
}

const LayoutUsingContext = ({children}: any) => {
  const classes = useStyles()
  const {isMobileWidth} = useLayoutContext()
  return (
    <>
      <Header/>
      <div className={classNames(classes.root)}>
        {children}
      </div>
    </>
  )
}
