import { ReactNode, useEffect, useState } from 'react'
import { LayoutContext } from './layoutContext'
// "Mobile width" is equivalent to Tailwinds's sm and lower
const mobileBreakpoint = 768
const lgBreakpoint = 1024

export const LayoutContextProvider = ({
  hasSidebar,
  children,
}: {
  children: ReactNode
  hasSidebar: boolean
}) => {
  const [pageWidth, setPageWidth] = useState(getWindowWidth())
  const isMobileWidth = pageWidth < mobileBreakpoint
  const isMdOrLower = pageWidth < lgBreakpoint
  const [sidebarOpen, setSidebarOpen] = useState<boolean>(!isMobileWidth)
  useEffect(() => {
    if (!hasSidebar) {
      // if you log-out then re-login, it should start closed again
      setSidebarOpen(!isMobileWidth)
    }
  }, [hasSidebar, isMobileWidth])
  useEffect(() => {
    window.addEventListener('resize', () => setPageWidth(getWindowWidth()))
  }, [])

  return (
    <LayoutContext.Provider
      value={{
        sidebarOpen,
        setSidebarOpen,
        isMobileWidth,
        isMdOrLower,
        showSidebarButton: hasSidebar,
        sidebarTakesSpaceInLayout: hasSidebar && sidebarOpen && !isMobileWidth,
      }}
    >
      {children}
    </LayoutContext.Provider>
  )
}

function getWindowWidth(): number {
  return window.innerWidth
}
