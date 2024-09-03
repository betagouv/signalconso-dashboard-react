import {
  Icon,
  ListItemIcon,
  ListItemText,
  MenuItem,
  Tooltip,
} from '@mui/material'
import { UserDeleteDialog } from 'feature/Users/userDelete'
import { useEffect, useMemo } from 'react'
import { NavLink } from 'react-router-dom'
import { ScMenu } from 'shared/Menu'
import { CompanyAccessLevel } from '../../core/client/company-access/CompanyAccess'
import { useConnectedContext } from '../../core/context/ConnectedContext'
import { isDefined, objectKeysUnsafe, toQueryString } from '../../core/helper'
import { useI18n } from '../../core/i18n'
import { CompanyWithReportsCount, Id, User } from '../../core/model'
import { siteMap } from '../../core/siteMap'
import { sxUtils } from '../../core/theme'
import { useToast } from '../../core/toast'
import { ScButton } from '../../shared/Button'
import {
  Datatable,
  DatatableColumnProps,
} from '../../shared/Datatable/Datatable'
import { ScRadioGroup } from '../../shared/RadioGroup'

import { ScRadioGroupItem } from '../../shared/RadioGroupItem'
import { ScDialog } from '../../shared/ScDialog'
import { CompanyAccessCreateBtn } from './CompanyAccessCreateBtn'
import { useCompanyAccess } from './useCompaniesAccess'

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

  const _crudAccess = useCompanyAccess(
    useConnectedContext().apiSdk,
    siret!,
  ).crudAccess
  const _crudToken = useCompanyAccess(
    useConnectedContext().apiSdk,
    siret!,
  ).crudToken

  const { m } = useI18n()
  const { connectedUser } = useConnectedContext()
  const { toastSuccess, toastError, toastErrorIfDefined } = useToast()

  const copyActivationLink = (token: string) => {
    const patch =
      siteMap.loggedout.activatePro(siret) + toQueryString({ token })
    const activationLink = window.location.host + patch
    navigator.clipboard
      .writeText(activationLink)
      .then((_) => toastSuccess(m.addressCopied))
  }

  const accesses: Accesses[] = useMemo(() => {
    return [
      ...(_crudAccess.list ?? []).map((_) => ({
        email: _.email,
        name: User.buildFullName(_),
        level: _.level,
        userId: _.userId,
        editable: _.editable,
        isHeadOffice: _.isHeadOffice,
      })),
      ...(_crudToken.list ?? []).map((_) => ({
        email: _.emailedTo,
        level: _.level,
        tokenId: _.id,
        token: _.token,
      })),
    ]
  }, [_crudAccess.list, _crudToken.list])

  useEffect(() => {
    _crudAccess.fetch()
    _crudToken.fetch()
  }, [])

  useEffect(() => {
    toastErrorIfDefined(_crudToken.fetchError)
  }, [_crudToken.list, _crudToken.fetchError])

  useEffect(() => {
    toastErrorIfDefined(_crudAccess.fetchError)
  }, [_crudAccess.list, _crudAccess.fetchError])

  const inviteNewUser = async (
    email: string,
    level: CompanyAccessLevel,
  ): Promise<any> => {
    if (accesses?.find((_) => _.email === email)) {
      toastError({ message: m.invitationToProAlreadySent(email) })
    } else {
      await _crudToken
        .create({}, email, level)
        .then(() => toastSuccess(m.userInvitationSent))
        .then(() => window.location.reload())
    }
  }

  const isAdmin = connectedUser.isAdmin
  const isPro = connectedUser.isPro
  const isListEmpty = _crudAccess.list?.length === 0

  const emailColumn: Column = {
    id: 'email',
    head: m.email,
    render: (_) => {
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
    },
  }

  const levelColumn: Column = {
    id: 'level',
    head: m.companyAccessLevel,
    render: (_) => (
      <ScDialog
        maxWidth="xs"
        title={m.editAccess}
        content={(close) => (
          <ScRadioGroup
            value={_.level}
            onChange={(level) => {
              if (_.userId)
                _crudAccess.update(_.userId, level as CompanyAccessLevel)
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
            loading={_crudAccess.updating(_.userId ?? '')}
            color="primary"
            icon="manage_accounts"
            variant="outlined"
            disabled={!_.userId || !_.editable}
          >
            {(CompanyAccessLevel as any)[_.level]}
          </ScButton>
        </Tooltip>
      </ScDialog>
    ),
  }

  const actionsColumn: Column = {
    id: 'action',
    sx: (_) => sxUtils.tdActions,
    render: (_) => {
      const { email, token, tokenId, userId } = _

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
              _crudToken
                .create({ preventInsert: true }, email, _.level)
                .then((_) => close())
                .then((_) => toastSuccess(m.userInvitationSent))
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
            onConfirm={() => _crudAccess.remove(userId)}
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
            onConfirm={() => _crudToken.remove(tokenId)}
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
          <UserDeleteDialog userId={_.userId} onDelete={_crudAccess.fetch}>
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
        removeMenuItem,
        deleteUserMenuItem,
      ].filter(isDefined)
      return menuItems.length ? <ScMenu>{menuItems}</ScMenu> : null
    },
  }

  return (
    <>
      <div className="flex justify-between gap-2 sm:items-center mb-4 flex-col sm:flex-row">
        <p>
          Les personnes suivantes peuvent consulter et répondre aux signalements
          de l'entreprise {company.name}.
        </p>
        <div className="flex gap-2 shrink-0">
          {(isAdmin || isPro) && (
            <CompanyAccessCreateBtn
              loading={_crudToken.creating}
              onCreate={inviteNewUser}
              errorMessage={_crudToken.createError}
            />
          )}
        </div>
      </div>
      <>
        <Datatable
          id="companyaccesses"
          data={_crudAccess.list && _crudToken.list ? accesses : undefined}
          loading={_crudAccess.fetching || _crudToken.fetching}
          getRenderRowKey={(_) => _.email ?? _.tokenId!}
          columns={[emailColumn, levelColumn, actionsColumn]}
        />
      </>
    </>
  )
}
