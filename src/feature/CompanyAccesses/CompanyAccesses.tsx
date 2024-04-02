import {Icon, Tooltip} from '@mui/material'
import {UserDeleteButton} from 'feature/Users/UserDeleteButton'
import {useEffect, useMemo} from 'react'
import {NavLink} from 'react-router-dom'
import {IconBtn, Txt} from '../../alexlibs/mui-extension'
import {Enum} from '../../alexlibs/ts-utils'
import {CompanyAccessLevel} from '../../core/client/company-access/CompanyAccess'
import {useLogin} from '../../core/context/LoginContext'
import {getAbsoluteLocalUrl, toQueryString} from '../../core/helper'
import {useI18n} from '../../core/i18n'
import {CompanyWithReportsCount, Id, User} from '../../core/model'
import {siteMap} from '../../core/siteMap'
import {sxUtils} from '../../core/theme'
import {useToast} from '../../core/toast'
import {ScButton} from '../../shared/Button'
import {Datatable, DatatableColumnProps} from '../../shared/Datatable/Datatable'
import {ScRadioGroup} from '../../shared/RadioGroup'
import {ScRadioGroupItem} from '../../shared/RadioGroupItem'
import {ScDialog} from '../../shared/ScDialog'
import {CompanyAccessCreateBtn} from './CompanyAccessCreateBtn'
import {SaveUndeliveredDocBtn} from './SaveUndeliveredDocBtn'
import {useCompanyAccess} from './useCompaniesAccess'

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

export function CompanyAccesses({company}: {company: CompanyWithReportsCount | undefined}) {
  if (!company) {
    return null
  }
  return <CompanyAccessesLoaded company={company} />
}

function CompanyAccessesLoaded({company}: {company: CompanyWithReportsCount}) {
  const siret = company.siret

  const _crudAccess = useCompanyAccess(useLogin().apiSdk, siret!).crudAccess
  const _crudToken = useCompanyAccess(useLogin().apiSdk, siret!).crudToken

  const {m} = useI18n()
  const {connectedUser} = useLogin()
  const {toastSuccess, toastError, toastErrorIfDefined} = useToast()

  const copyActivationLink = (token: string) => {
    const patch = getAbsoluteLocalUrl(siteMap.loggedout.activatePro(siret) + toQueryString({token}))
    const activationLink = window.location.host + patch
    navigator.clipboard.writeText(activationLink).then(_ => toastSuccess(m.addressCopied))
  }

  const accesses: Accesses[] = useMemo(() => {
    return [
      ...(_crudAccess.list ?? []).map(_ => ({
        email: _.email,
        name: User.buildFullName(_),
        level: _.level,
        userId: _.userId,
        editable: _.editable,
        isHeadOffice: _.isHeadOffice,
      })),
      ...(_crudToken.list ?? []).map(_ => ({email: _.emailedTo, level: _.level, tokenId: _.id, token: _.token})),
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

  const inviteNewUser = async (email: string, level: CompanyAccessLevel): Promise<any> => {
    if (accesses?.find(_ => _.email === email)) {
      toastError({message: m.invitationToProAlreadySent(email)})
    } else {
      await _crudToken
        .create({}, email, level)
        .then(() => toastSuccess(m.userInvitationSent))
        .then(() => window.location.reload())
    }
  }

  const isAdmin = connectedUser.isAdmin
  const isPro = connectedUser.isPro
  const isListEmpty = _crudAccess.list?.length !== 0

  const deleteButtonColumn: Column = {
    id: 'delete',
    sx: _ => ({ml: 0, pl: 0, mr: 0, pr: 0}),
    render: _ => <>{_.userId && <UserDeleteButton userId={_.userId} compact onDelete={_crudAccess.fetch} />}</>,
  }

  const emailColumn: Column = {
    id: 'email',
    head: m.email,
    render: _ => {
      const pending = !_.name
      const isCurrentUser = connectedUser.email === _.email
      return (
        <>
          <div>
            <span className={`font-bold ${pending ? 'text-gray-500' : ''}`}>{_.email}</span>
            {isCurrentUser && <span className="text-gray-500"> ({m.you})</span>}
            {_.isHeadOffice && <span className="text-gray-500"> (via le siège social)</span>}
          </div>
          {pending ? (
            <span className="text-blue-600 font-bold uppercase">Invitation envoyée</span>
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
    render: _ => (
      <ScDialog
        maxWidth="xs"
        title={m.editAccess}
        content={close => (
          <ScRadioGroup
            value={_.level}
            onChange={level => {
              if (_.userId) _crudAccess.update(_.userId, level as CompanyAccessLevel)
              close()
            }}
          >
            {Enum.keys(CompanyAccessLevel).map(level => (
              <ScRadioGroupItem
                title={CompanyAccessLevel[level]}
                description={m.companyAccessLevelDescription[CompanyAccessLevel[level]]}
                value={level}
                key={level}
              />
            ))}
          </ScRadioGroup>
        )}
      >
        <Tooltip title={m.editAccess}>
          <ScButton
            sx={{textTransform: 'capitalize'}}
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
    sx: _ => sxUtils.tdActions,
    render: _ => {
      const {email, token, tokenId, userId} = _
      return (
        <>
          {isAdmin && !_.name && email && (
            <ScDialog
              title={m.resendCompanyAccessToken(email)}
              onConfirm={(event, close) =>
                _crudToken
                  .create({preventInsert: true}, email, _.level)
                  .then(_ => close())
                  .then(_ => toastSuccess(m.userInvitationSent))
              }
              maxWidth="xs"
            >
              <Tooltip title={m.resendInvite}>
                <IconBtn>
                  <Icon>send</Icon>
                </IconBtn>
              </Tooltip>
            </ScDialog>
          )}

          {isAdmin && !_.name && token && (
            <Tooltip title={m.copyInviteLink}>
              <IconBtn onClick={_ => copyActivationLink(token)}>
                <Icon>content_copy</Icon>
              </IconBtn>
            </Tooltip>
          )}

          {_.editable && userId ? (
            <ScDialog
              title={m.deleteCompanyAccess(_.name!)}
              onConfirm={() => _crudAccess.remove(userId)}
              maxWidth="xs"
              confirmLabel={m.delete_access}
            >
              <Tooltip title={m.delete_access}>
                <IconBtn color="error" loading={_crudAccess.removing(userId)}>
                  <Icon>remove_circle</Icon>
                </IconBtn>
              </Tooltip>
            </ScDialog>
          ) : tokenId ? (
            <ScDialog title={m.deleteCompanyAccessToken(_.email)} onConfirm={() => _crudToken.remove(tokenId)} maxWidth="xs">
              <IconBtn color="error" loading={_crudToken.removing(tokenId)}>
                <Icon>remove_circle</Icon>
              </IconBtn>
            </ScDialog>
          ) : (
            <></>
          )}
        </>
      )
    },
  }

  const authAttemptsHistoryColumn: Column = {
    id: 'authAttemptsHistory',
    sx: _ => ({ml: 0, pl: 0, mr: 0, pr: 0}),
    render: _ => (
      <>
        {_.userId && (
          <Tooltip title={m.authAttemptsHistory}>
            <NavLink to={`${siteMap.logged.users.root}/${siteMap.logged.users.auth_attempts.value(_.email)}`}>
              <IconBtn color="primary">
                <Icon>history</Icon>
              </IconBtn>
            </NavLink>
          </Tooltip>
        )}
      </>
    ),
  }

  return (
    <>
      <div className="flex justify-between gap-2 sm:items-center mb-4 flex-col sm:flex-row">
        <p>Les personnes suivantes peuvent consulter et répondre aux signalements de l'entreprise {company.name}.</p>
        <div className="flex gap-2 shrink-0">
          {isAdmin && isListEmpty && siret && <SaveUndeliveredDocBtn {...{siret}} />}
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
          getRenderRowKey={_ => _.email ?? _.tokenId!}
          columns={[
            ...(isAdmin ? [deleteButtonColumn] : []),
            emailColumn,
            levelColumn,
            actionsColumn,
            ...(isAdmin ? [authAttemptsHistoryColumn] : []),
          ]}
        />
      </>
    </>
  )
}
