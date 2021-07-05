import {Page, PageTitle} from '../../shared/Layout'
import {useI18n} from '../../core/i18n'
import React from 'react'
import {Panel} from '../../shared/Panel'

export const Users = () => {
  const {m} = useI18n()
  return (
    <Page>
      <PageTitle>{m.menu_users}</PageTitle>
      <Panel>

      </Panel>
    </Page>
  )
}
