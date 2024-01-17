import {createContext, Dispatch, ReactNode, SetStateAction, useContext, useEffect, useState} from 'react'
import {usePersistentState} from '../../alexlibs/react-persistent-state'

const LayoutContext = createContext<UseLayoutContextProps>({} as UseLayoutContextProps)

// "Mobile width" is equivalent to Tailwinds's sm and lower
const mobileBreakpoint = 768

export interface UseLayoutContextProps {
  sidebarOpen: boolean
  setSidebarOpen: Dispatch<SetStateAction<boolean>>
  isMobileWidth: boolean
  showSidebarButton?: boolean
  // do we need to reserve space on the left for the sidebar ?
  sidebarTakesSpaceInLayout: boolean
}

export const LayoutContextProvider = ({hasSidebar, children}: {children: ReactNode; hasSidebar: boolean}) => {
  const [pageWidth, setPageWidth] = useState(getWindowWidth())
  const [sidebarOpen, setSidebarOpen] = usePersistentState(true, 'sidebarOpen')

  useEffect(() => {
    window.addEventListener('resize', () => setPageWidth(getWindowWidth()))
  }, [])

  const isMobileWidth = pageWidth < mobileBreakpoint
  return (
    <LayoutContext.Provider
      value={{
        sidebarOpen,
        setSidebarOpen,
        isMobileWidth,
        showSidebarButton: hasSidebar,
        sidebarTakesSpaceInLayout: hasSidebar && sidebarOpen && !isMobileWidth,
      }}
    >
      {children}
    </LayoutContext.Provider>
  )
}

function getWindowWidth(): number {
  return window.outerWidth
}

export const useLayoutContext = (): UseLayoutContextProps => {
  return useContext<UseLayoutContextProps>(LayoutContext)
}
