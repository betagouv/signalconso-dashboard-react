import {Box} from '@mui/material'
import {ReactElement, ReactNode} from 'react'
import {defaultSpacing} from '../theme'
import {LayoutProvider, useLayoutContext} from './LayoutContext'
import {layoutConfig} from './index'

export const sidebarWith = 220

export interface LayoutProps {
  sidebar?: ReactElement<any>
  header?: ReactElement<any>
  children?: ReactNode
}

export const Layout = ({sidebar, header, children}: LayoutProps) => {
  return (
    <LayoutProvider showSidebarButton={!!sidebar}>
      <LayoutUsingContext sidebar={sidebar} header={header}>
        {children}
      </LayoutUsingContext>
    </LayoutProvider>
  )
}

const LayoutUsingContext = ({sidebar, header, children}: Pick<LayoutProps, 'sidebar' | 'header' | 'children'>) => {
  const {sidebarOpen, sidebarPinned, isMobileWidth} = useLayoutContext()
  return (
    <>
      {header}
      {sidebar}
      <Box
        component="main"
        sx={{
          transition: t => t.transitions.create('all'),
          paddingLeft:
            (sidebar && sidebarOpen && sidebarPinned && !isMobileWidth ? layoutConfig.sidebarWith + defaultSpacing : 0) + 'px',
          overflow: 'hidden',
          position: 'relative',
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        {children}
      </Box>
    </>
  )
}
