import * as React from 'react'
import {useEffect} from 'react'
import {useFetcher} from '@alexandreannic/react-hooks-lib/lib'
import {Txt} from 'mui-extension/lib/Txt/Txt'
import {useParams} from 'react-router'
import {Page, PageTitle} from 'shared/Layout'
import {useCompaniesContext} from 'core/context/CompaniesContext'
import {EventActionValues, Id, ReportStatus, ReportStatusPro} from '@signal-conso/signalconso-api-sdk-js'
import {Panel, PanelBody, PanelHead} from 'shared/Panel'
import {HorizontalBarChart} from 'shared/HorizontalBarChart/HorizontalBarChart'
import {reportStatusColor, reportStatusProColor} from 'shared/ReportStatus/ReportStatus'
import {useI18n} from 'core/i18n'
import {Box, Grid, Icon, List, ListItem, Tooltip} from '@mui/material'
import {useMemoFn} from 'shared/hooks/UseMemoFn'
import {useEventContext} from 'core/context/EventContext'
import {useEffectFn} from 'shared/hooks/UseEffectFn'
import {useLogin} from 'core/context/LoginContext'
import {Widget} from 'shared/Widget/Widget'
import {siteMap} from 'core/siteMap'
import {useToast} from 'core/toast'
import {WidgetValue} from 'shared/Widget/WidgetValue'
import {fromNullable} from 'fp-ts/es6/Option'
import {WidgetLoading} from 'shared/Widget/WidgetLoading'
import {useReportsContext} from 'core/context/ReportsContext'
import {ReportsShortList} from './ReportsShortList'
import {useCompanyStats} from './useCompanyStats'
import {StatusDistribution} from './stats/StatusDistribution'
import {ReviewDistribution} from './stats/ReviewDistribution'
import {CompanyInfo} from './stats/CompanyInfo'
import {CompanyChartPanel} from './CompanyChartPanel'

export const CompanyComponent = () => {
  const {id} = useParams<{id: Id}>()
  const {apiSdk, connectedUser} = useLogin()
  const {m, formatLargeNumber} = useI18n()
  const {toastError} = useToast()
  const _company = useCompaniesContext()
  const _stats = useCompanyStats(id)
  const _event = useEventContext()
  const _accesses = useFetcher((siret: string) => apiSdk.secured.companyAccess.count(siret))
  const _report = useReportsContext()
  const company = _company.byId.entity

  useEffect(() => {
    _company.byId.fetch({}, id)
    if (!connectedUser.isPro) {
      _company.hosts.fetch({}, id)
    }
    _company.responseRate.fetch({}, id)
    _stats.tags.fetch()
    connectedUser.isPro ? _stats.statusPro.fetch() : _stats.status.fetch()
    _stats.responseDelay.fetch()
  }, [])

  useEffectFn(_company.byId.error, toastError)
  useEffectFn(_company.hosts.error, toastError)
  useEffectFn(_stats.reportCount.error, toastError)
  useEffectFn(_stats.tags.error, toastError)
  useEffectFn(_stats.status.error, toastError)
  useEffectFn(_stats.statusPro.error, toastError)
  useEffectFn(_stats.responseDelay.error, toastError)

  useEffectFn(_company.byId.entity, _ => {
    _event.companyEvents.fetch({}, _.siret)
    _accesses.fetch({}, _.siret)
    _report.updateFilters({siretSirenList: [_.siret], offset: 0, limit: 5})
  })

  const postActivationDocEvents = useMemoFn(_event.companyEvents.entity, events =>
    events.map(_ => _.data).filter(_ => _.action === EventActionValues.PostAccountActivationDoc),
  )

  const tagsDistribution = useMemoFn(_stats.tags.entity, _ =>
    Object.entries(_).map(([label, count]) => ({
      label,
      value: count,
    })),
  )

  return (
    <Page loading={_company.byId.loading}>
      <PageTitle>
        <Box>
          {company?.name}
          <Txt block size="big" color="hint">
            {company?.siret}
          </Txt>
        </Box>
      </PageTitle>

      {_company.byId.entity && company && (
        <>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6} md={3}>
              <Widget title={m.responseRate}>
                <WidgetValue>{_company.responseRate.entity}%</WidgetValue>
              </Widget>
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <Widget title={m.avgResponseTime}>
                {_stats.responseDelay.loading ? (
                  <WidgetLoading />
                ) : (
                  <WidgetValue>
                    <Box component="span">
                      {_stats.responseDelay.entity ? _stats.responseDelay.entity.toDays : '∞'}&nbsp;
                      <Txt size="big">{m.days}</Txt>
                      &nbsp;
                      <Tooltip title={_stats.responseDelay.entity ? m.avgResponseTimeDesc : m.avgResponseTimeDescNoData}>
                        <Icon sx={{color: t => t.palette.text.disabled}} fontSize="medium">
                          help
                        </Icon>
                      </Tooltip>
                    </Box>
                  </WidgetValue>
                )}
              </Widget>
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <Widget title={m.activationDocReturned} loading={_event.companyEvents.loading}>
                {fromNullable(postActivationDocEvents)
                  .map(_ => <WidgetValue>{_.length}</WidgetValue>)
                  .getOrElse(<WidgetLoading />)}
              </Widget>
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <Widget title={m.accountsActivated} loading={_accesses.loading} to={siteMap.logged.companyAccesses(company.siret)}>
                <WidgetValue>{_accesses.entity}</WidgetValue>
              </Widget>
            </Grid>
          </Grid>
          <CompanyChartPanel companyId={id} company={company}/>

          <Grid container spacing={2}>
            <Grid item sm={12} md={7}>
              {connectedUser.isPro ? (
                <StatusDistribution<ReportStatusPro>
                  values={_stats.statusPro.entity}
                  loading={_stats.statusPro.loading}
                  statusDesc={(s: ReportStatusPro) => m.reportStatusDescPro[s]}
                  statusShortLabel={(s: ReportStatusPro) => m.reportStatusShortPro[s]}
                  statusColor={(s: ReportStatusPro) => reportStatusProColor[s]}
                />
              ) : (
                <StatusDistribution<ReportStatus>
                  loading={_stats.status.loading}
                  values={_stats.status.entity}
                  statusDesc={(s: ReportStatus) => m.reportStatusDesc[s]}
                  statusShortLabel={(s: ReportStatus) => m.reportStatusShort[s]}
                  statusColor={(s: ReportStatus) => reportStatusColor[s]}
                />
              )}
              <Panel>
                <PanelHead>{m.tags}</PanelHead>
                <PanelBody>
                  <HorizontalBarChart data={tagsDistribution} grid />
                </PanelBody>
              </Panel>
              <Panel loading={_report.fetching}>
                <PanelHead>{m.lastReports}</PanelHead>
                {_report.list && <ReportsShortList reports={_report.list} />}
              </Panel>
            </Grid>
            <Grid item sm={12} md={5}>
              <ReviewDistribution companyId={id} />
              <CompanyInfo company={company} />
              {connectedUser.isNotPro && (
                <Panel loading={_company.hosts.loading}>
                  <PanelHead>{m.websites}</PanelHead>
                  <Box sx={{maxHeight: 260, overflow: 'auto'}}>
                    <List dense>
                      {_company.hosts.entity?.map((host, i) => (
                        <ListItem key={i}>{host}</ListItem>
                      ))}
                    </List>
                  </Box>
                </Panel>
              )}
            </Grid>
          </Grid>
        </>
      )}
    </Page>
  )
}
