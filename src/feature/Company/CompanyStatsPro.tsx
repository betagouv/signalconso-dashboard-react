import {Grid} from '@mui/material'
import {useI18n} from 'core/i18n'
import {useStatusDistributionProQuery} from 'core/queryhooks/statsQueryHooks'
import {Panel, PanelHead} from 'shared/Panel'
import {reportStatusProColor} from 'shared/ReportStatus'
import {useEffectFn} from '../../alexlibs/react-hooks-lib'
import {ReportStatusPro} from '../../core/client/report/Report'
import {CompanyWithReportsCount, UserWithPermission} from '../../core/model'
import {useReportSearchQuery} from '../../core/queryhooks/reportQueryHooks'
import {CompanyChartPanel} from './CompanyChartPanel'
import {ReportsShortList} from './ReportsShortList'
import {CompanyStatsNumberWidgets} from './companyStatsNumberWidgets'
import {CompanyInfo} from './stats/CompanyInfo'
import {ReviewDistribution} from './stats/ReviewDistribution'
import {StatusDistribution} from './stats/StatusDistribution'

export type ExtendedUser = UserWithPermission & {
  isPro: boolean
}

export function CompanyStatsPro({connectedUser, company}: {connectedUser: ExtendedUser; company: CompanyWithReportsCount}) {
  const {m} = useI18n()
  const id = company.id
  const _reports = useReportSearchQuery({hasCompany: true, offset: 0, limit: 5}, false)

  const _statusDistribution = useStatusDistributionProQuery(id, {enabled: connectedUser.isPro})

  useEffectFn(company, _ => {
    _reports.updateFilters({hasCompany: true, siretSirenList: [_.siret], offset: 0, limit: 5})
    _reports.enable()
  })

  return (
    <>
      {company && (
        <>
          <CompanyStatsNumberWidgets id={id} siret={company.siret} />
          <CompanyChartPanel companyId={id} company={company} reportTotals={_statusDistribution.data?.totals} />
          <Grid container spacing={2}>
            <Grid item sm={12} md={7}>
              <StatusDistribution<ReportStatusPro>
                values={_statusDistribution.data?.distribution}
                loading={_statusDistribution.isLoading}
                statusDesc={(s: ReportStatusPro) => m.reportStatusDescPro[s]}
                statusShortLabel={(s: ReportStatusPro) => m.reportStatusShortPro[s]}
                statusColor={(s: ReportStatusPro) => reportStatusProColor[s]}
              />
              <Panel loading={_reports.result.isFetching}>
                <PanelHead>{m.lastReports}</PanelHead>
                {_reports.result.data && <ReportsShortList reports={_reports.result.data} />}
              </Panel>
            </Grid>
            <Grid item sm={12} md={5}>
              <CompanyInfo company={company} />
              <ReviewDistribution companyId={id} />
            </Grid>
          </Grid>
        </>
      )}
    </>
  )
}
