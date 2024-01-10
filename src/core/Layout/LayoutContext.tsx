import * as React from 'react'
import {createContext, Dispatch, ReactNode, SetStateAction, useContext, useEffect, useState} from 'react'
import {usePersistentState} from '../../alexlibs/react-persistent-state'

const LayoutContext = createContext<UseLayoutContextProps>({} as UseLayoutContextProps)

export interface LayoutProviderProps {
  children: ReactNode
  showSidebarButton?: boolean
}

// "Mobile width" is equivalent to Tailwinds's sm and lower
const mobileBreakpoint = 768

export interface UseLayoutContextProps {
  sidebarOpen: boolean
  setSidebarOpen: Dispatch<SetStateAction<boolean>>
  sidebarPinned: boolean
  setSidebarPinned: Dispatch<SetStateAction<boolean>>
  isMobileWidth: boolean
  showSidebarButton?: boolean
  // should the main container leave space on the left for the sidebar ?
  sidebarTakesSpaceInLayout: boolean
}

export const LayoutProvider = ({showSidebarButton, children}: LayoutProviderProps) => {
  const [pageWidth, setPageWidth] = useState(getWidth())
  const [sidebarOpen, setSidebarOpen] = usePersistentState(true, 'sidebarOpen')
  const [sidebarPinned, setSidebarPinned] = usePersistentState(true, 'sidebarPinned')

  useEffect(() => {
    window.addEventListener('resize', () => setPageWidth(getWidth()))
  }, [])

  const isMobileWidth = pageWidth < mobileBreakpoint
  return (
    <LayoutContext.Provider
      value={{
        sidebarOpen,
        setSidebarOpen,
        sidebarPinned,
        setSidebarPinned,
        isMobileWidth,
        showSidebarButton,
        sidebarTakesSpaceInLayout: sidebarOpen && sidebarPinned && !isMobileWidth,
      }}
    >
      {children}
    </LayoutContext.Provider>
  )
}

function getWidth(): number {
  return window.outerWidth
}

export const useLayoutContext = (): UseLayoutContextProps => {
  return useContext<UseLayoutContextProps>(LayoutContext)
}
