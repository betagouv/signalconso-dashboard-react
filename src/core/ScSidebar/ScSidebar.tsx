import { Icon } from '@mui/material'
import { Btn, Txt } from '../../alexlibs/mui-extension'
import { UserNameLabel } from '../../shared/UserNameLabel'
import { EntityIcon } from '../EntityIcon'
import { Sidebar, SidebarHr, SidebarItem } from '../Layout/Sidebar'
import { useLayoutContext } from '../context/LayoutContext'
import { useI18n } from '../i18n'
import { siteMap } from '../siteMap'
import {
  AuthProvider,
  Role,
  roleAdmins,
  roleAgents,
  User,
} from '../client/user/User'

export const ScSidebar = ({
  connectedUser,
  logout,
}: {
  connectedUser: User
  logout: () => void
}) => {
  const path = (page: string) => '' + page
  const { m } = useI18n()
  const { setSidebarOpen, isMobileWidth } = useLayoutContext()
  const closeSidebar = () => {
    if (isMobileWidth) {
      setSidebarOpen((_) => false)
    }
  }
  return (
    <Sidebar>
      <div className="pt-2 pb-1 px-4">
        <div className="cursor-default">
          {connectedUser && connectedUser.impersonator && (
            <div className="flex flex-col bg-yellow-200 items-center">
              <Icon fontSize="large">theater_comedy</Icon>
              <p className="text-sm font-bold">{connectedUser.impersonator}</p>
              <p className="text-sm italic">connecté en tant que</p>
            </div>
          )}
          <Txt block truncate bold>
            <UserNameLabel
              firstName={connectedUser.firstName}
              lastName={connectedUser.lastName}
            />
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
      </div>
      <SidebarHr margin />
      {([...roleAdmins, ...roleAgents] as Role[]).includes(
        connectedUser.role,
      ) && (
        <SidebarItem
          onClick={closeSidebar}
          to={path(siteMap.logged.reports())}
          icon={EntityIcon.report}
        >
          {m.menu_reports}
        </SidebarItem>
      )}
      {(['Professionnel'] as Role[]).includes(connectedUser.role) && (
        <SidebarItem
          onClick={closeSidebar}
          to={path(siteMap.logged.reports())}
          icon={EntityIcon.report}
        >
          {m.menu_open_reports}
        </SidebarItem>
      )}
      {(['Professionnel'] as Role[]).includes(connectedUser.role) && (
        <SidebarItem
          onClick={closeSidebar}
          to={path(siteMap.logged.reportsfiltred.closed)}
          icon={EntityIcon.report}
        >
          {m.menu_closed_report}
        </SidebarItem>
      )}
      {(['Professionnel'] as Role[]).includes(connectedUser.role) && (
        <SidebarItem
          onClick={closeSidebar}
          to={path(siteMap.logged.reportsfiltred.engagements)}
          icon={EntityIcon.checklist}
        >
          {m.menu_engagements_report}
        </SidebarItem>
      )}
      {([...roleAdmins, 'DGCCRF'] as Role[]).includes(connectedUser.role) && (
        <SidebarItem
          onClick={closeSidebar}
          to={path(siteMap.logged.companies.value)}
          icon={EntityIcon.company}
        >
          {m.menu_companies}
        </SidebarItem>
      )}
      {(['Professionnel'] as Role[]).includes(connectedUser.role) && (
        <SidebarItem
          onClick={closeSidebar}
          to={path(siteMap.logged.companiesPro)}
          icon={EntityIcon.company}
        >
          {m.menu_my_companies}
        </SidebarItem>
      )}
      {(['Professionnel'] as Role[]).includes(connectedUser.role) && (
        <SidebarItem
          onClick={closeSidebar}
          to={path(siteMap.logged.usersPro)}
          icon={EntityIcon.user}
        >
          Utilisateurs
        </SidebarItem>
      )}
      {([...roleAdmins] as Role[]).includes(connectedUser.role) && (
        <SidebarItem
          onClick={closeSidebar}
          to={path(siteMap.logged.users.value())}
          icon={EntityIcon.user}
        >
          {m.menu_users}
        </SidebarItem>
      )}
      {([...roleAdmins, ...roleAgents] as Role[]).includes(
        connectedUser.role,
      ) && (
        <SidebarItem
          onClick={closeSidebar}
          to={path(siteMap.logged.subscriptions)}
          icon={EntityIcon.subscription}
        >
          {m.menu_subscriptions}
        </SidebarItem>
      )}
      {([...roleAdmins, ...roleAgents] as Role[]).includes(
        connectedUser.role,
      ) && (
        <SidebarItem
          onClick={closeSidebar}
          to={path(siteMap.logged.stats.value)}
          icon={EntityIcon.stats}
        >
          {m.menu_stats}
        </SidebarItem>
      )}
      <SidebarHr margin />
      {([...roleAdmins, 'DGCCRF'] as Role[]).includes(connectedUser.role) && (
        <SidebarItem
          onClick={closeSidebar}
          to={path(siteMap.logged.reportedWebsites.value)}
          icon={EntityIcon.website}
        >
          {m.menu_websites}
        </SidebarItem>
      )}
      {([...roleAdmins, 'DGCCRF'] as Role[]).includes(connectedUser.role) && (
        <SidebarItem
          onClick={closeSidebar}
          to={path(siteMap.logged.reportedPhone)}
          icon={EntityIcon.phone}
        >
          {m.menu_phones}
        </SidebarItem>
      )}
      <SidebarHr margin />
      {(['SuperAdmin'] as Role[]).includes(connectedUser.role) && (
        <SidebarItem
          onClick={closeSidebar}
          to={path(siteMap.logged.tools.value)}
          icon={EntityIcon.admin}
        >
          {m.menu_admin_tools}
        </SidebarItem>
      )}
      <SidebarHr margin />
      {(['Professionnel'] as Role[]).includes(connectedUser.role) && (
        <SidebarItem
          onClick={closeSidebar}
          to={path(siteMap.logged.joinInformation)}
          icon="info"
        >
          {m.menu_join_informations}
        </SidebarItem>
      )}
      {connectedUser.authProvider == AuthProvider.SignalConso && (
        <SidebarItem
          onClick={closeSidebar}
          to={path(siteMap.logged.settings)}
          icon="settings"
        >
          {m.menu_settings}
        </SidebarItem>
      )}
      {([...roleAdmins, ...roleAgents] as Role[]).includes(
        connectedUser.role,
      ) && (
        <SidebarItem
          onClick={closeSidebar}
          to={path(siteMap.logged.modeEmploiDGCCRF)}
          icon="help"
        >
          {m.menu_modeEmploiDGCCRF}
        </SidebarItem>
      )}
    </Sidebar>
  )
}
