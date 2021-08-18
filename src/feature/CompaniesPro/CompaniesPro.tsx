import {Page, PageTitle} from '../../shared/Layout'
import {useI18n} from '../../core/i18n'
import React, {useEffect, useMemo} from 'react'
import {Panel} from '../../shared/Panel'
import {useCompaniesContext} from '../../core/context/CompaniesContext'
import {useCssUtils} from '../../core/helper/useCssUtils'
import {Datatable} from '../../shared/Datatable/Datatable'
import {Icon, makeStyles, Switch, Theme, Tooltip} from '@material-ui/core'
import {styleUtils} from '../../core/theme'
import {Alert, Fender, IconBtn} from 'mui-extension/lib'
import {ScButton} from '../../shared/Button/Button'
import {AddressComponent} from '../../shared/Address/Address'
import {siteMap} from '../../core/siteMap'
import {NavLink} from 'react-router-dom'
import {AccessLevel, Company} from '../../core/api'
import {useUsersContext} from '../../core/context/UsersContext'
import {Txt} from 'mui-extension/lib/Txt/Txt'
import {indexEntities} from '@alexandreannic/ts-utils/lib/indexEntites/IndexEntities'
import {fromNullable} from 'fp-ts/lib/Option'
import {classes} from '../../core/helper/utils'
import {useBlockedReportNotificationContext} from '../../core/context/BlockedReportNotificationProviderContext'

const useStyles = makeStyles((t: Theme) => ({
  tdName_label: {
    fontWeight: 'bold',
    marginBottom: -1,
  },
  tdName: {
    lineHeight: 1.4,
    maxWidth: 170,
  },
  tdName_desc: {
    fontSize: t.typography.fontSize * 0.875,
    color: t.palette.text.hint,
  },
  tdAddress: {
    maxWidth: 240,
    color: t.palette.text.secondary,
    ...styleUtils(t).truncate,
  },
  tdNotification: {
    width: 0,
    textAlign: 'center',
  },
  fender: {
    margin: `${t.spacing(1)}px auto ${t.spacing(2)}px auto`,
  },
  tdActions: {
    textAlign: 'right',
    width: 0,
  },
}))

interface CompanyInfo extends Company {
  level?: AccessLevel
}

export const CompaniesPro = () => {
  const {m} = useI18n()
  const _companies = useCompaniesContext()
  const _reportNotificationBlockLists = useBlockedReportNotificationContext()
  const cssUtils = useCssUtils()
  const css = useStyles()
  const _users = useUsersContext()

  useEffect(() => {
    _users.getConnectedUser.fetch({force: false})
    _reportNotificationBlockLists.crud.fetch()
    _companies.visibleByPro.fetch({force: false})
    _companies.accessibleByPro.fetch({force: false})
  }, [])

  const accessibleCompaniesIndex = useMemo(() => {
    return fromNullable(_companies.accessibleByPro.entity)
      .map(_ => indexEntities('id', _))
      .toUndefined()
  }, [_companies.accessibleByPro.entity])

  const blockedNotificationIndex = useMemo(() => {
    return fromNullable(_reportNotificationBlockLists.crud.list)
      .map(_ => indexEntities('companyId', _))
      .toUndefined()
  }, [_reportNotificationBlockLists.crud.list])

  return (
    <Page size="small">
      <PageTitle>{m.myCompanies}</PageTitle>
      {_users.getConnectedUser.entity && (
        <Alert
          type="info"
          gutterBottom
          hidden={_users.getConnectedUser.entity.acceptNotifications}
          action={
            <Switch
              checked={_users.getConnectedUser.entity?.acceptNotifications ?? true}
              onChange={e => _users.patchConnectedUser.fetch({}, {acceptNotifications: e.target.checked})}
            />
          }
        >
          <Txt bold block>
            {m.notificationsAreDisabled}
          </Txt>
          <Txt color="hint" block>
            {m.notificationsAreDisabledDesc}
          </Txt>
        </Alert>
      )}
      <Panel>
        <Datatable
          data={accessibleCompaniesIndex && blockedNotificationIndex && _companies.visibleByPro.entity || undefined}
          loading={
            _companies.visibleByPro.loading || _companies.accessibleByPro.loading || _reportNotificationBlockLists.crud.fetching
          }
          getRenderRowKey={_ => _.id}
          rows={[
            {
              id: '',
              className: css.tdName,
              head: m.name,
              row: _ => (
                <>
                  <span className={css.tdName_label}>{_.name}</span>
                  <br />
                  <span className={css.tdName_desc}>{_.siret}</span>
                </>
              ),
            },
            {
              head: m.address,
              id: 'address',
              className: css.tdAddress,
              row: _ => <AddressComponent address={_.address} />,
            },
            {
              head: (
                <Tooltip title={m.notificationAcceptForCompany}>
                  <span className={classes(cssUtils.nowrap, cssUtils.vaMiddle)}>
                    {m.notification}&nbsp;
                    <Icon className={cssUtils.inlineIcon}>help</Icon>
                  </span>
                </Tooltip>
              ),
              id: 'status',
              className: css.tdNotification,
              row: _ => (
                <Switch
                  disabled={!_users.getConnectedUser.entity?.acceptNotifications}
                  checked={!blockedNotificationIndex?.[_.id]}
                  onChange={e => {
                    e.target.checked
                      ? _reportNotificationBlockLists.crud.remove(_.id)
                      : _reportNotificationBlockLists.crud.create({}, _.id)
                  }}
                />
              ),
            },
            {
              head: '',
              id: 'actions',
              className: css.tdActions,
              row: _ => (
                <>
                  {accessibleCompaniesIndex?.[_.id]?.level === AccessLevel.ADMIN && (
                    <NavLink to={siteMap.companyAccesses(_.siret)}>
                      <Tooltip title={m.handleAccesses}>
                        <IconBtn color="primary">
                          <Icon>vpn_key</Icon>
                        </IconBtn>
                      </Tooltip>
                    </NavLink>
                  )}
                  <NavLink to={siteMap.reports({siretSirenList: [_.siret]})}>
                    <Tooltip title={m.reports}>
                      <IconBtn color="primary">
                        <Icon>chevron_right</Icon>
                      </IconBtn>
                    </Tooltip>
                  </NavLink>
                </>
              ),
            },
          ]}
          renderEmptyState={
            <Fender title={m.noCompanyFound} icon="store" className={css.fender}>
              <ScButton variant="contained" color="primary" icon="add" className={cssUtils.marginTop}>
                {m.registerACompany}
              </ScButton>
            </Fender>
          }
        />
      </Panel>
    </Page>
  )
}
