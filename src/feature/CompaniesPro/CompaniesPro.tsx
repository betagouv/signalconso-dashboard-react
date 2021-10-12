import {Page, PageTitle} from '../../shared/Layout'
import {useI18n} from '../../core/i18n'
import React, {useEffect, useMemo, useState} from 'react'
import {Panel, PanelBody} from '../../shared/Panel'
import {useCompaniesContext} from '../../core/context/CompaniesContext'
import {useCssUtils} from '../../core/helper/useCssUtils'
import {Datatable} from '../../shared/Datatable/Datatable'
import {Icon, makeStyles, Switch, Theme, Tooltip} from '@material-ui/core'
import {styleUtils} from '../../core/theme'
import {Fender, IconBtn} from 'mui-extension/lib'
import {ScButton} from '../../shared/Button/Button'
import {AddressComponent} from '../../shared/Address/Address'
import {siteMap} from '../../core/siteMap'
import {NavLink} from 'react-router-dom'
import {AccessLevel, Id} from '@signal-conso/signalconso-api-sdk-js'
import {useUsersContext} from '../../core/context/UsersContext'
import {fromNullable} from 'fp-ts/lib/Option'
import {classes} from '../../core/helper/utils'
import {useBlockedReportNotificationContext} from '../../core/context/BlockedReportNotificationProviderContext'
import {useToast} from '../../core/toast'
import {Txt} from 'mui-extension/lib/Txt/Txt'
import {ConfirmDisableNotificationDialog} from './ConfirmDisableNotificationDialog'
import {groupBy} from '../../core/lodashNamedExport'
import {PanelFoot} from '../../shared/Panel/PanelFoot'
import {useLogin} from '../../core/context/LoginContext'

const useStyles = makeStyles((t: Theme) => ({
  tdName_label: {
    fontWeight: 'bold',
    marginBottom: -1,
  },
  tdName: {
    lineHeight: 1.4,
    maxWidth: 200,
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
    padding: 0,
  },
  fender: {
    margin: `${t.spacing(1)}px auto ${t.spacing(2)}px auto`,
  },
  tdActions: {
    textAlign: 'right',
    width: 0,
  },
}))

export const CompaniesPro = () => {
  const {m} = useI18n()
  const _companies = useCompaniesContext()
  const _blockedNotifications = useBlockedReportNotificationContext()
  const cssUtils = useCssUtils()
  const {connectedUser} = useLogin()
  const css = useStyles()
  const _users = useUsersContext()
  const {toastError} = useToast()
  const [state, setState] = useState<Id | Id[] | undefined>()

  useEffect(() => {
    _users.getConnectedUser.fetch({force: false})
    _blockedNotifications.list.fetch()
    _companies.accessibleByPro.fetch({force: false})
  }, [])

  const blockedNotificationIndex = useMemo(() => {
    return fromNullable(_blockedNotifications.list.entity)
      .map(blockedNotification => groupBy(blockedNotification, _ => _.companyId))
      .toUndefined()
  }, [_blockedNotifications.list.entity])

  useEffect(() => {
    fromNullable(_blockedNotifications.create.error)
      .map(toastError)
      .map(() => _blockedNotifications.list.fetch({clean: false}))
    fromNullable(_blockedNotifications.remove.error)
      .map(toastError)
      .map(() => _blockedNotifications.list.fetch({clean: false}))
  }, [_blockedNotifications.create.error, _blockedNotifications.remove.error])

  const allNotificationsAreBlocked = useMemo(() => {
    if (_companies.accessibleByPro.entity && blockedNotificationIndex) {
      return _companies.accessibleByPro.entity?.every(_ => blockedNotificationIndex[_.id])
    }
    return false
  }, [_companies.accessibleByPro.entity, blockedNotificationIndex])

  return (
    <Page size="small">
      <PageTitle
        action={
          <NavLink to={siteMap.loggedout.register}>
            <ScButton icon="add" color="primary" variant="outlined">
              {m.addACompany}
            </ScButton>
          </NavLink>
        }
      >
        {m.myCompanies}
      </PageTitle>

      {fromNullable(_companies.accessibleByPro.entity)
        .map(
          companies =>
            companies.length > 5 && (
              <Panel>
                <PanelBody>
                  <Txt block size="big" bold>
                    {m.notifications}
                  </Txt>
                  <Txt block color="hint">
                    {m.notificationAcceptForCompany}
                  </Txt>
                </PanelBody>
                <PanelFoot alignEnd>
                  <ScButton
                    disabled={allNotificationsAreBlocked}
                    color="primary"
                    icon="notifications_off"
                    onClick={() => setState(companies.map(_ => _.id))}
                  >
                    {m.disableAll}
                  </ScButton>
                  <ScButton
                    disabled={_blockedNotifications.list.entity?.length === 0}
                    color="primary"
                    icon="notifications_active"
                    className={cssUtils.marginRight}
                    onClick={() => _blockedNotifications.remove.call(companies.map(_ => _.id))}
                  >
                    {m.enableAll}
                  </ScButton>
                </PanelFoot>
              </Panel>
            ),
        )
        .toUndefined()}

      <Panel>
        <Datatable
          data={_companies.accessibleByPro.entity}
          loading={_companies.accessibleByPro.loading || _blockedNotifications.list.loading}
          getRenderRowKey={_ => _.id}
          rows={[
            {
              id: '',
              className: css.tdName,
              head: m.name,
              row: _ => (
                <Tooltip title={_.name}>
                  <span>
                    <span className={css.tdName_label}>{_.name}</span>
                    <br />
                    <span className={css.tdName_desc}>{_.siret}</span>
                  </span>
                </Tooltip>
              ),
            },
            {
              head: m.address,
              id: 'address',
              className: css.tdAddress,
              row: _ => (
                <Tooltip title={<AddressComponent address={_.address} />}>
                  <span>
                    <AddressComponent address={_.address} />
                  </span>
                </Tooltip>
              ),
            },
            {
              head: <span className={classes(cssUtils.nowrap, cssUtils.vaMiddle)}>{m.notification}</span>,
              id: 'status',
              className: css.tdNotification,
              row: _ => (
                <>
                  <Switch
                    disabled={!blockedNotificationIndex}
                    checked={!blockedNotificationIndex?.[_.id]}
                    onChange={e => {
                      e.target.checked ? _blockedNotifications.remove.call([_.id]) : setState(_.id)
                    }}
                  />
                </>
              ),
            },
            {
              head: '',
              id: 'actions',
              className: css.tdActions,
              row: _ => (
                <>
                  {_.level === AccessLevel.ADMIN && (
                    <NavLink to={siteMap.logged(connectedUser.role).companyAccesses(_.siret)}>
                      <Tooltip title={m.handleAccesses}>
                        <IconBtn color="primary">
                          <Icon>vpn_key</Icon>
                        </IconBtn>
                      </Tooltip>
                    </NavLink>
                  )}
                  <NavLink to={siteMap.logged(connectedUser.role).reports({siretSirenList: [_.siret]})}>
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
      <ConfirmDisableNotificationDialog
        open={!!state}
        onClose={() => setState(undefined)}
        onConfirm={() => {
          _blockedNotifications.create.call([state!].flatMap(_ => _))
          setState(undefined)
        }}
      />
    </Page>
  )
}
