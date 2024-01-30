import {useMemoFn, useEffectFn} from '../../alexlibs/react-hooks-lib'
import {Txt} from '../../alexlibs/mui-extension'
import {Page, PageTitle} from 'shared/Page'
import {Panel, PanelBody, PanelHead} from 'shared/Panel'
import {HorizontalBarChart} from 'shared/Chart/HorizontalBarChart'
import {reportStatusProColor} from 'shared/ReportStatus'
import {useI18n} from 'core/i18n'
import {Box, Grid, Icon, Tooltip} from '@mui/material'
import {Widget} from 'shared/Widget/Widget'
import {siteMap} from 'core/siteMap'
import {WidgetValue} from 'shared/Widget/WidgetValue'
import {WidgetLoading} from 'shared/Widget/WidgetLoading'
import {ReportsShortList} from './ReportsShortList'
import {StatusDistribution} from './stats/StatusDistribution'
import {ReviewDistribution} from './stats/ReviewDistribution'
import {CompanyInfo} from './stats/CompanyInfo'
import {CompanyChartPanel} from './CompanyChartPanel'
import {EventActionValues} from '../../core/client/event/Event'
import {ReportStatusPro} from '../../core/client/report/Report'
import {CompanyWithReportsCount, Id, UserWithPermission} from '../../core/model'
import {ScOption} from 'core/helper/ScOption'
import {ReportWordDistribution} from './stats/ReportWordDistribution'
import {useReportSearchQuery} from '../../core/queryhooks/reportQueryHooks'
import {useGetCompanyEventsQuery} from '../../core/queryhooks/eventQueryHooks'
import {
  useCompanyAccessCountQuery,
  useGetCompanyByIdQuery,
  useGetResponseRateQuery,
} from '../../core/queryhooks/companyQueryHooks'
import {useGetProStatusQuery, useGetResponseDelayQuery, useGetTagsQuery} from '../../core/queryhooks/statsQueryHooks'

export type ExtendedUser = UserWithPermission & {
  isPro: boolean
}

type ProUserComponentProps = {
  id: Id
  connectedUser: ExtendedUser
  company?: CompanyWithReportsCount
}

export const ProUserComponent: React.FC<ProUserComponentProps> = ({id, connectedUser, company}) => {
  const {m} = useI18n()
  const _companyById = useGetCompanyByIdQuery(id)
  const _responseRate = useGetResponseRateQuery(id)
  const companyEvents = useGetCompanyEventsQuery(_companyById.data?.siret!, {enabled: !!_companyById.data?.siret})

  const _accesses = useCompanyAccessCountQuery(company?.siret!, {enabled: !!company})
  const _reports = useReportSearchQuery({hasCompany: true, offset: 0, limit: 5}, false)

  const _tags = useGetTagsQuery(id)
  const _getProStatus = useGetProStatusQuery(id, {enabled: connectedUser.isPro})
  const _responseDelay = useGetResponseDelayQuery(id)

  useEffectFn(company, _ => {
    _reports.updateFilters({hasCompany: true, siretSirenList: [_.siret], offset: 0, limit: 5})
    _reports.enable()
  })

  const postActivationDocEvents = useMemoFn(companyEvents.data, events =>
    events.map(_ => _.data).filter(_ => _.action === EventActionValues.PostAccountActivationDoc),
  )

  const tagsDistribution = useMemoFn(_tags.data, _ =>
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
                {_responseDelay.isLoading ? (
                  <WidgetLoading />
                ) : (
                  <WidgetValue>
                    <Box component="span">
                      {_responseDelay.data ? _responseDelay.data.toDays : '∞'}&nbsp;
                      <Txt size="big">{m.days}</Txt>
                      &nbsp;
                      <Tooltip title={_responseDelay.data ? m.avgResponseTimeDesc : m.avgResponseTimeDescNoData}>
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
              <Widget title={m.activationDocReturned} loading={companyEvents.isLoading}>
                {ScOption.from(postActivationDocEvents)
                  .map(_ => <WidgetValue>{_.length}</WidgetValue>)
                  .getOrElse(<WidgetLoading />)}
              </Widget>
            </Grid>
            <Grid item xs={4}>
              <Widget
                title={m.accountsActivated}
                loading={_accesses.isLoading}
                to={siteMap.logged.companyAccesses(company.siret)}
              >
                <WidgetValue>{_accesses.data}</WidgetValue>
              </Widget>
            </Grid>
          </Grid>
          <CompanyChartPanel companyId={id} company={company} />

          <Grid container spacing={2}>
            <Grid item sm={12} md={7}>
              <StatusDistribution<ReportStatusPro>
                values={_getProStatus.data}
                loading={_getProStatus.isLoading}
                statusDesc={(s: ReportStatusPro) => m.reportStatusDescPro[s]}
                statusShortLabel={(s: ReportStatusPro) => m.reportStatusShortPro[s]}
                statusColor={(s: ReportStatusPro) => reportStatusProColor[s]}
              />
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
            </Grid>
          </Grid>
        </>
      )}
    </Page>
  )
}
