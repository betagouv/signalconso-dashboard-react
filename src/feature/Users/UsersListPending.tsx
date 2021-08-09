import React, {useEffect} from 'react'
import {Panel} from '../../shared/Panel'
import {Datatable} from '../../shared/Datatable/Datatable'
import {useUsersContext} from '../../core/context/UsersContext'
import {useI18n} from '../../core/i18n'
import {Txt} from 'mui-extension/lib/Txt/Txt'
import {fromNullable} from 'fp-ts/lib/Option'
import {useToast} from '../../core/toast'

export const UsersListPending = () => {
  const _users = useUsersContext().dgccrfPending
  const {m, formatDate} = useI18n()
  const {toastError} = useToast()

  useEffect(() => {
    _users.fetch()
  }, [])

  useEffect(() => {
    fromNullable(_users.error).map(toastError)
  }, [_users.error])

  return (
    <Panel>
      <Datatable
        loading={_users.loading}
        total={_users.entity?.length}
        data={_users.entity}
        rows={[
          {
            id: 'email',
            head: m.email,
            row: _ => <Txt bold>{_.email}</Txt>,
          },
          {
            id: 'tokenCreation',
            head: m.invitationDate,
            row: _ => formatDate(_.tokenCreation),
          },
        ]}
      />
    </Panel>
  )
}
