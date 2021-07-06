import {Panel} from '../../shared/Panel'
import {Datatable} from '../../shared/Datatable/Datatable'
import {User} from '../../core/api'
import {useI18n} from '../../core/i18n'
import React, {useEffect} from 'react'
import {useUsersContext} from '../../core/context/UsersContext'
import {subMonths} from 'date-fns'
import {Icon, Tooltip} from '@material-ui/core'
import {useCssUtils} from '../../core/helper/useCssUtils'
import {Txt} from 'mui-extension/lib/Txt/Txt'
import {fromNullable} from 'fp-ts/lib/Option'
import {useToast} from '../../core/toast'

export const UsersList = () => {
  const {m} = useI18n()
  const _users = useUsersContext().dgccrf
  const cssUtils = useCssUtils()
  const {toastError} = useToast()

  useEffect(() => {
    _users.fetch()
  }, [])

  useEffect(() => {
    fromNullable(_users.error).map(toastError)
  }, [_users.error])

  return (
    <Panel>
      <Datatable<User>
        loading={_users.fetching}
        total={_users.list?.totalSize}
        paginate={{
          limit: _users.filters.limit,
          offset: _users.filters.offset,
          onPaginationChange: pagination => _users.updateFilters(prev => ({...prev, ...pagination})),
        }}
        getRenderRowKey={_ => _.email}
        data={_users.list?.data}
        rows={[
          {
            id: '',
            head: m.email,
            row: _ => <Txt bold>{_.email}</Txt>
          },
          {
            head: m.firstName,
            id: 'firstName',
            row: _ => _.firstName
          },
          {
            head: m.lastName,
            id: 'lastName',
            row: _ => _.lastName
          },
          {
            head: <Tooltip title={m.connectedUnder3Months}><span>{m.active}</span></Tooltip>,
            id: 'lastEmailValidation',
            row: _ => _.lastEmailValidation.getTime() > subMonths(new Date, 3).getTime() && (
              <Icon className={cssUtils.colorSuccess}>check_circle</Icon>
            )
          }
        ]}/>
    </Panel>
  )
}
