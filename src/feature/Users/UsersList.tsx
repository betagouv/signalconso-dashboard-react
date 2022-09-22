import {Icon, InputBase, Tooltip} from '@mui/material'
import {useEffect} from 'react'
import {Txt} from '../../alexlibs/mui-extension'
import {useUsersContext} from '../../core/context/UsersContext'
import {useI18n} from '../../core/i18n'
import {Datatable} from '../../shared/Datatable/Datatable'
import {Panel} from '../../shared/Panel'

import {ScOption} from 'core/helper/ScOption'
import {IconBtn} from '../../alexlibs/mui-extension'
import {isUserActive, RoleAdminOrDggcrf} from '../../core/client/user/User'
import {useToast} from '../../core/toast'
import {ScDialog} from '../../shared/Confirm/ScDialog'
import {DebouncedInput} from '../../shared/DebouncedInput/DebouncedInput'
import {TrueFalseUndefined} from '../../shared/TrueFalseUndefined/TrueFalseUndefined'

export const AdminUsersList = () => <UsersList role="Admin" />
export const DgccrfUsersList = () => <UsersList role="DGCCRF" />

interface Props {
  role: RoleAdminOrDggcrf
}

const UsersList = ({role}: Props) => {
  const {m, formatDate} = useI18n()
  const usersContext = useUsersContext()
  const _users = role === 'Admin' ? usersContext.searchAdmin : usersContext.searchDgccrf
  const _validateEmail = usersContext.forceValidateEmail
  const {toastError, toastSuccess} = useToast()

  useEffect(() => {
    _users.fetch()
  }, [])

  useEffect(() => {
    ScOption.from(_users.error).map(toastError)
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
                  sx={{ml: 1}}
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
        total={_users.list?.totalCount}
        paginate={{
          limit: _users.filters.limit,
          offset: _users.filters.offset,
          onPaginationChange: pagination => _users.updateFilters(prev => ({...prev, ...pagination})),
        }}
        showColumnsToggle
        rowsPerPageOptions={[5, 10, 25, 100, ...(_users.list ? [_users.list.totalCount] : [])]}
        getRenderRowKey={_ => _.email}
        data={_users.list?.entities}
        columns={[
          {
            id: '',
            head: m.email,
            render: _ => (
              <Txt bold>
                <Icon sx={{mb: -0.5, mr: 1, color: t => t.palette.primary.main}}>
                  {role === 'Admin' ? 'local_police' : 'badge'}
                </Icon>
                {_.email}
              </Txt>
            ),
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
            render: _ => (
              <ScDialog
                title={m.activateUser(_.email)}
                onConfirm={(event, close) =>
                  _validateEmail
                    .fetch({}, _.email)
                    .then(_ => _users.fetch())
                    .then(_ => close())
                    .then(_ => toastSuccess(m.userValidationDone))
                }
                maxWidth="xs"
              >
                {isUserActive(_) ? (
                  <Tooltip title={m.extendValidation}>
                    <IconBtn>
                      <Icon sx={{color: t => t.palette.success.light}}>check_circle</Icon>
                    </IconBtn>
                  </Tooltip>
                ) : (
                  <Tooltip title={m.validate}>
                    <IconBtn>
                      <Icon>task_alt</Icon>
                    </IconBtn>
                  </Tooltip>
                )}
              </ScDialog>
            ),
          },
        ]}
      />
    </Panel>
  )
}
