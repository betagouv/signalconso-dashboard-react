import React, {useEffect} from 'react'
import {Panel} from '../../shared/Panel'
import {Datatable} from '../../shared/Datatable/Datatable'
import {useUsersContext} from '../../core/context/UsersContext'
import {useI18n} from '../../core/i18n'
import {Txt} from 'mui-extension/lib/Txt/Txt'

export const UsersListPending = () => {
  const _users = useUsersContext().dgccrfPending
  const {m, formatDate} = useI18n()

  useEffect(() => {
    _users.fetch()()
  }, [])

  return (
    <Panel>
      <Datatable
        getRenderRowKey={_ => _.email}
        loading={_users.loading}
        total={_users.entity?.length}
        data={_users.entity}
        rows={[
          {
            name: 'email',
            head: m.email,
            row: _ => <Txt bold>{_.email}</Txt>
          },
          {
            name: 'tokenCreation',
            head: m.invitationDate,
            row: _ => formatDate(_.tokenCreation)
          },
        ]}
      />
    </Panel>
  )
}
