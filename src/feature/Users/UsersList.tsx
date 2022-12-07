import {Icon, InputBase, Tooltip} from '@mui/material'
import {useCallback, useEffect} from 'react'
import {Btn, Txt} from '../../alexlibs/mui-extension'
import {useUsersContext} from '../../core/context/UsersContext'
import {useI18n} from '../../core/i18n'
import {Datatable, DatatableColumnProps} from '../../shared/Datatable/Datatable'
import {Panel, PanelHead} from '../../shared/Panel'

import {ScOption} from 'core/helper/ScOption'
import {IconBtn} from '../../alexlibs/mui-extension'
import {isUserActive, RoleAdminOrDggcrf, User} from '../../core/client/user/User'
import {useToast} from '../../core/toast'
import {ScDialog} from '../../shared/Confirm/ScDialog'
import {DebouncedInput} from '../../shared/DebouncedInput/DebouncedInput'
import {TrueFalseUndefined} from '../../shared/TrueFalseUndefined/TrueFalseUndefined'
import {UserInvitationDialog} from './UserInvitationDialog'
import {UserDeleteButton} from './UserDeleteButton'

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

  const extraColumnsForDgccrf: DatatableColumnProps<User>[] = [
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
  ]

  const columns: DatatableColumnProps<User>[] = [
    {
      id: '',
      head: m.email,
      render: _ => (
        <Txt bold>
          <Icon sx={{mb: -0.5, mr: 1, color: t => t.palette.primary.main}}>{role === 'Admin' ? 'local_police' : 'badge'}</Icon>
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
    ...(role === 'Admin' ? [] : extraColumnsForDgccrf),
    {
      id: 'delete',
      render: _ => <UserDeleteButton userId={_.id} onDelete={_users.fetch} />,
    },
  ]

  const onEmailChange = useCallback((email: string) => {
    _users.updateFilters(prev => ({...prev, email}))
    // TRELLO-1391 The object _users change all the time.
    // If we put it in dependencies, it causes problems with the debounce,
    // and the search input "stutters" when typing fast
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <>
      <Panel elevation={3}>
        <PanelHead sx={{pb: 2}} bottomDivider={true}>
          <UserInvitationDialog role={role} />
        </PanelHead>
        <Datatable
          id="userslist"
          header={
            <>
              <DebouncedInput value={_users.filters.email ?? ''} onChange={onEmailChange}>
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
          columns={columns}
        />
      </Panel>
    </>
  )
}
