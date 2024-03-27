import {FormControlLabel, Switch} from '@mui/material'
import {UseMutationResult, useMutation, useQueryClient} from '@tanstack/react-query'
import {ScOption} from 'core/helper/ScOption'
import type {Dictionary} from 'lodash'
import {useMemo, useState} from 'react'
import {NavLink} from 'react-router-dom'
import {CleanDiscreetPanel, CleanWidePanel} from 'shared/Panel/simplePanels'
import {Btn, Fender, Txt} from '../../alexlibs/mui-extension'
import {useApiContext} from '../../core/context/ApiContext'
import {useI18n} from '../../core/i18n'
import {groupBy, uniqBy} from '../../core/lodashNamedExport'
import {AccessLevel, BlockedReportNotification, CompanyWithAccessLevel, Id} from '../../core/model'
import {useGetAccessibleByProQuery} from '../../core/queryhooks/companyQueryHooks'
import {
  ListReportBlockedNotificationsQueryKeys,
  useListReportBlockedNotificationsQuery,
} from '../../core/queryhooks/reportBlockedNotificationQueryHooks'
import {siteMap} from '../../core/siteMap'
import {AddressComponent} from '../../shared/Address'
import {ScButton} from '../../shared/Button'
import {Datatable} from '../../shared/Datatable/Datatable'
import {Page, PageTitle} from '../../shared/Page'
import {ConfirmDisableNotificationDialog} from './ConfirmDisableNotificationDialog'

export const CompaniesPro = () => {
  const {m} = useI18n()
  const {api} = useApiContext()
  const queryClient = useQueryClient()
  const _companiesAccessibleByPro = useGetAccessibleByProQuery()
  const _blockedNotifications = useListReportBlockedNotificationsQuery()
  const _create = useMutation({
    mutationFn: (companyIds: Id[]) => {
      const newBlocked: BlockedReportNotification[] = companyIds.map(companyId => ({
        companyId,
        dateCreation: new Date(),
      }))
      queryClient.setQueryData(ListReportBlockedNotificationsQueryKeys, (prev: BlockedReportNotification[]) =>
        uniqBy([...(prev ?? []), ...newBlocked], _ => _.companyId),
      )
      return api.secured.reportBlockedNotification.create(companyIds)
    },
  })
  const _remove = useMutation({
    mutationFn: (companyIds: Id[]) => {
      queryClient.setQueryData(ListReportBlockedNotificationsQueryKeys, (currentCompanyIds: BlockedReportNotification[]) =>
        currentCompanyIds?.filter(_ => !companyIds.includes(_.companyId)),
      )
      return api.secured.reportBlockedNotification.delete(companyIds)
    },
  })
  const [currentlyDisablingNotificationsForCompanies, setCurrentlyDisablingNotificationsForCompanies] = useState<
    Id | Id[] | undefined
  >()

  const blockedNotificationIndex = useMemo(() => {
    return ScOption.from(_blockedNotifications.data)
      .map(blockedNotification => groupBy(blockedNotification, _ => _.companyId))
      .getOrElse(undefined)
  }, [_blockedNotifications.data])

  const allNotificationsAreBlocked = useMemo(() => {
    if (_companiesAccessibleByPro.data && blockedNotificationIndex) {
      return _companiesAccessibleByPro.data?.every(_ => blockedNotificationIndex[_.id])
    }
    return false
  }, [_companiesAccessibleByPro.data, blockedNotificationIndex])

  const companies = _companiesAccessibleByPro.data

  return (
    <Page>
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
        <div className="mb-8">
          <CleanDiscreetPanel>
            <div className="flex gap-2 justify-between flex-col xl:flex-row">
              <p>
                <Txt block size="big" bold>
                  {m.notifications}
                </Txt>
                <Txt block color="hint">
                  {m.notificationAcceptForCompany}
                </Txt>
              </p>
              <div className="flex gap-2">
                <ScButton
                  disabled={allNotificationsAreBlocked}
                  color="primary"
                  variant="outlined"
                  icon="notifications_off"
                  onClick={() => setCurrentlyDisablingNotificationsForCompanies(companies.map(_ => _.id))}
                >
                  {m.disableAll}
                </ScButton>
                <ScButton
                  disabled={_blockedNotifications.data?.length === 0}
                  color="primary"
                  variant="outlined"
                  icon="notifications_active"
                  sx={{mr: 1}}
                  onClick={() => _remove.mutate(companies.map(_ => _.id))}
                >
                  {m.enableAll}
                </ScButton>
              </div>
            </div>
          </CleanDiscreetPanel>
        </div>
      )}

      <>
        <Datatable
          data={companies}
          loading={_companiesAccessibleByPro.isLoading || _blockedNotifications.isLoading}
          getRenderRowKey={_ => _.id}
          columns={[
            {
              id: 'all',
              render: _ => (
                <CompaniesProRow
                  {...{
                    _,
                    _remove,
                    blockedNotificationIndex,
                    setCurrentlyDisablingNotificationsForCompanies,
                  }}
                />
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
      </>
      <ConfirmDisableNotificationDialog
        open={!!currentlyDisablingNotificationsForCompanies}
        onClose={() => setCurrentlyDisablingNotificationsForCompanies(undefined)}
        onConfirm={() => {
          _create.mutate([currentlyDisablingNotificationsForCompanies!].flatMap(_ => _))
          setCurrentlyDisablingNotificationsForCompanies(undefined)
        }}
      />
    </Page>
  )
}

function CompaniesProRow({
  _,
  _remove,
  setCurrentlyDisablingNotificationsForCompanies,
  blockedNotificationIndex,
}: {
  _: CompanyWithAccessLevel
  _remove: UseMutationResult<void, Error, string[], unknown>
  setCurrentlyDisablingNotificationsForCompanies: React.Dispatch<React.SetStateAction<string | string[] | undefined>>
  blockedNotificationIndex: Dictionary<BlockedReportNotification[]> | undefined
}) {
  const {m} = useI18n()
  return (
    <div className="lg:grid lg:grid-cols-2 py-2">
      <div className="">
        <NavLink to={siteMap.logged.company(_.id)} className="text-lg text-scbluefrance">
          {_.name}
        </NavLink>
        <div className="text-gray-500">
          <AddressComponent address={_.address} />
        </div>
        <div className="text-gray-500">SIRET {_.siret}</div>
      </div>
      <div className="flex flex-col items-end justify-between pb-2">
        <FormControlLabel
          control={
            <Switch
              disabled={!blockedNotificationIndex}
              checked={!blockedNotificationIndex?.[_.id]}
              onChange={e => {
                e.target.checked ? _remove.mutate([_.id]) : setCurrentlyDisablingNotificationsForCompanies(_.id)
              }}
            />
          }
          label={<span className="text-sm">Notifications par email</span>}
        />
        <div className="flex  justify-end gap-2">
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
      </div>
    </div>
  )
}
