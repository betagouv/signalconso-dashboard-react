import {Route} from 'react-router-dom'
import {useI18n} from '../../core/i18n'
import {siteMap} from '../../core/siteMap'
import {Page, PageTitle} from '../../shared/Page'
import {PageTab, PageTabs} from '../../shared/Page/PageTabs'
import {ConsumerBlacklist} from './ConsumerBlacklist'
import {ConsumerListPending} from './ConsumerListPending'
import {AdminUsersList, AgentUsersList} from './UsersList'
import {UsersListPending} from './UsersListPending'
import {UserAuthAttempts} from './UserAuthAttempts'
import {Navigate, Routes} from 'react-router'

export const Users = () => {
  const {m} = useI18n() // Assuming this hook exists and provides translations

  return (
    <Page>
      <PageTitle>{m.menu_users}</PageTitle>
      <PageTabs>
        <PageTab to={siteMap.logged.users_agent} label={m.agentUsers} />
        <PageTab to={siteMap.logged.users_agent_pending} label={m.agentUsersPending} />
        <PageTab to={siteMap.logged.users_admin} label={m.adminUsers} />
        <PageTab to={siteMap.logged.users_consumer_validation} label={m.consumersPending} />
        <PageTab to={siteMap.logged.users_auth_attempts()} label={m.authAttempts} />
        <PageTab to={siteMap.logged.users_blacklist} label={m.blacklistedConsumers} />
      </PageTabs>
      <Routes>
        <Route path="/" element={<Navigate replace to={siteMap.logged.users_agent} />} />
        <Route path={siteMap.logged.users_agent} element={<AgentUsersList />} />
        <Route path={siteMap.logged.users_auth_attempts()} element={<UserAuthAttempts />} />
        <Route path={siteMap.logged.users_agent_pending} element={<UsersListPending />} />
        <Route path={siteMap.logged.users_admin} element={<AdminUsersList />} />
        <Route path={siteMap.logged.users_consumer_validation} element={<ConsumerListPending />} />
        <Route path={siteMap.logged.users_blacklist} element={<ConsumerBlacklist />} />
      </Routes>
    </Page>
  )
}
