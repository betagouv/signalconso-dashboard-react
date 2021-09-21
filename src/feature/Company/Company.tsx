import * as React from 'react'
import {useEffect} from 'react'
import {Page, PageTitle} from 'shared/Layout'
import {useCompaniesContext} from '../../core/context/CompaniesContext'
import {useParams} from 'react-router'
import {EventActionValues, Id} from '../../core/api'
import {Panel, PanelBody, PanelHead} from '../../shared/Panel'
import {HorizontalBarChart} from '../../shared/HorizontalBarChart/HorizontalBarChart'
import {reportStatusColor} from '../../shared/ReportStatus/ReportStatus'
import {useI18n} from '../../core/i18n'
import {Enum} from '@alexandreannic/ts-utils/lib/common/enum/Enum'
import {Divider, Grid, Icon, LinearProgress, List, ListItem, ListItemIcon, ListItemText, makeStyles, Theme} from '@material-ui/core'
import {Txt} from 'mui-extension/lib/Txt/Txt'
import {CompanyReportsCountPanel} from './CompanyReportsCountPanel'
import {useCompaniesStatsContext} from '../../core/context/CompanyStatsContext'
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
}))

export const CompanyComponent = () => {
  const {id} = useParams<{id: Id}>()
  const {m, formatDate, formatLargeNumber} = useI18n()
  const _company = useCompaniesContext()
  const _companyStats = useCompaniesStatsContext()
  const _event = useEventContext()
  const _accesses = useFetcher((siret: string) => apiSdk.secured.companyAccess.fetch(siret))
  const _report = useReportsContext()
  const css = useStyles()
  const cssUtils = useCssUtils()
  const company = _company.byId.entity
  const apiSdk = useLogin().apiSdk
  const {toastError} = useToast()

  useEffect(() => {
    _company.byId.fetch({}, id)
    _companyStats.reportsCountEvolution.fetch({}, id, 'month')
    _companyStats.tags.fetch({}, id)
    _companyStats.hosts.fetch({}, id)
    _companyStats.status.fetch({}, id)
    _companyStats.responseReviews.fetch({}, id)
    _companyStats.responseDelay.fetch({}, id)
  }, [])

  useEffectFn(_company.byId.error, toastError)
  useEffectFn(_companyStats.reportsCountEvolution.error, toastError)
  useEffectFn(_companyStats.tags.error, toastError)
  useEffectFn(_companyStats.hosts.error, toastError)
  useEffectFn(_companyStats.status.error, toastError)
  useEffectFn(_companyStats.responseReviews.error, toastError)
  useEffectFn(_companyStats.responseDelay.error, toastError)

  useEffectFn(_company.byId.entity, _ => {
    _event.companyEvents.fetch({}, _.siret)
    _accesses.fetch({}, _.siret)
    _report.updateFilters({siretSirenList: [_.siret], offset: 0, limit: 5})
  })

  const postActivationDocEvents = useMemoFn(_event.companyEvents.entity, events => events
    .map(_ => _.data)
    .filter(_ => _.action === EventActionValues.PostAccountActivationDoc),
  )

  const statusDistribution = useMemoFn(_companyStats.status.entity, _ => Enum.entries(_).map(([status, count]) =>
    ({label: m.reportStatusShort[status], value: count, color: reportStatusColor[status] ?? undefined}),
  ))

  const tagsDistribution = useMemoFn(_companyStats.tags.entity, _ => Object.entries(_).map(([label, count]) => ({label, value: count})))

  return (
    <Page loading={_company.byId.loading}>
      <PageTitle>
        <div>
          {company?.name}
          <Txt block size="big" color="hint">{company?.siret}</Txt>
        </div>
      </PageTitle>

      {(_company.byId.entity && company) && (
        <>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6} md={3}>
              <Widget title={m.reports} to={siteMap.reports({siretSirenList: [company.siret]})}>
                <WidgetValue>{formatLargeNumber(company.count)}</WidgetValue>
              </Widget>
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <Widget title={m.activationDocReturned} loading={_event.companyEvents.loading}>
                {fromNullable(postActivationDocEvents)
                  .map(_ => <WidgetValue>{_.length}</WidgetValue>)
                  .getOrElse(<WidgetLoading/>)
                }
              </Widget>
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <Widget title={m.accountsActivated} loading={_accesses.loading}>
                {fromNullable(_accesses.entity)
                  .map(_ => <WidgetValue>{_.length}</WidgetValue>)
                  .getOrElse(<WidgetLoading/>)
                }
              </Widget>
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <Widget title={m.avgResponseTime}>
                {fromNullable(_companyStats.responseDelay.entity)
                  .map(_ => <><WidgetValue>{_} <Txt size="big">{m.days}</Txt></WidgetValue></>)
                  .getOrElse(<WidgetLoading/>)
                }
              </Widget>
            </Grid>
          </Grid>
          <CompanyReportsCountPanel
            period={_companyStats.reportsCountEvolutionPeriod}
            data={_companyStats.reportsCountEvolution.entity}
            onChange={period => _companyStats.reportsCountEvolution.fetch({}, id, period)}
          />
          <Grid container spacing={2}>
            <Grid item sm={12} md={7}>
              <Panel>
                <PanelHead>{m.status}</PanelHead>
                <PanelBody>
                  <HorizontalBarChart data={statusDistribution} grid/>
                </PanelBody>
              </Panel>
              <Panel>
                <PanelHead>{m.tags}</PanelHead>
                <PanelBody>
                  <HorizontalBarChart data={tagsDistribution} grid/>
                </PanelBody>
              </Panel>
              <Panel loading={_report.fetching}>
                <PanelHead>{m.lastReports}</PanelHead>
                {_report.list && (
                  <ReportsShortList reports={_report.list}/>
                )}
              </Panel>
            </Grid>
            <Grid item sm={12} md={5}>
              <Panel>
                <PanelHead>{m.reviews}</PanelHead>
                {fromNullable(_companyStats.responseReviews.entity).map(_ => (
                  <PanelBody>
                    <div className={css.reviews}>
                      <div className={css.reviews_type}>
                        <div className={css.reviews_type_value}>
                          {_.positive}
                        </div>
                        <Icon className={classes(css.reviews_type_icon, cssUtils.colorSuccess)}>thumb_up</Icon>
                      </div>
                      <div className={css.reviews_type}>
                        <div className={css.reviews_type_value}>
                          <Icon className={classes(css.reviews_type_icon, cssUtils.colorError)}>thumb_down</Icon>
                        </div>
                        {_.negative}
                      </div>
                    </div>
                    <LinearProgress className={cssUtils.marginTop2} variant="determinate" value={_.positive / (_.positive + _.negative) * 100}/>
                  </PanelBody>
                )).getOrElse(<WidgetLoading/>)}
              </Panel>
              <Panel>
                <PanelHead>{m.informations}</PanelHead>
                <PanelBody>
                  <List>
                    <ListItem>
                      <ListItemIcon>
                        <Icon>location_on</Icon>
                      </ListItemIcon>
                      <ListItemText primary={m.address} secondary={
                        <AddressComponent address={company.address}/>
                      }/>
                    </ListItem>
                    <Divider variant="inset" component="li" />
                    <ListItem>
                      <ListItemIcon>
                        <Icon>event</Icon>
                      </ListItemIcon>
                      <ListItemText primary={m.creationDate} secondary={formatDate(company.creationDate)}/>
                    </ListItem>
                    <Divider variant="inset" component="li"/>
                    <ListItem>
                      <ListItemIcon>
                        <Icon>label</Icon>
                      </ListItemIcon>
                      <ListItemText primary={m.activityCode} secondary={company.activityCode}/>
                    </ListItem>
                  </List>
                </PanelBody>
              </Panel>
              <Panel loading={_companyStats.hosts.loading}>
                <PanelHead>{m.websites}</PanelHead>
                <div style={{maxHeight: 260, overflow: 'auto'}}>
                  <List dense>
                    {_companyStats.hosts.entity?.map(host => <ListItem>{host}</ListItem>)}
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
