import React, {useEffect, useMemo} from 'react'
import {Page, PageTitle} from '../../shared/Layout'
import {useI18n} from '../../core/i18n'
import {useParams} from 'react-router'
import {Datatable} from '../../shared/Datatable/Datatable'
import {ScSelect} from '../../shared/Select/Select'
import {Icon, MenuItem} from '@material-ui/core'
import {Panel} from '../../shared/Panel'
import {useCssUtils} from '../../core/helper/useCssUtils'
import {Txt} from 'mui-extension/lib/Txt/Txt'
import {CompanyAccessLevel} from '../../core/api'
import {Confirm, IconBtn} from 'mui-extension/lib'
import {Id} from '../../core/api/model'
import {fromNullable, some} from 'fp-ts/lib/Option'
import {useLogin} from '../../core/context/LoginContext'
import {useCompanyAccess} from './useCompaniesAccess'
import {CompanyAccessCreateBtn} from './CompanyAccessCreateBtn'
import {useToast} from '../../core/toast'
import {SaveUndeliveredDocBtn} from './SaveUndeliveredDocBtn'
import {useCompaniesContext} from '../../core/context/CompaniesContext'
import {Enum} from '@alexandreannic/ts-utils/lib/enum/Enum'

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
  const {toastError} = useToast()

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

  return (
    <Page>
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
              onCreate={(email, level) => _crudToken.create({}, email, level)}
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
                some(_)
                  .filter(_ => _.email !== connectedUser.email)
                  .mapNullable(_ => _.userId)
                  .map(userId => (
                    <ScSelect
                      fullWidth
                      value={_.level}
                      onChange={event => _crudAccess.update(userId, event.target.value as CompanyAccessLevel)}
                    >
                      {Enum.keys(CompanyAccessLevel).map(level => (
                        <MenuItem key={level} value={level}>
                          {CompanyAccessLevel[level]}
                        </MenuItem>
                      ))}
                    </ScSelect>
                  ))
                  .getOrElse(<Txt color="hint">{(CompanyAccessLevel as any)[_.level]}</Txt>),
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
                      <Confirm
                        title={m.deleteCompanyAccess(_.name!)}
                        onConfirm={() => _crudAccess.remove(userId)}
                        maxWidth="xs"
                        confirmLabel={m.delete}
                        cancelLabel={m.close}
                      >
                        <IconBtn loading={_crudAccess.removing(userId)}>
                          <Icon>delete</Icon>
                        </IconBtn>
                      </Confirm>
                    ))
                    .getOrElse(
                      fromNullable(_.tokenId)
                        .map(tokenId => (
                          <Confirm
                            title={m.deleteCompanyAccessToken(_.email)}
                            onConfirm={() => _crudToken.remove(tokenId)}
                            maxWidth="xs"
                            confirmLabel={m.confirm}
                            cancelLabel={m.close}
                          >
                            <IconBtn loading={_crudToken.removing(tokenId)}>
                              <Icon>delete</Icon>
                            </IconBtn>
                          </Confirm>
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
