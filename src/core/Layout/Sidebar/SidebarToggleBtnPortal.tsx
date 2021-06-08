import {createPortal} from 'react-dom'
import {useLayoutContext} from '../LayoutContext'
import React from 'react'
import {Icon} from '@material-ui/core'
import {IconBtn} from 'mui-extension/lib'

interface SidebarOpenProps {
  hostElementId: string
}

export const SidebarToggleBtnPortal = ({hostElementId}: SidebarOpenProps) => {
  const {isMobileWidth, isMobileSidebarOpened, toggleMobileSidebar,} = useLayoutContext()
  return isMobileWidth ? createPortal(
    <div>
      <IconBtn onClick={toggleMobileSidebar}>
        <Icon>{isMobileSidebarOpened ? 'clear' : 'menu'}</Icon>
      </IconBtn>
    </div>
    ,
    document.querySelector(hostElementId)!
  ) : <></>
}
