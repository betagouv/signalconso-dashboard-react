import { ScHeader } from 'core/ScHeader/ScHeader'
import { ScSidebar } from 'core/ScSidebar/ScSidebar'
import { LayoutContextProvider } from 'core/context/layoutContext/LayoutContextProvider'
import { LoginManagementResult } from 'core/context/loginManagement/loginManagementContext'
import { ReactNode } from 'react'
import { useLayoutContext } from '../context/layoutContext/layoutContext'
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
      <main
        className="overflow-hidden relative flex flex-col"
        style={{
          ...(sidebarTakesSpaceInLayout
            ? { paddingLeft: `${layoutConfig.sidebarWidth}px` }
            : null),
        }}
      >
        {children}
      </main>
    </>
  )
}
