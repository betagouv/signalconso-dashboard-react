import {Page, PageTitle} from '../../shared/Layout'
import React from 'react'
import {useI18n} from '../../core/i18n'
import {Panel} from '../../shared/Panel'
import {SettingRow} from './SettingRow'
import {EditPassword} from './EditPassword'
import {NavLink} from "react-router-dom";
import {siteMap} from "../../core/siteMap";
import {Tooltip} from "@material-ui/core";
import {ScButton} from "../../shared/Button/Button";

export const Settings = () => {
  const {m} = useI18n()

  return (
    <Page size="small">
      <PageTitle>{m.menu_settings}</PageTitle>
      <Panel>
        <SettingRow icon="vpn_key" title={m.password} description={m.editPasswordDesc}>
          <EditPassword />
        </SettingRow>
          <SettingRow icon="notifications" title="Notifications" description={m.editPasswordDesc}>
              <NavLink to={siteMap.settings_notifications}>
                  <Tooltip title={m.handleAccesses}>
                      <ScButton icon="edit" color="primary">
                          {m.edit}
                      </ScButton>
                  </Tooltip>
              </NavLink>
          </SettingRow>
      </Panel>
    </Page>
  )
}
