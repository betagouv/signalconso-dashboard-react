import {Page, PageTitle} from '../../shared/Layout'
import React from 'react'
import {useI18n} from '../../core/i18n'
import {Panel} from '../../shared/Panel'
import {SettingRow} from './SettingRow'
import {EditPassword} from './EditPassword'

export const Settings = () => {
  const {m} = useI18n()

  return (
    <Page size="small">
      <PageTitle>{m.menu_settings}</PageTitle>
      <Panel>
        <SettingRow
          icon="vpn_key"
          title={m.password}
          description={m.editPasswordDesc}
        >
          <EditPassword/>
        </SettingRow>
      </Panel>
    </Page>
  )
}
