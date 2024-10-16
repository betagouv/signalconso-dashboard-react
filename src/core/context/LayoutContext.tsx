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
  const [sidebarOpen, setSidebarOpen] = useState<boolean>(true)

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
  return window.innerWidth
}

export const useLayoutContext = (): LayoutContextShape => {
  return useContext<LayoutContextShape>(LayoutContext)
}
