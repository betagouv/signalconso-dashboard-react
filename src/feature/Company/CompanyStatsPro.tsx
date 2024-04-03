import {Grid} from '@mui/material'
import {useI18n} from 'core/i18n'
import {useStatusDistributionProQuery} from 'core/queryhooks/statsQueryHooks'
import {reportStatusProColor} from 'shared/ReportStatus'
import {useEffectFn} from '../../alexlibs/react-hooks-lib'
import {ReportStatusPro} from '../../core/client/report/Report'
import {CompanyWithReportsCount, UserWithPermission} from '../../core/model'
import {useReportSearchQuery} from '../../core/queryhooks/reportQueryHooks'
import {CompanyChartPanel} from './CompanyChartPanel'
import {ReportsShortListPanel} from './ReportsShortList'
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
          <div className="grid lg:grid-cols-2 gap-4">
            <div>
              <StatusDistribution<ReportStatusPro>
                values={_statusDistribution.data?.distribution}
                loading={_statusDistribution.isLoading}
                statusDesc={(s: ReportStatusPro) => m.reportStatusDescPro[s]}
                statusShortLabel={(s: ReportStatusPro) => m.reportStatusShortPro[s]}
                statusColor={(s: ReportStatusPro) => reportStatusProColor[s]}
              />
              <ReportsShortListPanel {...{_reports}} />
            </div>
            <div>
              <CompanyInfo company={company} />
              <ReviewDistribution companyId={id} />
            </div>
          </div>
        </>
      )}
    </>
  )
}
