import { createContext, Dispatch, SetStateAction, useContext } from 'react'

export const LayoutContext = createContext<LayoutContextShape>(
  {} as LayoutContextShape,
)

interface LayoutContextShape {
  sidebarOpen: boolean
  setSidebarOpen: Dispatch<SetStateAction<boolean>>
  isMobileWidth: boolean
  showSidebarButton?: boolean
  // do we need to reserve space on the left for the sidebar ?
  sidebarTakesSpaceInLayout: boolean
}
export const useLayoutContext = (): LayoutContextShape => {
  return useContext<LayoutContextShape>(LayoutContext)
}
