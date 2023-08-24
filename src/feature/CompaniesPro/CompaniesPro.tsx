import {FormControlLabel, Switch, useTheme} from '@mui/material'
import {ScOption} from 'core/helper/ScOption'
import {useEffect, useMemo, useState} from 'react'
import {NavLink} from 'react-router-dom'
import {Btn, Fender, Txt} from '../../alexlibs/mui-extension'
import {useBlockedReportNotificationContext} from '../../core/context/BlockedReportNotificationProviderContext'
import {useCompaniesContext} from '../../core/context/CompaniesContext'
import {useUsersContext} from '../../core/context/UsersContext'
import {useI18n} from '../../core/i18n'
import {groupBy} from '../../core/lodashNamedExport'
import {AccessLevel, Id} from '../../core/model'
import {siteMap} from '../../core/siteMap'
import {sxUtils} from '../../core/theme'
import {useToast} from '../../core/toast'
import {AddressComponent} from '../../shared/Address'
import {ScButton} from '../../shared/Button'
import {Datatable} from '../../shared/Datatable/Datatable'
import {Page, PageTitle} from '../../shared/Page'
import {Panel, PanelBody} from '../../shared/Panel'
import {PanelFoot} from '../../shared/Panel/PanelFoot'
import {ConfirmDisableNotificationDialog} from './ConfirmDisableNotificationDialog'

export const CompaniesPro = () => {
  const {m} = useI18n()
  const _companies = useCompaniesContext()
  const _blockedNotifications = useBlockedReportNotificationContext()
  const _users = useUsersContext()
  const {toastError} = useToast()
  const [currentlyDisablingNotificationsForCompanies, setCurrentlyDisablingNotificationsForCompanies] = useState<
    Id | Id[] | undefined
  >()

  useEffect(() => {
    _users.getConnectedUser.fetch({force: false})
    _blockedNotifications.list.fetch()
    _companies.accessibleByPro.fetch({force: false})
  }, [])

  const blockedNotificationIndex = useMemo(() => {
    return ScOption.from(_blockedNotifications.list.entity)
      .map(blockedNotification => groupBy(blockedNotification, _ => _.companyId))
      .getOrElse(undefined)
  }, [_blockedNotifications.list.entity])

  useEffect(() => {
    ScOption.from(_blockedNotifications.create.error)
      .map(toastError)
      .map(() => _blockedNotifications.list.fetch({clean: false}))
    ScOption.from(_blockedNotifications.remove.error)
      .map(toastError)
      .map(() => _blockedNotifications.list.fetch({clean: false}))
  }, [_blockedNotifications.create.error, _blockedNotifications.remove.error])

  const allNotificationsAreBlocked = useMemo(() => {
    if (_companies.accessibleByPro.entity && blockedNotificationIndex) {
      return _companies.accessibleByPro.entity?.every(_ => blockedNotificationIndex[_.id])
    }
    return false
  }, [_companies.accessibleByPro.entity, blockedNotificationIndex])

  const companies = _companies.accessibleByPro.entity

  return (
    <Page size="l">
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

      {companies && companies.length > 5 && (
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
              onClick={() => setCurrentlyDisablingNotificationsForCompanies(companies.map(_ => _.id))}
            >
              {m.disableAll}
            </ScButton>
            <ScButton
              disabled={_blockedNotifications.list.entity?.length === 0}
              color="primary"
              icon="notifications_active"
              sx={{mr: 1}}
              onClick={() => _blockedNotifications.remove.call(companies.map(_ => _.id))}
            >
              {m.enableAll}
            </ScButton>
          </PanelFoot>
        </Panel>
      )}

      <Panel>
        <Datatable
          data={_companies.accessibleByPro.entity}
          loading={_companies.accessibleByPro.loading || _blockedNotifications.list.loading}
          getRenderRowKey={_ => _.id}
          columns={[
            {
              id: '',
              render: _ => (
                <div>
                  <NavLink to={siteMap.logged.company(_.id)} className="text-lg text-scbluefrance">
                    {_.name}
                  </NavLink>
                  <div className="text-gray-500">
                    <AddressComponent address={_.address} />
                  </div>
                  <div className="text-gray-500">SIRET {_.siret}</div>
                </div>
              ),
            },
            {
              id: 'actions',
              sx: _ => sxUtils.tdActions,
              render: _ => (
                <div className="pt-6 space-y-2">
                  <div className="flex items-center justify-end gap-2">
                    {_.level === AccessLevel.ADMIN && (
                      <Btn href={'#' + siteMap.logged.companyAccesses(_.siret)} variant="outlined" size="small" icon="group">
                        {m.handleAccesses}
                      </Btn>
                    )}
                    <Btn href={'#' + siteMap.logged.company(_.id)} variant="outlined" size="small" icon="query_stats">
                      {m.myStats}
                    </Btn>
                    <Btn
                      href={'#' + siteMap.logged.reports({hasCompany: true, siretSirenList: [_.siret]})}
                      variant="contained"
                      icon="assignment_late"
                      size="small"
                    >
                      {m.see_reports}
                    </Btn>
                  </div>
                  <FormControlLabel
                    control={
                      <Switch
                        disabled={!blockedNotificationIndex}
                        checked={!blockedNotificationIndex?.[_.id]}
                        onChange={e => {
                          e.target.checked
                            ? _blockedNotifications.remove.call([_.id])
                            : setCurrentlyDisablingNotificationsForCompanies(_.id)
                        }}
                      />
                    }
                    label={<span className="text-sm">Notifications par email</span>}
                  />
                </div>
              ),
            },
          ]}
          renderEmptyState={
            <Fender
              title={m.noCompanyFound}
              icon="store"
              sx={{
                margin: 'auto',
                mt: 1,
                mb: 2,
              }}
            >
              <ScButton variant="contained" color="primary" icon="add" sx={{mt: 1}}>
                {m.registerACompany}
              </ScButton>
            </Fender>
          }
        />
      </Panel>
      <ConfirmDisableNotificationDialog
        open={!!currentlyDisablingNotificationsForCompanies}
        onClose={() => setCurrentlyDisablingNotificationsForCompanies(undefined)}
        onConfirm={() => {
          _blockedNotifications.create.call([currentlyDisablingNotificationsForCompanies!].flatMap(_ => _))
          setCurrentlyDisablingNotificationsForCompanies(undefined)
        }}
      />
    </Page>
  )
}
