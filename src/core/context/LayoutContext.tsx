import {
  createContext,
  Dispatch,
  ReactNode,
  SetStateAction,
  useContext,
  useEffect,
  useState,
} from 'react'

const LayoutContext = createContext<LayoutContextShape>(
  {} as LayoutContextShape,
)

// "Mobile width" is equivalent to Tailwinds's sm and lower
const mobileBreakpoint = 768

interface LayoutContextShape {
  sidebarOpen: boolean
  setSidebarOpen: Dispatch<SetStateAction<boolean>>
  isMobileWidth: boolean
  showSidebarButton?: boolean
  // do we need to reserve space on the left for the sidebar ?
  sidebarTakesSpaceInLayout: boolean
}

export const LayoutContextProvider = ({
  hasSidebar,
  children,
}: {
  children: ReactNode
  hasSidebar: boolean
}) => {
  const [pageWidth, setPageWidth] = useState(getWindowWidth())
  const isMobileWidth = pageWidth < mobileBreakpoint
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

export const useLayoutContext = (): LayoutContextShape => {
  return useContext<LayoutContextShape>(LayoutContext)
}
