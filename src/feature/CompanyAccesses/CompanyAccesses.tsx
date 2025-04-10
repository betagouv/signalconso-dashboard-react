import {
  Icon,
  ListItemIcon,
  ListItemText,
  MenuItem,
  Tooltip,
} from '@mui/material'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { Link, useNavigate } from '@tanstack/react-router'
import { UserDeleteDialog } from 'feature/Users/userDelete'
import { ScMenu } from 'shared/Menu'
import { config } from '../../conf/config'
import {
  CompanyAccess,
  CompanyAccessLevel,
  companyAccessLevelsCreatable,
  translateCompanyAccessLevel,
} from '../../core/client/company-access/CompanyAccess'
import { useConnectedContext } from '../../core/context/connected/connectedContext'
import { useToast } from '../../core/context/toast/toastContext'
import { isDefined, siretToSiren, toQueryString } from '../../core/helper'
import { useI18n } from '../../core/i18n'
import {
  CompanyAccessToken,
  CompanyWithReportsCount,
  Id,
  UserUtils,
} from '../../core/model'
import { sxUtils } from '../../core/theme'
import { ScButton } from '../../shared/Button'
import {
  Datatable,
  DatatableColumnProps,
} from '../../shared/Datatable/Datatable'
import { ScRadioGroup } from '../../shared/RadioGroup'
import { ScRadioGroupItem } from '../../shared/RadioGroupItem'
import { ScDialog } from '../../shared/ScDialog'
import { CompanyAccessCreateBtn } from './CompanyAccessCreateBtn'

type RowData =
  | {
      kind: 'actual_access'
      email: string
      name: string
      userId: Id
      level: CompanyAccessLevel
      editable: boolean
      isHeadOffice: boolean
    }
  | ({
      kind: 'invitation'
      level: CompanyAccessLevel
      tokenId: Id
      token?: string // the api returns it only if current user is admin
    } & ({ subkind: 'by_email'; email: string } | { subkind: 'by_post' }))

type Column = DatatableColumnProps<RowData>

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

  const data: RowData[] = mergeData(_accesses.data, _tokens.data)

  async function inviteNewUser(
    email: string,
    level: CompanyAccessLevel,
  ): Promise<void> {
    if (emailExistsInData(email, data)) {
      toastError({ message: m.invitationToProAlreadySent(email) })
    } else {
      await _sendInvitation.mutateAsync({ email, level, siret })
    }
  }

  const isAdmin = connectedUser.isAdmin
  const proAccessLevel =
    connectedUser.isPro &&
    data.find(
      (access) =>
        access.kind === 'actual_access' && access.userId === connectedUser.id,
    )?.level
  const isProWithAdminAccess = proAccessLevel === 'admin'

  const emailColumn: Column = {
    id: 'email',
    head: m.email,
    render: (accesses) => <EmailColumn accesses={accesses} />,
  }

  const levelColumn: Column = {
    id: 'level',
    head: m.companyAccessLevel,
    render: (accesses) => (
      <LevelColumn {...{ siret, rowData: accesses, invalidateQueries }} />
    ),
  }

  const actionsColumn: Column = {
    id: 'action',
    sx: (_) => sxUtils.tdActions,
    render: (accesses) => (
      <ActionsColumn
        {...{ rowData: accesses, siret, invalidateQueries }}
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
          {(isAdmin || isProWithAdminAccess) && (
            <CompanyAccessCreateBtn
              loading={_sendInvitation.isPending}
              onCreate={inviteNewUser}
            />
          )}
        </div>
      </div>
      <Datatable
        id="companyaccesses"
        data={data}
        loading={_accesses.isLoading || _tokens.isLoading}
        getRenderRowKey={getRowKey}
        columns={[emailColumn, levelColumn, actionsColumn]}
      />
    </>
  )
}

function EmailColumn({ accesses: _ }: { accesses: RowData }) {
  const { m } = useI18n()
  const { connectedUser } = useConnectedContext()
  const isInvitation = _.kind === 'invitation'
  const email = getEmail(_)
  const isCurrentUser = connectedUser.email === email
  const isHeadOffice = _.kind === 'actual_access' && _.isHeadOffice
  return (
    <>
      <div>
        {}
        {email && (
          <span className={`font-bold ${isInvitation ? 'text-gray-500' : ''}`}>
            {email}
          </span>
        )}
        {isCurrentUser && <span className="text-gray-500"> ({m.you})</span>}
        {isHeadOffice && (
          <span className="text-gray-500"> (via le siège social)</span>
        )}
      </div>
      {isInvitation ? (
        _.subkind === 'by_post' ? (
          <span className="flex items-center gap-1 text-blue-600 font-bold">
            Invitation envoyée par courrier
            <Icon>email_outlined</Icon>
          </span>
        ) : (
          <span className="text-blue-600 font-bold">Invitation envoyée</span>
        )
      ) : (
        <span className="text-gray-500">{_.name}</span>
      )}
    </>
  )
}

function LevelColumn({
  rowData,
  siret,
  invalidateQueries,
}: {
  rowData: RowData
  siret: string
  invalidateQueries: () => void
}) {
  if (rowData.kind === 'actual_access' && rowData.editable) {
    return <LevelColumnEditable {...{ rowData, siret, invalidateQueries }} />
  }
  return (
    <ScButton
      sx={{ textTransform: 'capitalize' }}
      color="primary"
      icon="manage_accounts"
      variant="outlined"
      disabled
    >
      {translateCompanyAccessLevel(rowData.level)}
    </ScButton>
  )
}

function LevelColumnEditable({
  rowData,
  siret,
  invalidateQueries,
}: {
  rowData: RowData & { kind: 'actual_access' }
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
          value={rowData.level}
          onChange={(level) => {
            _updateAccessLevel.mutateAsync({
              siret,
              level,
              userId: rowData.userId,
            })
            close()
          }}
        >
          {companyAccessLevelsCreatable.map((level) => (
            <ScRadioGroupItem
              title={translateCompanyAccessLevel(level)}
              description={m.companyAccessLevelDescription[level]}
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
          disabled={!rowData.userId || !rowData.editable}
        >
          {translateCompanyAccessLevel(rowData.level)}
        </ScButton>
      </Tooltip>
    </ScDialog>
  )
}

function ActionsColumn({
  rowData: _,
  siret,
  invalidateQueries,
  onResendCompanyAccessToken,
}: {
  rowData: RowData
  siret: string
  invalidateQueries: () => void
  onResendCompanyAccessToken: (email: string) => Promise<unknown>
}) {
  const { setConnectedUser, connectedUser, api } = useConnectedContext()
  const { m } = useI18n()
  const { toastSuccess, toastError } = useToast()
  const email = getEmail(_)
  const isAdmin = connectedUser.isAdmin
  const navigate = useNavigate()
  const queryClient = useQueryClient()

  const _logAs = useMutation({
    mutationFn: (email: string) => api.public.authenticate.logAs(email),
    onSuccess: (user) => {
      setConnectedUser(user)
      navigate({ to: '/' })
      queryClient.resetQueries()
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
    const patch = `/entreprise/rejoindre/${siret}${toQueryString({ token })}`
    const activationLink = config.dashboardBaseUrl + patch
    navigator.clipboard
      .writeText(activationLink)
      .then((_) => toastSuccess(m.addressCopied))
  }

  const authAttemptsHistoryMenuItem =
    isAdmin && _.kind === 'actual_access' && _.userId ? (
      <Link
        key="authAttemptsHistoryMenuItem"
        to="/users/auth-attempts"
        search={{
          email: _.email,
        }}
      >
        <MenuItem>
          <ListItemIcon>
            <Icon>manage_search</Icon>
          </ListItemIcon>
          <ListItemText>{m.authAttemptsHistory}</ListItemText>
        </MenuItem>
      </Link>
    ) : undefined

  const impersonateMenuItem =
    isAdmin && email ? (
      <MenuItem key="impersonateMenuItem" onClick={() => _logAs.mutate(email)}>
        <ListItemIcon>
          <Icon>theater_comedy</Icon>
        </ListItemIcon>
        <ListItemText>Se connecter en tant que</ListItemText>
      </MenuItem>
    ) : undefined

  const copyInviteMenuItem =
    isAdmin &&
    _.kind === 'invitation' &&
    _.subkind === 'by_email' &&
    _.token ? (
      <MenuItem
        key="copyInviteMenuItem"
        onClick={() => {
          if (_.token) {
            copyActivationLink(_.token)
          }
        }}
      >
        <ListItemIcon>
          <Icon>content_copy</Icon>
        </ListItemIcon>
        <ListItemText>{m.copyInviteLink}</ListItemText>
      </MenuItem>
    ) : undefined

  const resendInviteMenuItem =
    isAdmin && _.kind === 'invitation' && _.subkind === 'by_email' ? (
      <ScDialog
        key="resendInviteMenuItem"
        title={m.resendCompanyAccessToken(email)}
        onConfirm={(event, close) =>
          onResendCompanyAccessToken(_.email).then((_) => close())
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
    _.kind === 'actual_access' && _.editable ? (
      <ScDialog
        key="removeMenuItem"
        title={m.deleteCompanyAccess(_.name!)}
        onConfirm={() => _removeAccess.mutate({ siret, userId: _.userId })}
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
    ) : _.kind === 'invitation' ? (
      <ScDialog
        key="removeMenuItem"
        title={m.deleteCompanyAccessToken(getEmail(_))}
        onConfirm={() => _removeToken.mutate({ siret, tokenId: _.tokenId })}
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
    isAdmin && _.kind === 'actual_access' ? (
      <UserDeleteDialog
        key="deleteUserMenuItem"
        userId={_.userId}
        onDelete={invalidateQueries}
      >
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

function mergeData(
  companyAccesses: CompanyAccess[] | undefined,
  companyAccessesTokens: CompanyAccessToken[] | undefined,
): RowData[] {
  return [
    ...(companyAccesses ?? []).map((_) => ({
      kind: 'actual_access' as const,
      email: _.email,
      name: UserUtils.buildFullName(_),
      level: _.level,
      userId: _.userId,
      editable: _.editable,
      isHeadOffice: _.isHeadOffice,
    })),
    ...(companyAccessesTokens ?? []).map((_) => ({
      kind: 'invitation' as const,
      level: _.level,
      tokenId: _.id,
      token: _.token,
      ...(_.emailedTo
        ? { subkind: 'by_email' as const, email: _.emailedTo }
        : { subkind: 'by_post' as const }),
    })),
  ]
}

function emailExistsInData(email: string, data: RowData[]) {
  return data.find((_) => getEmail(_) === email)
}

function getEmail(_: RowData) {
  return _.kind === 'actual_access'
    ? _.email
    : _.kind === 'invitation' && _.subkind === 'by_email'
      ? _.email
      : undefined
}

function getRowKey(_: RowData) {
  return _.kind === 'actual_access' ? _.userId : _.tokenId
}
