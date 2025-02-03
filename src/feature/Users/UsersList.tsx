import { Icon, Tooltip } from '@mui/material'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useCallback } from 'react'
import { NavLink } from 'react-router-dom'
import { ScInput } from 'shared/ScInput'
import { IconBtn, Txt } from '../../alexlibs/mui-extension'
import {
  AuthProvider,
  isUserActive,
  roleAgents,
  RoleAgents,
  User,
} from '../../core/client/user/User'
import { useI18n } from '../../core/i18n'
import {
  SearchAdminQueryKeys,
  SearchAgentQueryKeys,
  useSearchAdminQuery,
  useSearchAgentQuery,
} from '../../core/queryhooks/userQueryHooks'
import { siteMap } from '../../core/siteMap'
import { useToast } from '../../core/context/toastContext'
import {
  Datatable,
  DatatableColumnProps,
} from '../../shared/Datatable/Datatable'
import { DebouncedInput } from '../../shared/DebouncedInput'
import { ScDialog } from '../../shared/ScDialog'
import { SelectRoleAgent } from '../../shared/SelectRoleAgent'
import { TrueFalseUndefined } from '../../shared/TrueFalseUndefined'
import { UserAdminInvitationDialog } from './UserAdminInvitationDialog'
import { UserAgentInvitationDialog } from './UserAgentInvitationDialog'
import { UserAgentsImportDialog } from './UserAgentsImportDialog'
import { UserDeleteButton } from './userDelete'
import { useConnectedContext } from '../../core/context/ConnectedContext'
import { useNavigate } from 'react-router'

export const AdminUsersList = () => <UsersList adminView />
export const AgentUsersList = () => <UsersList />

interface Props {
  adminView?: boolean
}

const UsersList = ({ adminView }: Props) => {
  const { m, formatDate } = useI18n()
  const { setConnectedUser, api } = useConnectedContext()
  const navigate = useNavigate()
  const queryClient = useQueryClient()
  const { toastSuccess } = useToast()
  const _admins = useSearchAdminQuery(!!adminView)
  const _agents = useSearchAgentQuery(!adminView)
  const _users = adminView ? _admins : _agents
  const invalidate = () => {
    if (adminView) {
      return queryClient.invalidateQueries({ queryKey: SearchAdminQueryKeys })
    } else {
      return queryClient.invalidateQueries({ queryKey: SearchAgentQueryKeys })
    }
  }
  const _validateEmail = useMutation({
    mutationFn: api.secured.user.forceValidateEmail,
    onSuccess: () => {
      toastSuccess(m.userValidationDone)
      return invalidate()
    },
  })

  const _logAs = useMutation({
    mutationFn: (email: string) => api.public.authenticate.logAs(email),
    onSuccess: (user) => {
      setConnectedUser(user)
      navigate('/')
    },
  })

  const extraColumnsForDgccrf: DatatableColumnProps<User>[] = [
    {
      head: m.lastValidationDate,
      id: 'lastValidation',
      render: (_) => formatDate(_.lastEmailValidation),
    },
    {
      head: (
        <Tooltip title={m.connectedUnder3Months}>
          <span>{m.active}</span>
        </Tooltip>
      ),
      id: 'active',
      render: (_) =>
        _.authProvider === AuthProvider.SignalConso ? (
          <ScDialog
            title={m.activateUser(_.email)}
            onConfirm={(event, close) =>
              _validateEmail.mutateAsync(_.email).then((_) => close())
            }
            maxWidth="xs"
          >
            {isUserActive(_) ? (
              <Tooltip title={m.extendValidation}>
                <IconBtn>
                  <Icon sx={{ color: (t) => t.palette.success.light }}>
                    check_circle
                  </Icon>
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
        ) : (
          <Tooltip title={m.active}>
            <Icon sx={{ color: (t) => t.palette.success.light }}>
              check_circle
            </Icon>
          </Tooltip>
        ),
    },
  ]

  const columns: DatatableColumnProps<User>[] = [
    {
      id: '',
      head: m.email,
      render: (_) => (
        <Txt bold>
          <Icon sx={{ mb: -0.5, mr: 1, color: (t) => t.palette.primary.main }}>
            {adminView ? 'local_police' : 'badge'}
          </Icon>
          {_.email}
        </Txt>
      ),
    },
    {
      head: m.firstName,
      id: 'firstName',
      render: (_) => _.firstName,
    },
    {
      head: m.lastName,
      id: 'lastName',
      render: (_) => _.lastName,
    },
    {
      head: 'Type',
      id: 'type',
      render: (_) => `${_.role} (${_.authProvider})`,
    },
    ...(adminView ? [] : extraColumnsForDgccrf),
    {
      id: 'authAttemptsHistory',
      sx: (_) => ({ ml: 0, pl: 0, mr: 0, pr: 0 }),
      render: (_) => (
        <>
          {!adminView && _.id && (
            <Tooltip title={m.authAttemptsHistory}>
              <NavLink
                to={
                  siteMap.logged.users.value +
                  '/' +
                  siteMap.logged.users.auth_attempts.value(_.email)
                }
              >
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
      id: 'impersonator',
      sx: (_) => ({ ml: 0, pl: 0, mr: 0, pr: 0 }),
      render: (_) => (
        <>
          {!adminView && _.email && (
            <Tooltip title="Se connecter en tant que">
              <IconBtn color="primary" onClick={() => _logAs.mutate(_.email)}>
                <Icon>theater_comedy</Icon>
              </IconBtn>
            </Tooltip>
          )}
        </>
      ),
    },
    {
      id: 'delete',
      render: (_) => <UserDeleteButton userId={_.id} onDelete={invalidate} />,
    },
  ]

  const onEmailChange = useCallback((email: string) => {
    _users.updateFilters((prev) => ({ ...prev, email }))
    // TRELLO-1391 The object _users change all the time.
    // If we put it in dependencies, it causes problems with the debounce,
    // and the search input "stutters" when typing fast
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const parsedRole: RoleAgents[] =
    _users.filters.role ?? roleAgents.map((_) => _)

  return (
    <>
      <div className="flex justify-between items-baseline gap-2 mb-6">
        <div>
          {adminView ? (
            <>
              <p>Cette page liste des utilisateurs "Admin".</p>
              <p className="px-1 bg-orange-200 block italic text-orange-900">
                Attention ceux-ci ont tous les droits, ils peuvent
                potentiellement causer des dégâts, ce n'est pas pour n'importe
                qui !
              </p>
            </>
          ) : (
            <p>
              Cette page liste les utilisateurs de type "agent".{' '}
              <span className="italic text-gray-500">
                Ce sont les agents de la DGCCRF ou de la DGAL.
              </span>
            </p>
          )}
        </div>
        <div className="flex gap-2">
          {adminView ? (
            <UserAdminInvitationDialog />
          ) : (
            <>
              <UserAgentInvitationDialog />
              <UserAgentsImportDialog />
            </>
          )}
        </div>
      </div>
      <Datatable
        id="userslist"
        headerMain={
          <>
            <DebouncedInput
              value={_users.filters.email ?? ''}
              onChange={onEmailChange}
            >
              {(value, onChange) => (
                <ScInput
                  value={value}
                  placeholder={m.searchByEmail + '...'}
                  fullWidth
                  onChange={(e) => onChange(e.target.value)}
                />
              )}
            </DebouncedInput>
          </>
        }
        headerMarginBottom
        actions={
          <>
            <>
              {!adminView && (
                <SelectRoleAgent
                  value={parsedRole}
                  onChange={(_) =>
                    _users.updateFilters((prev) => ({ ...prev, role: _ }))
                  }
                />
              )}
            </>
            <>
              <TrueFalseUndefined
                value={_users.filters.active}
                onChange={(_) =>
                  _users.updateFilters((prev) => ({ ...prev, active: _ }))
                }
                label={{
                  true: m.active,
                  false: m.inactive,
                  undefined: m.all,
                }}
              />
            </>
          </>
        }
        loading={_users.result.isFetching}
        total={_users.result.data?.totalCount}
        paginate={{
          limit: _users.filters.limit,
          offset: _users.filters.offset,
          onPaginationChange: (pagination) =>
            _users.updateFilters((prev) => ({ ...prev, ...pagination })),
        }}
        showColumnsToggle
        rowsPerPageExtraOptions={
          _users.result.data ? [_users.result.data.totalCount] : undefined
        }
        getRenderRowKey={(_) => _.email}
        data={_users.result.data?.entities}
        columns={columns}
      />
    </>
  )
}
