import {Page, PageTitle} from '../../shared/Layout'
import React, {useEffect} from 'react'
import {useI18n} from '../../core/i18n'
import {Panel} from '../../shared/Panel'
import {SettingRow} from './SettingRow'
import {EditPassword} from './EditPassword'
import {NavLink} from 'react-router-dom'
import {siteMap} from '../../core/siteMap'
import {Icon, Switch, Tooltip} from '@material-ui/core'
import {useUsersContext} from '../../core/context/UsersContext'
import {IconBtn} from 'mui-extension/lib'

export const Settings = () => {
  const {m} = useI18n()

  const _user = useUsersContext()

  useEffect(() => {
    _user.getConnectedUser.fetch()
  }, [])

  return (
    <Page size="small">
      <PageTitle>{m.menu_settings}</PageTitle>
      <Panel>
        <SettingRow icon="vpn_key" title={m.password} description={m.editPasswordDesc}>
          <EditPassword />
        </SettingRow>
        <SettingRow icon="notifications" title={m.notifications} description={m.notificationSettings}>
          <NavLink to={siteMap.companiesPro}>
            <Tooltip title={m.notificationSettingsCustom}>
              <IconBtn color="primary">
                <Icon>tune</Icon>
              </IconBtn>
            </Tooltip>
          </NavLink>
          <Switch
            checked={!_user.getConnectedUser.entity?.disableAllNotifications ?? true}
            onChange={e => _user.patchConnectedUser.fetch({}, !e.target.checked).then(_ => _user.getConnectedUser.fetch())}
          />
        </SettingRow>
      </Panel>
    </Page>
  )
}
