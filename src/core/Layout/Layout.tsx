import {Box} from '@mui/material'
import {ReactElement, ReactNode} from 'react'
import {LayoutContextProvider, useLayoutContext} from './LayoutContext'
import {layoutConfig} from './index'

export interface LayoutProps {
  sidebar?: ReactElement<any>
  header: ReactElement<any>
  children: ReactNode
}

export const Layout = ({sidebar, header, children}: LayoutProps) => {
  return (
    <LayoutContextProvider hasSidebar={!!sidebar}>
      <LayoutUsingContext sidebar={sidebar} header={header}>
        {children}
      </LayoutUsingContext>
    </LayoutContextProvider>
  )
}

const LayoutUsingContext = ({sidebar, header, children}: Pick<LayoutProps, 'sidebar' | 'header' | 'children'>) => {
  const {sidebarTakesSpaceInLayout} = useLayoutContext()
  return (
    <>
      {header}
      {sidebar}
      <Box
        component="main"
        sx={{
          transition: t => t.transitions.create('all'),
          overflow: 'hidden',
          position: 'relative',
          display: 'flex',
          flexDirection: 'column',
          ...(sidebarTakesSpaceInLayout ? {paddingLeft: `${layoutConfig.sidebarWidth}px`} : null),
        }}
      >
        {children}
      </Box>
    </>
  )
}
