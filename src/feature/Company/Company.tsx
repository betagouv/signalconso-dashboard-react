import * as React from 'react'
import {useEffect, useMemo, useState} from 'react'
import {Page, PageTitle} from 'shared/Layout'
import {useCompaniesContext} from '../../core/context/CompaniesContext'
import {useParams} from 'react-router'
import {EventActionValues, Id, Period} from '@signal-conso/signalconso-api-sdk-js'
import {Panel, PanelBody, PanelHead} from '../../shared/Panel'
import {HorizontalBarChart} from '../../shared/HorizontalBarChart/HorizontalBarChart'
import {reportStatusColor} from '../../shared/ReportStatus/ReportStatus'
import {useI18n} from '../../core/i18n'
import {Enum} from '@alexandreannic/ts-utils/lib/common/enum/Enum'
import {Divider, Grid, Icon, LinearProgress, List, ListItem, ListItemIcon, ListItemText, Skeleton, Theme, Tooltip} from '@mui/material'
import makeStyles from '@mui/styles/makeStyles'
import {Txt} from 'mui-extension/lib/Txt/Txt'
import {CompanyReportsCountPanel} from './CompanyReportsCountPanel'
import {useMemoFn} from '../../shared/hooks/UseMemoFn'
import {useEventContext} from '../../core/context/EventContext'
import {useEffectFn} from '../../shared/hooks/UseEffectFn'
import {useFetcher} from '@alexandreannic/react-hooks-lib/lib'
import {useLogin} from '../../core/context/LoginContext'
import {Widget} from '../../shared/Widget/Widget'
import {siteMap} from '../../core/siteMap'
import {useToast} from '../../core/toast'
import {WidgetValue} from '../../shared/Widget/WidgetValue'
import {useCssUtils} from '../../core/helper/useCssUtils'
import {classes} from '../../core/helper/utils'
import {fromNullable} from 'fp-ts/es6/Option'
import {WidgetLoading} from '../../shared/Widget/WidgetLoading'
import {AddressComponent} from '../../shared/Address/Address'
import {useReportsContext} from '../../core/context/ReportsContext'
import {ReportsShortList} from './ReportsShortList'
import {styleUtils} from '../../core/theme'
import {useStatsContext} from '../../core/context/StatsContext'

const useStyles = makeStyles((t: Theme) => ({
  reviews: {
    display: 'flex',
    justifyContent: 'space-around',
    textAlign: 'center',
    width: '100%',
  },
  reviews_type: {
    display: 'flex',
    alignItems: 'center',
  },
  reviews_type_value: {
    fontWeight: t.typography.fontWeightBold,
    fontSize: styleUtils(t).fontSize.big,
    // margin: t.spacing(2),
  },
  reviews_type_icon: {
    margin: t.spacing(0, 2, 0, 2),
    fontSize: 38,
  },
  report: {
    margin: t.spacing(1, 1, 1, 1),
    '&:not(:last-of-type)': {
      borderBottom: `1px solid ${t.palette.divider}`,
    },
  },
  reportTag: {},
  statusInfo: {
    verticalAlign: 'middle',
    color: t.palette.text.disabled,
    marginLeft: t.spacing(1),
  },
}))

const ticks = 7

export const CompanyComponent = () => {
  const {id} = useParams<{id: Id}>()
  const {m, formatDate, formatLargeNumber} = useI18n()
  const _company = useCompaniesContext()
  const _stats = useStatsContext()
  const _event = useEventContext()
  const _accesses = useFetcher((siret: string) => apiSdk.secured.companyAccess.fetch(siret))
  const _report = useReportsContext()
  const css = useStyles()
  const cssUtils = useCssUtils()
  const {apiSdk} = useLogin()
  const company = _company.byId.entity
  const {toastError} = useToast()
  const [reportsCurvePeriod, setReportsCurvePeriod] = useState<Period>('Month')

  const fetchCurve = (period: Period) => {
    setReportsCurvePeriod(period)
    _stats.curve.reportCount.fetch({}, {companyId: id, ticks, tickDuration: period})
    _stats.curve.reportRespondedCount.fetch({}, {companyId: id, ticks, tickDuration: period})
  }

  const reportsCurves = useMemo(() => {
    const reportsResponded = _stats.curve.reportRespondedCount.entity
    const reports = _stats.curve.reportCount.entity
    if (reportsResponded && reports) {
      return reports.map(_ => ({
        date: _.date,
        count: _.count,
        countResponded: reportsResponded.find(_1 => _1.date.getTime() - _.date.getTime() === 0)?.count ?? -1,
      }))
    }
  }, [_stats.curve.reportCount, _stats.curve.reportRespondedCount])

  useEffect(() => {
    _company.byId.fetch({}, id)
    _company.hosts.fetch({}, id)
    _company.responseRate.fetch({}, id)
    fetchCurve('Month')
    _stats.tags.fetch({}, id)
    _stats.status.fetch({}, id)
    _stats.responseReviews.fetch({}, id)
    _stats.responseDelay.fetch({}, id)
  }, [])

  useEffectFn(_company.byId.error, toastError)
  useEffectFn(_company.hosts.error, toastError)
  useEffectFn(_stats.reportCount.error, toastError)
  useEffectFn(_stats.tags.error, toastError)
  useEffectFn(_stats.status.error, toastError)
  useEffectFn(_stats.responseReviews.error, toastError)
  useEffectFn(_stats.responseDelay.error, toastError)

  useEffectFn(_company.byId.entity, _ => {
    _event.companyEvents.fetch({}, _.siret)
    _accesses.fetch({}, _.siret)
    _report.updateFilters({siretSirenList: [_.siret], offset: 0, limit: 5})
  })

  const postActivationDocEvents = useMemoFn(_event.companyEvents.entity, events =>
    events.map(_ => _.data).filter(_ => _.action === EventActionValues.PostAccountActivationDoc),
  )

  const statusDistribution = useMemoFn(_stats.status.entity, _ =>
    Enum.entries(_).map(([status, count]) => ({
      label: (
        <span>
          {m.reportStatusShort[status]}
          <Tooltip title={m.reportStatusDesc[status]}>
            <Icon fontSize="small" className={css.statusInfo}>
              help
            </Icon>
          </Tooltip>
        </span>
      ),
      value: count,
      color: reportStatusColor[status] ?? undefined,
    })),
  )

  const tagsDistribution = useMemoFn(_stats.tags.entity, _ => Object.entries(_).map(([label, count]) => ({label, value: count})))

  return (
    <Page loading={_company.byId.loading}>
      <PageTitle>
        <div>
          {company?.name}
          <Txt block size="big" color="hint">
            {company?.siret}
          </Txt>
        </div>
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
                  <WidgetLoading/>
                ) : (
                  <WidgetValue>
                      <span>
                        {_stats.responseDelay.entity ? _stats.responseDelay.entity.toDays : '∞'}&nbsp;
                        <Txt size="big">{m.days}</Txt>
                        &nbsp;
                        <Tooltip title={_stats.responseDelay.entity ? m.avgResponseTimeDesc : m.avgResponseTimeDescNoData}>
                          <Icon className={cssUtils.colorTxtHint} fontSize="medium">
                            help
                          </Icon>
                        </Tooltip>
                      </span>
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
                {fromNullable(_accesses.entity)
                  .map(_ => <WidgetValue>{_.length}</WidgetValue>)
                  .getOrElse(<WidgetLoading />)}
              </Widget>
            </Grid>
          </Grid>
          <CompanyReportsCountPanel
            period={reportsCurvePeriod}
            data={reportsCurves} onChange={period => fetchCurve(period)}
            total={company.count}
          />
          <Grid container spacing={2}>
            <Grid item sm={12} md={7}>
              <Panel>
                <PanelHead>{m.status}</PanelHead>
                <PanelBody>
                  <HorizontalBarChart data={statusDistribution} grid />
                </PanelBody>
              </Panel>
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
              <Panel>
                <PanelHead>{m.consumerReviews}</PanelHead>
                {fromNullable(_stats.responseReviews.entity)
                  .map(_ => (
                    <PanelBody>
                      <Txt color="hint" block className={cssUtils.marginBottom2}>
                        {m.consumerReviewsDesc}
                      </Txt>
                      <div className={css.reviews}>
                        <div className={css.reviews_type}>
                          <div className={css.reviews_type_value}>{_.positive}</div>
                          <Icon className={classes(css.reviews_type_icon, cssUtils.colorSuccess)}>thumb_up</Icon>
                        </div>
                        <div className={css.reviews_type}>
                          <Icon className={classes(css.reviews_type_icon, cssUtils.colorError)}>thumb_down</Icon>
                          <div className={css.reviews_type_value}>{_.negative}</div>
                        </div>
                      </div>
                      <LinearProgress
                        className={cssUtils.marginTop2}
                        variant="determinate"
                        value={(_.positive / (_.positive + _.negative)) * 100}
                      />
                    </PanelBody>
                  ))
                  .getOrElse(
                    <PanelBody>
                      <Skeleton height={66} width="100%" />
                    </PanelBody>,
                  )}
              </Panel>
              <Panel>
                <PanelHead>{m.informations}</PanelHead>
                <PanelBody>
                  <List>
                    <ListItem>
                      <ListItemIcon>
                        <Icon>location_on</Icon>
                      </ListItemIcon>
                      <ListItemText primary={m.address} secondary={<AddressComponent address={company.address} />} />
                    </ListItem>
                    <Divider variant="inset" component="li" />
                    <ListItem>
                      <ListItemIcon>
                        <Icon>event</Icon>
                      </ListItemIcon>
                      <ListItemText primary={m.creationDate} secondary={formatDate(company.creationDate)} />
                    </ListItem>
                    <Divider variant="inset" component="li" />
                    <ListItem>
                      <ListItemIcon>
                        <Icon>label</Icon>
                      </ListItemIcon>
                      <ListItemText primary={m.activityCode} secondary={company.activityCode} />
                    </ListItem>
                  </List>
                </PanelBody>
              </Panel>
              <Panel loading={_company.hosts.loading}>
                <PanelHead>{m.websites}</PanelHead>
                <div style={{maxHeight: 260, overflow: 'auto'}}>
                  <List dense>
                    {_company.hosts.entity?.map((host, i) => (
                      <ListItem key={i}>{host}</ListItem>
                    ))}
                  </List>
                </div>
              </Panel>
            </Grid>
          </Grid>
        </>
      )}
    </Page>
  )
}
