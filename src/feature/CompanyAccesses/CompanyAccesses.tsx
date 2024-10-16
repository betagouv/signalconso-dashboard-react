import {
  Icon,
  ListItemIcon,
  ListItemText,
  MenuItem,
  Tooltip,
} from '@mui/material'
import { UserDeleteDialog } from 'feature/Users/userDelete'
import { NavLink } from 'react-router-dom'
import { ScMenu } from 'shared/Menu'
import { CompanyAccessLevel } from '../../core/client/company-access/CompanyAccess'
import { useConnectedContext } from '../../core/context/ConnectedContext'
import { useToast } from '../../core/context/toastContext'
import {
  isDefined,
  objectKeysUnsafe,
  siretToSiren,
  toQueryString,
} from '../../core/helper'
import { useI18n } from '../../core/i18n'
import { CompanyWithReportsCount, Id, User } from '../../core/model'
import { siteMap } from '../../core/siteMap'
import { sxUtils } from '../../core/theme'
import { ScButton } from '../../shared/Button'
import {
  Datatable,
  DatatableColumnProps,
} from '../../shared/Datatable/Datatable'
import { ScRadioGroup } from '../../shared/RadioGroup'

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { useNavigate } from 'react-router'
import { ScRadioGroupItem } from '../../shared/RadioGroupItem'
import { ScDialog } from '../../shared/ScDialog'
import { CompanyAccessCreateBtn } from './CompanyAccessCreateBtn'

interface Accesses {
  name?: string
  userId?: Id
  email?: string
  level: CompanyAccessLevel
  tokenId?: Id
  token?: string
  editable?: Boolean
  isHeadOffice?: Boolean
}

type Column = DatatableColumnProps<Accesses>

export function CompanyAccesses({
  company,
}: {
  company: CompanyWithReportsCount | undefined
}) {
  if (!company) {
    return null
  }
  return <CompanyAccessesLoaded company={company} />
}

function CompanyAccessesLoaded({
  company,
}: {
  company: CompanyWithReportsCount
}) {
  const siret = company.siret
  const api = useConnectedContext().api
  const queryClient = useQueryClient()
  const { toastSuccess, toastError } = useToast()

  const accessesQueryKey = ['getCompanyAccesses', siret]
  const tokensQueryKey = ['getCompanyAccessTokens', siret]
  const _accesses = useQuery({
    queryKey: accessesQueryKey,
    queryFn: () => api.secured.companyAccess.fetch(siret),
  })
  const _tokens = useQuery({
    queryKey: tokensQueryKey,
    queryFn: () => api.secured.companyAccessToken.fetch(siret),
  })
  function invalidateQueries() {
    queryClient.invalidateQueries({
      queryKey: accessesQueryKey,
    })
    queryClient.invalidateQueries({
      queryKey: tokensQueryKey,
    })
  }

  const _sendInvitation = useMutation({
    mutationFn: (params: {
      siret: string
      level: CompanyAccessLevel
      email: string
    }) =>
      api.secured.companyAccessToken.create(
        params.siret,
        params.email,
        params.level,
      ),
    onSuccess: () => {
      toastSuccess(m.userInvitationSent)
      invalidateQueries()
    },
    onError: toastError,
  })

  const { m } = useI18n()
  const { connectedUser } = useConnectedContext()

  const data: Accesses[] = [
    ...(_accesses.data ?? []).map((_) => ({
      email: _.email,
      name: User.buildFullName(_),
      level: _.level,
      userId: _.userId,
      editable: _.editable,
      isHeadOffice: _.isHeadOffice,
    })),
    ...(_tokens.data ?? []).map((_) => ({
      email: _.emailedTo,
      level: _.level,
      tokenId: _.id,
      token: _.token,
    })),
  ]

  async function inviteNewUser(
    email: string,
    level: CompanyAccessLevel,
  ): Promise<void> {
    if (data.find((_) => _.email === email)) {
      toastError({ message: m.invitationToProAlreadySent(email) })
    } else {
      await _sendInvitation.mutateAsync({ email, level, siret })
    }
  }

  const isAdmin = connectedUser.isAdmin
  const isPro = connectedUser.isPro

  const emailColumn: Column = {
    id: 'email',
    head: m.email,
    render: (accesses) => <EmailColumn accesses={accesses} />,
  }

  const levelColumn: Column = {
    id: 'level',
    head: m.companyAccessLevel,
    render: (accesses) => (
      <LevelColumn {...{ siret, accesses, invalidateQueries }} />
    ),
  }

  const actionsColumn: Column = {
    id: 'action',
    sx: (_) => sxUtils.tdActions,
    render: (accesses) => (
      <ActionsColumn
        {...{ accesses, siret, invalidateQueries }}
        onResendCompanyAccessToken={(email: string) => {
          return _sendInvitation.mutateAsync({
            email,
            level: accesses.level,
            siret,
          })
        }}
      />
    ),
  }

  return (
    <>
      <div className="flex justify-between gap-2 sm:gap-6 sm:items-start mb-4 flex-col sm:flex-row">
        <div className="flex flex-col gap-2">
          <p>
            Les personnes suivantes peuvent consulter et répondre aux
            signalements de l'établissement {company.siret}.
          </p>

          {company.isHeadOffice && (
            <p className="">
              Comme c'est un <strong>siège social</strong>, ils auront aussi
              accès aux signalements de tous les établissements qui y sont
              rattachés (i.e. dont le SIRET commence par{' '}
              {siretToSiren(company.siret)}).
            </p>
          )}
        </div>

        <div className="flex gap-2 shrink-0">
          {(isAdmin || isPro) && (
            <CompanyAccessCreateBtn
              loading={_sendInvitation.isPending}
              onCreate={inviteNewUser}
            />
          )}
        </div>
      </div>
      <>
        <Datatable
          id="companyaccesses"
          data={data}
          loading={_accesses.isLoading || _tokens.isLoading}
          getRenderRowKey={(_) => _.email ?? _.tokenId!}
          columns={[emailColumn, levelColumn, actionsColumn]}
        />
      </>
    </>
  )
}

function EmailColumn({ accesses: _ }: { accesses: Accesses }) {
  const { m } = useI18n()
  const { connectedUser } = useConnectedContext()
  const pending = !_.name
  const isCurrentUser = connectedUser.email === _.email
  return (
    <>
      <div>
        <span className={`font-bold ${pending ? 'text-gray-500' : ''}`}>
          {_.email}
        </span>
        {isCurrentUser && <span className="text-gray-500"> ({m.you})</span>}
        {_.isHeadOffice && (
          <span className="text-gray-500"> (via le siège social)</span>
        )}
      </div>
      {pending ? (
        <span className="text-blue-600 font-bold uppercase">
          Invitation envoyée
        </span>
      ) : (
        <span className="text-gray-500">{_.name}</span>
      )}
    </>
  )
}

function LevelColumn({
  accesses: _,
  siret,
  invalidateQueries,
}: {
  accesses: Accesses
  siret: string
  invalidateQueries: () => void
}) {
  const { m } = useI18n()
  const api = useConnectedContext().api
  const { toastError } = useToast()
  const _updateAccessLevel = useMutation({
    mutationFn: (params: {
      siret: string
      level: CompanyAccessLevel
      userId: string
    }) =>
      api.secured.companyAccess.update(
        params.siret,
        params.userId,
        params.level,
      ),
    onSuccess: () => {
      invalidateQueries()
    },
    onError: toastError,
  })
  return (
    <ScDialog
      maxWidth="xs"
      title={m.editAccess}
      content={(close) => (
        <ScRadioGroup
          value={_.level}
          onChange={(level) => {
            if (_.userId) {
              _updateAccessLevel.mutateAsync({ siret, level, userId: _.userId })
            }
            close()
          }}
        >
          {objectKeysUnsafe(CompanyAccessLevel).map((level) => (
            <ScRadioGroupItem
              title={CompanyAccessLevel[level]}
              description={
                m.companyAccessLevelDescription[CompanyAccessLevel[level]]
              }
              value={level}
              key={level}
            />
          ))}
        </ScRadioGroup>
      )}
    >
      <Tooltip title={m.editAccess}>
        <ScButton
          sx={{ textTransform: 'capitalize' }}
          loading={_updateAccessLevel.isPending}
          color="primary"
          icon="manage_accounts"
          variant="outlined"
          disabled={!_.userId || !_.editable}
        >
          {(CompanyAccessLevel as any)[_.level]}
        </ScButton>
      </Tooltip>
    </ScDialog>
  )
}

function ActionsColumn({
  accesses: _,
  siret,
  invalidateQueries,
  onResendCompanyAccessToken,
}: {
  accesses: Accesses
  siret: string
  invalidateQueries: () => void
  onResendCompanyAccessToken: (email: string) => Promise<unknown>
}) {
  const { setConnectedUser, connectedUser, api: api } = useConnectedContext()
  const { m } = useI18n()
  const { toastSuccess, toastError } = useToast()
  const { email, token, tokenId, userId } = _
  const isAdmin = connectedUser.isAdmin
  const isSuperAdmin = connectedUser.isSuperAdmin
  const navigate = useNavigate()

  const _logAs = useMutation({
    mutationFn: (email: string) => api.public.authenticate.logAs(email),
    onSuccess: (user) => {
      setConnectedUser(user)
      navigate('/')
    },
  })

  const _removeAccess = useMutation({
    mutationFn: (params: { siret: string; userId: string }) =>
      api.secured.companyAccess.remove(params.siret, params.userId),
    onSuccess: invalidateQueries,
    onError: toastError,
  })

  const _removeToken = useMutation({
    mutationFn: (params: { siret: string; tokenId: string }) =>
      api.secured.companyAccessToken.remove(params.siret, params.tokenId),
    onSuccess: invalidateQueries,
    onError: toastError,
  })

  function copyActivationLink(token: string) {
    const patch =
      siteMap.loggedout.activatePro(siret) + toQueryString({ token })
    const activationLink = window.location.host + patch
    navigator.clipboard
      .writeText(activationLink)
      .then((_) => toastSuccess(m.addressCopied))
  }

  const authAttemptsHistoryMenuItem =
    isAdmin && _.userId ? (
      <>
        <NavLink
          to={`${
            siteMap.logged.users.root
          }/${siteMap.logged.users.auth_attempts.value(_.email)}`}
        >
          <MenuItem>
            <ListItemIcon>
              <Icon>manage_search</Icon>
            </ListItemIcon>
            <ListItemText>{m.authAttemptsHistory}</ListItemText>
          </MenuItem>
        </NavLink>
      </>
    ) : undefined

  const impersonateMenuItem =
    isSuperAdmin && email ? (
      <>
        <MenuItem onClick={() => _logAs.mutate(email)}>
          <ListItemIcon>
            <Icon>theater_comedy</Icon>
          </ListItemIcon>
          <ListItemText>Se connecter en tant que</ListItemText>
        </MenuItem>
      </>
    ) : undefined

  const copyInviteMenuItem =
    isAdmin && !_.name && token ? (
      <MenuItem onClick={(_) => copyActivationLink(token)}>
        <ListItemIcon>
          <Icon>content_copy</Icon>
        </ListItemIcon>
        <ListItemText>{m.copyInviteLink}</ListItemText>
      </MenuItem>
    ) : undefined

  const resendInviteMenuItem =
    isAdmin && !_.name && email ? (
      <ScDialog
        title={m.resendCompanyAccessToken(email)}
        onConfirm={(event, close) =>
          onResendCompanyAccessToken(email).then((_) => close())
        }
        maxWidth="xs"
      >
        <MenuItem>
          <ListItemIcon>
            <Icon>send</Icon>
          </ListItemIcon>
          <ListItemText>{m.resendInvite}</ListItemText>
        </MenuItem>
      </ScDialog>
    ) : undefined

  const removeMenuItem =
    _.editable && userId ? (
      <ScDialog
        title={m.deleteCompanyAccess(_.name!)}
        onConfirm={() => _removeAccess.mutate({ siret, userId })}
        maxWidth="xs"
        confirmLabel={m.delete_access}
      >
        <MenuItem>
          <ListItemIcon>
            <Icon color="warning">clear</Icon>
          </ListItemIcon>
          <ListItemText>
            <span className="text-orange-600">{m.delete_access}</span>
          </ListItemText>
        </MenuItem>
      </ScDialog>
    ) : tokenId ? (
      <ScDialog
        title={m.deleteCompanyAccessToken(_.email)}
        onConfirm={() => _removeToken.mutate({ siret, tokenId })}
        maxWidth="xs"
        confirmLabel="Annuler l'invitation"
      >
        <MenuItem>
          <ListItemIcon>
            <Icon>clear</Icon>
          </ListItemIcon>
          <ListItemText>Annuler l'invitation</ListItemText>
        </MenuItem>
      </ScDialog>
    ) : undefined

  const deleteUserMenuItem =
    isAdmin && _.userId ? (
      <UserDeleteDialog userId={_.userId} onDelete={invalidateQueries}>
        <MenuItem>
          <ListItemIcon>
            <Icon color="error">delete</Icon>
          </ListItemIcon>
          <ListItemText>
            <span className="text-red-600">{m.delete_user}</span>
          </ListItemText>
        </MenuItem>
      </UserDeleteDialog>
    ) : undefined

  const menuItems = [
    authAttemptsHistoryMenuItem,
    copyInviteMenuItem,
    resendInviteMenuItem,
    impersonateMenuItem,
    removeMenuItem,
    deleteUserMenuItem,
  ].filter(isDefined)
  return menuItems.length ? <ScMenu>{menuItems}</ScMenu> : null
}
