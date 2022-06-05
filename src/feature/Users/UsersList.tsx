import {Panel} from '../../shared/Panel'
import {Datatable} from '../../shared/Datatable/Datatable'
import {useI18n} from '../../core/i18n'
import React, {useEffect} from 'react'
import {useUsersContext} from '../../core/context/UsersContext'
import {Icon, InputBase, Tooltip} from '@mui/material'
import {useCssUtils} from '../../core/helper/useCssUtils'
import {Txt} from 'mui-extension/lib/Txt/Txt'
import {fromNullable} from 'fp-ts/lib/Option'
import {useToast} from '../../core/toast'
import {DebouncedInput} from '../../shared/DebouncedInput/DebouncedInput'
import {TrueFalseUndefined} from '../../shared/TrueFalseUndefined/TrueFalseUndefined'
import {User} from '@signal-conso/signalconso-api-sdk-js'
import {ScDialog} from '../../shared/Confirm/ScDialog'
import {IconBtn} from 'mui-extension'

export const UsersList = () => {
  const {m, formatDate} = useI18n()
  const _users = useUsersContext().searchDgccrf
  const _validateEmail = useUsersContext().forceValidateEmail
  const cssUtils = useCssUtils()
  const {toastError, toastSuccess} = useToast()

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

            <TrueFalseUndefined
              value={_users.filters.active}
              onChange={_ => _users.updateFilters(prev => ({...prev, active: _}))}
              label={{
                true: m.active,
                false: m.inactive,
                undefined: m.all,
              }}
            />
          </>
        }
        loading={_users.fetching}
        total={_users.list?.totalSize}
        paginate={{
          limit: _users.filters.limit,
          offset: _users.filters.offset,
          onPaginationChange: pagination => _users.updateFilters(prev => ({...prev, ...pagination})),
        }}
        showColumnsToggle
        rowsPerPageOptions={[5, 10, 25, 100, ...(_users.list ? [_users.list.totalSize] : [])]}
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
            head: m.lastValidationDate,
            id: 'lastValidation',
            render: _ => formatDate(_.lastEmailValidation),
          },
          {
            head: (
              <Tooltip title={m.connectedUnder3Months}>
                <span>{m.active}</span>
              </Tooltip>
            ),
            id: 'active',
            render: _ =>
              (<ScDialog
                title={m.activateUser(_.email)}
                onConfirm={(event, close) =>
                  _validateEmail.fetch({}, _.email)
                    .then(_ => _users.fetch())
                    .then(_ => close())
                    .then(_ => toastSuccess(m.userValidationDone))}
                maxWidth="xs"
              >
                {User.isUserActive(_) ? (<Tooltip title={m.extendValidation}>
                  <IconBtn>
                    <Icon className={cssUtils.colorSuccess}>check_circle</Icon>
                  </IconBtn>
                </Tooltip>)
                  :
                  <Tooltip title={m.validate}>
                  <IconBtn>
                    <Icon>task_alt</Icon>
                  </IconBtn>
                  </Tooltip>}
              </ScDialog>)
          },
        ]}
      />
    </Panel>
  )
}
