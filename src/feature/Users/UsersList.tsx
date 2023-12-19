import {Icon, InputBase, Tooltip} from '@mui/material'
import React, {useCallback} from 'react'
import {IconBtn, Txt} from '../../alexlibs/mui-extension'
import {useI18n} from '../../core/i18n'
import {Datatable, DatatableColumnProps} from '../../shared/Datatable/Datatable'
import {Panel, PanelHead} from '../../shared/Panel'
import {isUserActive, RoleAgents, roleAgents, User} from '../../core/client/user/User'
import {useToast} from '../../core/toast'
import {ScDialog} from '../../shared/ScDialog'
import {DebouncedInput} from '../../shared/DebouncedInput'
import {TrueFalseUndefined} from '../../shared/TrueFalseUndefined'
import {UserAgentInvitationDialog} from './UserAgentInvitationDialog'
import {UserDeleteButton} from './UserDeleteButton'
import {SelectRoleAgent} from '../../shared/SelectRoleAgent'
import {UserAdminInvitationDialog} from './UserAdminInvitationDialog'
import {UserAgentsImportDialog} from './UserAgentsImportDialog'
import {NavLink} from 'react-router-dom'
import {siteMap} from '../../core/siteMap'
import {
  SearchAdminQueryKeys,
  SearchAgentQueryKeys,
  useSearchAdminQuery,
  useSearchAgentQuery,
} from '../../core/queryhooks/userQueryHooks'
import {useMutation, useQueryClient} from '@tanstack/react-query'
import {useApiContext} from '../../core/context/ApiContext'

export const AdminUsersList = () => <UsersList adminView />
export const AgentUsersList = () => <UsersList />

interface Props {
  adminView?: boolean
}

const UsersList = ({adminView}: Props) => {
  const {m, formatDate} = useI18n()
  const {api} = useApiContext()
  const queryClient = useQueryClient()
  const {toastSuccess} = useToast()
  const _admins = useSearchAdminQuery({enabled: !!adminView})
  const _agents = useSearchAgentQuery({enabled: !adminView})
  const _users = adminView ? _admins : _agents
  const invalidate = () => {
    if (adminView) {
      return queryClient.invalidateQueries({queryKey: SearchAdminQueryKeys})
    } else {
      return queryClient.invalidateQueries({queryKey: SearchAgentQueryKeys})
    }
  }
  const _validateEmail = useMutation({
    mutationFn: api.secured.user.forceValidateEmail,
    onSuccess: () => {
      toastSuccess(m.userValidationDone)
      return invalidate()
    },
  })

  const extraColumnsForDgccrf: DatatableColumnProps<User>[] = [
    {
      head: 'Type',
      id: 'type',
      render: _ => _.role,
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
          onConfirm={(event, close) => _validateEmail.mutateAsync(_.email).then(_ => close())}
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
          <Icon sx={{mb: -0.5, mr: 1, color: t => t.palette.primary.main}}>{adminView ? 'local_police' : 'badge'}</Icon>
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
    ...(adminView ? [] : extraColumnsForDgccrf),
    {
      id: 'authAttemptsHistory',
      sx: _ => ({ml: 0, pl: 0, mr: 0, pr: 0}),
      render: _ => (
        <>
          {!adminView && _.id && (
            <Tooltip title={m.authAttemptsHistory}>
              <NavLink to={siteMap.logged.users_auth_attempts(_.email)}>
                <IconBtn color="primary">
                  <Icon>history</Icon>
                </IconBtn>
              </NavLink>
            </Tooltip>
          )}
        </>
      ),
    },
    {
      id: 'delete',
      render: _ => <UserDeleteButton userId={_.id} onDelete={invalidate} />,
    },
  ]

  const onEmailChange = useCallback((email: string) => {
    _users.updateFilters(prev => ({...prev, email}))
    // TRELLO-1391 The object _users change all the time.
    // If we put it in dependencies, it causes problems with the debounce,
    // and the search input "stutters" when typing fast
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const parsedRole = (_users.filters.role ?? roleAgents) as RoleAgents[]

  return (
    <>
      <Panel elevation={3}>
        <PanelHead sx={{pb: 2}} bottomDivider={true}>
          {adminView ? (
            <UserAdminInvitationDialog />
          ) : (
            <div className="flex justify-between">
              <UserAgentInvitationDialog />
              <UserAgentsImportDialog />
            </div>
          )}
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

              {!adminView && (
                <SelectRoleAgent
                  sx={{mr: 2}}
                  value={parsedRole}
                  onChange={_ => _users.updateFilters(prev => ({...prev, role: _}))}
                />
              )}

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
          loading={_users.result.isFetching}
          total={_users.result.data?.totalCount}
          paginate={{
            limit: _users.filters.limit,
            offset: _users.filters.offset,
            onPaginationChange: pagination => _users.updateFilters(prev => ({...prev, ...pagination})),
          }}
          showColumnsToggle
          rowsPerPageOptions={[5, 10, 25, 100, ...(_users.result.data ? [_users.result.data.totalCount] : [])]}
          getRenderRowKey={_ => _.email}
          data={_users.result.data?.entities}
          columns={columns}
        />
      </Panel>
    </>
  )
}
