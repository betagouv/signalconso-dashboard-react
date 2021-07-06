import * as React from 'react'
import {HTMLProps, ReactNode} from 'react'
import {createStyles, makeStyles, Theme} from '@material-ui/core'
import {Sidebar, SidebarBody, SidebarFooter, SidebarItem} from 'mui-extension'
import {NavLink as Link, useLocation} from 'react-router-dom'
import {useI18n} from '../../../core/i18n'
import {useLoginContext} from '../../../App'
import {EntityIcon} from '../../../core/EntityIcon'

const useStyles = makeStyles((t: Theme) => createStyles({
  avatar: {
    background: t.palette.divider,
    margin: 'auto',
  },
  itemI: {
    marginLeft: 'auto',
    color: t.palette.text.disabled,
  },
}))

interface MenuProps {
  basePath?: string
  className?: string
}

interface MenuItemProps extends HTMLProps<any> {
  to: string
  icon?: string | ReactNode
  large?: boolean
}

export const MenuItem = ({to, ...otherProps}: MenuItemProps) => {
  const {pathname} = useLocation()
  return (
    <Link to={to}>
      <SidebarItem active={pathname === to} {...otherProps}/>
    </Link>
  )
}

export const Menu = ({className, basePath = ''}: MenuProps) => {
  const path = (page: string) => basePath + page
  const {m} = useI18n()
  const {apiSdk, logout} = useLoginContext()

  return (
    <Sidebar className={className}>
      <SidebarBody>
        <MenuItem to={path('/')} icon="home" large>{m.home}</MenuItem>
        <MenuItem to={path('/reports')} icon={EntityIcon.report}>{m.reports}</MenuItem>
      </SidebarBody>
      <SidebarFooter>
        <SidebarItem icon="logout" onClick={logout}>{m.logout}</SidebarItem>
      </SidebarFooter>
    </Sidebar>
  )
}
