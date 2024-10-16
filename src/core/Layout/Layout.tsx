import { Box } from '@mui/material'
import { ScHeader } from 'core/ScHeader/ScHeader'
import { ScSidebar } from 'core/ScSidebar/ScSidebar'
import { LoginManagementResult } from 'core/useLoginManagement'
import { ReactNode } from 'react'
import {
  LayoutContextProvider,
  useLayoutContext,
} from '../context/LayoutContext'
import { layoutConfig } from './layoutConfig'

interface LayoutProps {
  loginManagementResult: LoginManagementResult
  children: ReactNode
}

export const Layout = ({ children, loginManagementResult }: LayoutProps) => {
  const sidebar = loginManagementResult.connectedUser ? (
    <ScSidebar
      connectedUser={loginManagementResult.connectedUser}
      logout={loginManagementResult.logout}
    />
  ) : null
  return (
    <LayoutContextProvider hasSidebar={!!sidebar}>
      <LayoutUsingContext {...{ sidebar, children }} />
    </LayoutContextProvider>
  )
}

function LayoutUsingContext({
  sidebar,
  children,
}: {
  sidebar?: ReactNode
  children: ReactNode
}) {
  const { sidebarTakesSpaceInLayout } = useLayoutContext()
  return (
    <>
      <ScHeader />
      {sidebar}
      <Box
        component="main"
        sx={{
          transition: (t) => t.transitions.create('all'),
          overflow: 'hidden',
          position: 'relative',
          display: 'flex',
          flexDirection: 'column',
          ...(sidebarTakesSpaceInLayout
            ? { paddingLeft: `${layoutConfig.sidebarWidth}px` }
            : null),
        }}
      >
        {children}
      </Box>
    </>
  )
}
