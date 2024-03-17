import {Sidebar, SidebarHr, SidebarItem} from '../Layout/Sidebar'
import {Box, Tooltip} from '@mui/material'
import {Txt} from '../../alexlibs/mui-extension'
import {Btn} from '../../alexlibs/mui-extension'
import {siteMap} from '../siteMap'
import {EntityIcon} from '../EntityIcon'
import * as React from 'react'
import {useI18n} from '../i18n'
import {useLayoutContext} from '../Layout/LayoutContext'
import {Roles, UserWithPermission} from '../client/authenticate/Authenticate'

export const ScSidebar = ({connectedUser, logout}: {connectedUser: UserWithPermission; logout: () => void}) => {
  const path = (page: string) => '' + page
  const {m} = useI18n()
  const {setSidebarOpen, isMobileWidth} = useLayoutContext()
  const closeSidebar = () => {
    if (isMobileWidth) {
      setSidebarOpen(_ => false)
    }
  }
  return (
    <Sidebar>
      {' '}
      <Box
        sx={{
          pt: 1,
          pb: 0.5,
          px: 2,
        }}
      >
        <div className="cursor-default">
          <Txt block truncate bold>
            {connectedUser.firstName} {connectedUser.lastName}
          </Txt>
          <Txt block truncate color="primary" fontSize="small">
            {connectedUser.email}
          </Txt>
        </div>
        <Btn
          variant="outlined"
          size="small"
          icon="logout"
          color="primary"
          onClick={logout}
          sx={{
            mt: 1,
          }}
        >
          {m.logout}
        </Btn>
      </Box>
      <SidebarHr margin />
      {[Roles.Admin, Roles.DGCCRF, Roles.DGAL].includes(connectedUser.role) && (
        <SidebarItem onClick={closeSidebar} to={path(siteMap.logged.reports())} icon={EntityIcon.report}>
          {m.menu_reports}
        </SidebarItem>
      )}
      {[Roles.Pro].includes(connectedUser.role) && (
        <SidebarItem onClick={closeSidebar} to={path(siteMap.logged.reports())} icon={EntityIcon.report}>
          {m.menu_open_reports}
        </SidebarItem>
      )}
      {[Roles.Pro].includes(connectedUser.role) && (
        <SidebarItem onClick={closeSidebar} to={path(siteMap.logged.reportsfiltred.closed)} icon={EntityIcon.report}>
          {m.menu_closed_report}
        </SidebarItem>
      )}
      {[Roles.Admin, Roles.DGCCRF].includes(connectedUser.role) && (
        <SidebarItem onClick={closeSidebar} to={path(siteMap.logged.companies.value)} icon={EntityIcon.company}>
          {m.menu_companies}
        </SidebarItem>
      )}
      {[Roles.Pro].includes(connectedUser.role) && (
        <SidebarItem onClick={closeSidebar} to={path(siteMap.logged.companiesPro)} icon={EntityIcon.company}>
          {m.menu_my_companies}
        </SidebarItem>
      )}
      {[Roles.Admin].includes(connectedUser.role) && (
        <SidebarItem onClick={closeSidebar} to={path(siteMap.logged.users.value)} icon={EntityIcon.user}>
          {m.menu_users}
        </SidebarItem>
      )}
      {[Roles.Admin, Roles.DGCCRF, Roles.DGAL].includes(connectedUser.role) && (
        <SidebarItem onClick={closeSidebar} to={path(siteMap.logged.subscriptions)} icon={EntityIcon.subscription}>
          {m.menu_subscriptions}
        </SidebarItem>
      )}
      {[Roles.Admin, Roles.DGCCRF, Roles.DGAL].includes(connectedUser.role) && (
        <SidebarItem onClick={closeSidebar} to={path(siteMap.logged.stats)} icon={EntityIcon.stats}>
          {m.menu_stats}
        </SidebarItem>
      )}
      <SidebarHr margin />
      {[Roles.Admin, Roles.DGCCRF].includes(connectedUser.role) && (
        <SidebarItem onClick={closeSidebar} to={path(siteMap.logged.reportedWebsites)} icon={EntityIcon.website}>
          {m.menu_websites}
        </SidebarItem>
      )}
      {[Roles.Admin, Roles.DGCCRF].includes(connectedUser.role) && (
        <SidebarItem onClick={closeSidebar} to={path(siteMap.logged.reportedPhone)} icon={EntityIcon.phone}>
          {m.menu_phones}
        </SidebarItem>
      )}
      <SidebarHr margin />
      {[Roles.Admin].includes(connectedUser.role) && (
        <SidebarItem onClick={closeSidebar} to={path(siteMap.logged.tools)} icon={EntityIcon.admin}>
          {m.menu_admin_tools}
        </SidebarItem>
      )}
      <SidebarHr margin />
      {[Roles.Pro].includes(connectedUser.role) && (
        <SidebarItem onClick={closeSidebar} to={path(siteMap.logged.joinInformation)} icon="info">
          {m.menu_join_informations}
        </SidebarItem>
      )}
      <SidebarItem onClick={closeSidebar} to={path(siteMap.logged.settings)} icon="settings">
        {m.menu_settings}
      </SidebarItem>
      {[Roles.Admin, Roles.DGCCRF, Roles.DGAL].includes(connectedUser.role) && (
        <SidebarItem onClick={closeSidebar} to={path(siteMap.logged.modeEmploiDGCCRF)} icon="help">
          {m.menu_modeEmploiDGCCRF}
        </SidebarItem>
      )}
    </Sidebar>
  )
}
