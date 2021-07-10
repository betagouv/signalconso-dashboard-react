import * as React from 'react'
import {createContext, ReactNode, useContext, useEffect, useState} from 'react'
// import debounce from 'lodash.debounce'

const LayoutContext = createContext<LayoutContextProps>({} as LayoutContextProps)

export interface LayoutProviderProps {
  children: ReactNode
  mobileBreakpoint?: number
  title?: string
}

export interface LayoutContextProps {
  title?: string
  isMobileWidth: boolean
  isMobileSidebarOpened: boolean
  openMobileSidebar: () => void
  closeMobileSidebar: () => void
  toggleMobileSidebar: () => void
}

export const LayoutProvider = ({title, mobileBreakpoint = 700, children}: LayoutProviderProps) => {
  const [isMobileSidebarOpened, setIsMobileSidebarOpened] = useState(false)
  const [pageWidth, setPageWidth] = useState(getWidth())

  const openMobileSidebar = () => setIsMobileSidebarOpened(true)
  const closeMobileSidebar = () => setIsMobileSidebarOpened(false)
  const toggleMobileSidebar = () => setIsMobileSidebarOpened(!isMobileSidebarOpened)

  useEffect(() => {
    window.addEventListener('resize', () => setPageWidth(getWidth()))
    // window.addEventListener('resize', debounce(() => setMobileWidth(getWidth()), 600))
  }, [])

  return (
    <LayoutContext.Provider value={{
      isMobileSidebarOpened,
      openMobileSidebar,
      closeMobileSidebar,
      toggleMobileSidebar,
      title,
      isMobileWidth: pageWidth < mobileBreakpoint,
    }}>
      {children}
    </LayoutContext.Provider>
  )
}

function getWidth(): number {
  return window.outerWidth
}

export const useLayoutContext = (): LayoutContextProps => {
  return useContext<LayoutContextProps>(LayoutContext)
}
