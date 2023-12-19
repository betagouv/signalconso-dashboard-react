import * as React from 'react'
import {useEffect} from 'react'
import {useEffectFn, useFetcher, useMemoFn} from '../../alexlibs/react-hooks-lib'
import {Txt} from '../../alexlibs/mui-extension'
import {useParams} from 'react-router'
import {Page, PageTitle} from 'shared/Page'
import {Panel, PanelBody, PanelHead} from 'shared/Panel'
import {HorizontalBarChart} from 'shared/Chart/HorizontalBarChart'
import {reportStatusColor, reportStatusProColor} from 'shared/ReportStatus'
import {useI18n} from 'core/i18n'
import {Box, Grid, Icon, List, ListItem, Tooltip} from '@mui/material'
import {useLogin} from 'core/context/LoginContext'
import {Widget} from 'shared/Widget/Widget'
import {siteMap} from 'core/siteMap'
import {useToast} from 'core/toast'
import {WidgetValue} from 'shared/Widget/WidgetValue'
import {WidgetLoading} from 'shared/Widget/WidgetLoading'
import {ReportsShortList} from './ReportsShortList'
import {useCompanyStats} from './useCompanyStats'
import {StatusDistribution} from './stats/StatusDistribution'
import {ReviewDistribution} from './stats/ReviewDistribution'
import {CompanyInfo} from './stats/CompanyInfo'
import {CompanyChartPanel} from './CompanyChartPanel'
import {EventActionValues} from '../../core/client/event/Event'
import {ReportStatus, ReportStatusPro} from '../../core/client/report/Report'
import {Id} from '../../core/model'
import {ScOption} from 'core/helper/ScOption'
import {ReportWordDistribution} from './stats/ReportWordDistribution'
import {useReportSearchQuery} from '../../core/queryhooks/reportQueryHooks'
import {useGetCompanyEventsQuery} from '../../core/queryhooks/eventQueryHooks'
import {useGetCompanyByIdQuery, useGetHostsQuery, useGetResponseRateQuery} from '../../core/queryhooks/companyQueryHooks'

export const CompanyComponent = () => {
  const {id} = useParams<{id: Id}>()
  const {apiSdk, connectedUser} = useLogin()
  const {m} = useI18n()
  const {toastError} = useToast()
  const _companyById = useGetCompanyByIdQuery(id)
  const _hosts = useGetHostsQuery(id, {enabled: !connectedUser.isPro})
  const _responseRate = useGetResponseRateQuery(id)
  const _stats = useCompanyStats(id)
  const companyEvents = useGetCompanyEventsQuery(_companyById.data?.siret)

  const _accesses = useFetcher((siret: string) => apiSdk.secured.companyAccess.count(siret))
  const _reports = useReportSearchQuery()
  const _cloudWord = useFetcher((companyId: Id) => apiSdk.secured.reports.getCloudWord(companyId))
  const company = _companyById.data

  useEffect(() => {
    _stats.tags.fetch()
    _stats.getCompanyThreat.fetch({})
    _stats.getCompanyRefundBlackMail.fetch({})
    _cloudWord.fetch({}, id)
    connectedUser.isPro ? _stats.statusPro.fetch() : _stats.status.fetch()
    _stats.responseDelay.fetch()
  }, [id])

  useEffectFn(_cloudWord.error, toastError)
  useEffectFn(_stats.reportCount.error, toastError)
  useEffectFn(_stats.tags.error, toastError)
  useEffectFn(_stats.status.error, toastError)
  useEffectFn(_stats.statusPro.error, toastError)
  useEffectFn(_stats.responseDelay.error, toastError)

  useEffectFn(company, _ => {
    _accesses.fetch({}, _.siret)
    _reports.updateFilters({hasCompany: true, siretSirenList: [_.siret], offset: 0, limit: 5})
  })

  const postActivationDocEvents = useMemoFn(companyEvents.data, events =>
    events.map(_ => _.data).filter(_ => _.action === EventActionValues.PostAccountActivationDoc),
  )

  const tagsDistribution = useMemoFn(_stats.tags.entity, _ =>
    Object.entries(_).map(([label, count]) => ({
      label,
      value: count,
    })),
  )

  return (
    <Page loading={_companyById.isLoading}>
      <PageTitle>
        <Box>
          {company?.name}
          {company?.brand && (
            <Txt block size="small" fontStyle="italic">
              {company.brand}
            </Txt>
          )}
          <Txt block size="big" color="hint">
            {company?.siret}
          </Txt>
        </Box>
      </PageTitle>

      {company && (
        <>
          <Grid container spacing={2}>
            <Grid item xs={4}>
              <Widget title={m.responseRate}>
                <WidgetValue>{_responseRate.data}%</WidgetValue>
              </Widget>
            </Grid>
            <Grid item xs={4}>
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
            <Grid item xs={4}>
              <Widget title={m.proTheatToConsumer} loading={_stats.getCompanyThreat.loading}>
                <WidgetValue>
                  {_stats.getCompanyThreat.entity && _stats.getCompanyThreat.entity.value}
                  &nbsp;
                  <Tooltip title={m.proTheatToConsumerDesc}>
                    <Icon sx={{color: t => t.palette.text.disabled}} fontSize="medium">
                      help
                    </Icon>
                  </Tooltip>
                </WidgetValue>
              </Widget>
            </Grid>
            <Grid item xs={4}>
              <Widget title={m.proRefundBlackMail} loading={_stats.getCompanyRefundBlackMail.loading}>
                <WidgetValue>
                  {_stats.getCompanyRefundBlackMail.entity && _stats.getCompanyRefundBlackMail.entity.value}
                  &nbsp;
                  <Tooltip title={m.proRefundBlackMailDesc}>
                    <Icon sx={{color: t => t.palette.text.disabled}} fontSize="medium">
                      help
                    </Icon>
                  </Tooltip>
                </WidgetValue>
              </Widget>
            </Grid>
            <Grid item xs={4}>
              <Widget title={m.activationDocReturned} loading={companyEvents.isLoading}>
                {ScOption.from(postActivationDocEvents)
                  .map(_ => <WidgetValue>{_.length}</WidgetValue>)
                  .getOrElse(<WidgetLoading />)}
              </Widget>
            </Grid>
            <Grid item xs={4}>
              <Widget title={m.accountsActivated} loading={_accesses.loading} to={siteMap.logged.companyAccesses(company.siret)}>
                <WidgetValue>{_accesses.entity}</WidgetValue>
              </Widget>
            </Grid>
          </Grid>
          <CompanyChartPanel companyId={id} company={company} />

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
              <Panel loading={_reports.result.isFetching}>
                <PanelHead>{m.lastReports}</PanelHead>
                {_reports.result.data && <ReportsShortList reports={_reports.result.data} />}
              </Panel>
            </Grid>
            <Grid item sm={12} md={5}>
              <CompanyInfo company={company} />
              <ReviewDistribution companyId={id} />
              <ReportWordDistribution companyId={id} />
              {connectedUser.isNotPro && (
                <Panel loading={_hosts.isLoading}>
                  <PanelHead>{m.websites}</PanelHead>
                  <Box sx={{maxHeight: 260, overflow: 'auto'}}>
                    <List dense>
                      {_hosts.data?.map((host, i) => (
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
