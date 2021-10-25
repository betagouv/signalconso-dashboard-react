import {Panel} from '../../shared/Panel'
import {Datatable} from '../../shared/Datatable/Datatable'
import {User} from '@signal-conso/signalconso-api-sdk-js'
import {useI18n} from '../../core/i18n'
import React, {useEffect} from 'react'
import {useUsersContext} from '../../core/context/UsersContext'
import {subMonths} from 'date-fns'
import {Icon, InputBase, Tooltip} from '@mui/material'
import {useCssUtils} from '../../core/helper/useCssUtils'
import {Txt} from 'mui-extension/lib/Txt/Txt'
import {fromNullable} from 'fp-ts/lib/Option'
import {useToast} from '../../core/toast'
import {DebouncedInput} from '../../shared/DebouncedInput/DebouncedInput'

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
      <Datatable
        id="userslist"
        header={
          <>
            <DebouncedInput
              value={_users.filters.email ?? ''}
              onChange={email => _users.updateFilters(prev => ({...prev, email}))}
            >
              {(value, onChange) => (
                <InputBase
                  value={value}
                  placeholder={m.searchByEmail + '...'}
                  fullWidth
                  className={cssUtils.marginLeft}
                  onChange={e => onChange(e.target.value)}
                />
              )}
            </DebouncedInput>
          </>
        }
        loading={_users.fetching}
        total={_users.list?.totalSize}
        paginate={{
          limit: _users.filters.limit,
          offset: _users.filters.offset,
          onPaginationChange: pagination => _users.updateFilters(prev => ({...prev, ...pagination})),
        }}
        getRenderRowKey={_ => _.email}
        data={_users.list?.data}
        columns={[
          {
            id: '',
            head: m.email,
            render: _ => <Txt bold>{_.email}</Txt>,
          },
          {
            head: m.firstName,
            id: 'firstName',
            render: _ => _.firstName,
          },
          {
            head: m.lastName,
            id: 'lastName',
            render: _ => _.lastName,
          },
          {
            head: (
              <Tooltip title={m.connectedUnder3Months}>
                <span>{m.active}</span>
              </Tooltip>
            ),
            id: 'lastEmailValidation',
            render: _ =>
              _.lastEmailValidation.getTime() > subMonths(new Date(), 3).getTime() && (
                <Icon className={cssUtils.colorSuccess}>check_circle</Icon>
              ),
          },
        ]}
      />
    </Panel>
  )
}
