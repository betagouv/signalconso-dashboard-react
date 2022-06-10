import * as React from 'react'
import {ReactElement, ReactNode} from 'react'
import {LayoutProvider, useLayoutContext} from './LayoutContext'
import {Header} from './Header/Header'
import {Box} from '@mui/material'
import {layoutConfig} from './index'
import {defaultSpacing} from '../theme'

export const sidebarWith = 220

export interface LayoutProps {
  sidebar?: ReactElement<any>
  title?: string
  children?: ReactNode
  mobileBreakpoint?: number
}

export const Layout = ({sidebar, title, mobileBreakpoint, children}: LayoutProps) => {
  return (
    <LayoutProvider title={title} mobileBreakpoint={mobileBreakpoint}>
      <LayoutUsingContext sidebar={sidebar}>{children}</LayoutUsingContext>
    </LayoutProvider>
  )
}

const LayoutUsingContext = ({sidebar, children}: Pick<LayoutProps, 'sidebar' | 'children'>) => {
  const {sidebarOpen, sidebarPinned, isMobileWidth} = useLayoutContext()
  console.log(layoutConfig.sidebarWith, defaultSpacing, layoutConfig.sidebarWith + defaultSpacing)
  const width = sidebarOpen && sidebarPinned && !isMobileWidth ?  layoutConfig.sidebarWith : 0
  return (
    <>
      <Header />
      <Box sx={{
        display: 'flex'
      }}>
        <Box component="aside" sx={{
          transition: t => t.transitions.create('all'),
          width, 
          minWidth: width,
        }}>
          {sidebar}
        </Box>
        <Box
          component="main"
          sx={{
            transition: t => t.transitions.create('all'),
            // paddingLeft: ((sidebarOpen ? layoutConfig.sidebarWith : 0) + defaultSpacing) + 'px',
            overflow: 'hidden',
            position: 'relative',
            display: 'flex',
            flexDirection: 'column'
          }}
        >
          {children}
        </Box>
      </Box>
    </>
  )
}
