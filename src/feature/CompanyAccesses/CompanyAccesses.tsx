import React, {useEffect, useMemo} from 'react'
import {Page, PageTitle} from '../../shared/Layout'
import {useI18n} from '../../core/i18n'
import {useParams} from 'react-router'
import {Datatable} from '../../shared/Datatable/Datatable'
import {Icon, Tooltip} from '@material-ui/core'
import {Panel} from '../../shared/Panel'
import {useCssUtils} from '../../core/helper/useCssUtils'
import {Txt} from 'mui-extension/lib/Txt/Txt'
import {CompanyAccessLevel} from '../../core/api'
import {IconBtn} from 'mui-extension/lib'
import {Id} from '../../core/api/model'
import {fromNullable, some} from 'fp-ts/lib/Option'
import {useLogin} from '../../core/context/LoginContext'
import {useCompanyAccess} from './useCompaniesAccess'
import {CompanyAccessCreateBtn} from './CompanyAccessCreateBtn'
import {useToast} from '../../core/toast'
import {SaveUndeliveredDocBtn} from './SaveUndeliveredDocBtn'
import {useCompaniesContext} from '../../core/context/CompaniesContext'
import {Enum} from '@alexandreannic/ts-utils/lib/enum/Enum'
import {ScDialog} from '../../shared/Confirm/ScDialog'
import {ScButton} from '../../shared/Button/Button'
import {ScRadioGroupItem} from '../../shared/RadioGroup/RadioGroupItem'
import {ScRadioGroup} from '../../shared/RadioGroup/RadioGroup'

interface Accesses {
  name?: string
  userId?: Id
  email?: string
  level: CompanyAccessLevel
  tokenId?: Id
}

export const CompanyAccesses = () => {
  const {siret} = useParams<{siret: string}>()

  const _crudAccess = useCompanyAccess(useLogin().apiSdk, siret).crudAccess
  const _crudToken = useCompanyAccess(useLogin().apiSdk, siret).crudToken
  const _company = useCompaniesContext()

  const {m} = useI18n()
  const cssUtils = useCssUtils()
  const {connectedUser} = useLogin()
  const {toastSuccess, toastError} = useToast()

  const accesses: Accesses[] = useMemo(() => {
    return [
      ...(_crudAccess.list ?? []).map(_ => ({
        email: _.email,
        name: _.firstName + ' ' + _.lastName,
        level: _.level,
        userId: _.userId,
      })),
      ...(_crudToken.list ?? []).map(_ => ({email: _.emailedTo, level: _.level, tokenId: _.id})),
    ]
  }, [_crudAccess.list, _crudToken.list])

  useEffect(() => {
    _crudAccess.fetch()
    _crudToken.fetch()
  }, [])

  useEffect(() => {
    fromNullable(_crudToken.fetchError).map(toastError)
  }, [_crudToken.list, _crudToken.fetchError])

  useEffect(() => {
    fromNullable(_crudAccess.fetchError).map(toastError)
  }, [_crudAccess.list, _crudAccess.fetchError])

  const inviteNewUser = async (email: string, level: CompanyAccessLevel): Promise<any> => {
    if (accesses?.find(_ => _.email === email)) {
      toastError({message: m.invitationToProAlreadySent(email)})
    } else {
      await _crudToken.create({}, email, level)
      toastSuccess(m.userInvitationSent)
    }
  }

  return (
    <Page size="small">
      <PageTitle
        action={
          <>
            {_crudAccess.list?.length === 0 && (
              <SaveUndeliveredDocBtn
                loading={_company.saveUndeliveredDocument.loading}
                onChange={date => _company.saveUndeliveredDocument.fetch({}, siret, date)}
                className={cssUtils.marginRight}
              />
            )}
            <CompanyAccessCreateBtn
              loading={_crudToken.creating}
              onCreate={inviteNewUser}
              errorMessage={_crudToken.createError}
            />
          </>
        }
      >
        {m.companyAccessesTitle}
      </PageTitle>
      <Panel>
        <Datatable<Accesses>
          data={_crudAccess.list && _crudToken.list ? accesses : undefined}
          loading={_crudAccess.fetching || _crudToken.fetching}
          getRenderRowKey={_ => _.email ?? _.tokenId!}
          rows={[
            {
              id: 'status',
              head: '',
              row: _ =>
                _.name ? (
                  <Icon className={cssUtils.colorSuccess}>check_circle</Icon>
                ) : (
                  <Icon className={cssUtils.colorWarning}>watch_later</Icon>
                ),
            },
            {
              id: 'email',
              head: m.email,
              row: _ =>
                connectedUser.email === _.email ? (
                  <Txt bold>
                    {_.email} ({m.you})
                  </Txt>
                ) : (
                  _.email
                ),
            },
            {
              id: 'name',
              head: m.name,
              row: _ => _.name,
            },
            {
              id: 'level',
              head: m.companyAccessLevel,
              row: _ =>
                <ScDialog maxWidth="xs" title={m.editAccess} content={close => (
                  <ScRadioGroup
                    value={_.level}
                    onChange={level => {
                      if (_.userId)
                        _crudAccess.update(_.userId, level as CompanyAccessLevel)
                      close()
                    }}>
                    {Enum.keys(CompanyAccessLevel).map(level => (
                      <ScRadioGroupItem
                        title={CompanyAccessLevel[level]}
                        description={m.companyAccessLevelDescription[CompanyAccessLevel[level]]}
                        value={level}
                        key={level}/>
                    ))}
                  </ScRadioGroup>
                )}>
                  <Tooltip title={m.editAccess}>
                    <ScButton
                      className={cssUtils.txtCapitalize}
                      loading={_crudAccess.updating(_.userId ?? '')}
                      color="primary"
                      icon="manage_accounts"
                      variant="outlined"
                      disabled={_.email === connectedUser.email || !_.userId}
                    >
                      {(CompanyAccessLevel as any)[_.level]}
                    </ScButton>
                  </Tooltip>
                </ScDialog>
            },
            {
              id: 'action',
              head: '',
              className: cssUtils.txtRight,
              row: _ => (
                <>
                  {some(_)
                    .filter(_ => _.email !== connectedUser.email)
                    .mapNullable(_ => _.userId)
                    .map(userId => (
                      <ScDialog
                        title={m.deleteCompanyAccess(_.name!)}
                        onConfirm={() => _crudAccess.remove(userId)}
                        maxWidth="xs"
                        confirmLabel={m.delete}
                      >
                        <IconBtn loading={_crudAccess.removing(userId)}>
                          <Icon>delete</Icon>
                        </IconBtn>
                      </ScDialog>
                    ))
                    .getOrElse(
                      fromNullable(_.tokenId)
                        .map(tokenId => (
                          <ScDialog
                            title={m.deleteCompanyAccessToken(_.email)}
                            onConfirm={() => _crudToken.remove(tokenId)}
                            maxWidth="xs"
                          >
                            <IconBtn loading={_crudToken.removing(tokenId)}>
                              <Icon>delete</Icon>
                            </IconBtn>
                          </ScDialog>
                        ))
                        .getOrElse(<></>),
                    )}
                </>
              ),
            },
          ]}
        />
      </Panel>
    </Page>
  )
}
