import { useI18n } from 'core/i18n'
import { useStatusDistributionProQuery } from 'core/queryhooks/statsQueryHooks'
import { reportStatusProColor } from 'shared/reportStatusUtils'
import { useEffectFn } from '../../alexlibs/react-hooks-lib'
import { ReportStatusPro } from '../../core/client/report/Report'
import { CompanyWithReportsCount, User } from '../../core/model'
import { useReportSearchQuery } from '../../core/queryhooks/reportQueryHooks'
import { CompanyChartPanel } from './stats/CompanyChartPanel'
import { CompanyInfo } from './stats/CompanyInfo'
import {
  EngagementReviewsDistribution,
  ResponseReviewsDistribution,
} from './stats/ReviewDistribution'
import { StatusDistribution } from './stats/StatusDistribution'
import { CompanyCoreNumbers } from './stats/companyNumberWidgets'

type ExtendedUser = User & {
  isPro: boolean
}

export function CompanyStatsPro({
  connectedUser,
  company,
}: {
  connectedUser: ExtendedUser
  company: CompanyWithReportsCount
}) {
  const { m } = useI18n()
  const id = company.id
  const _reports = useReportSearchQuery(
    { hasCompany: true, offset: 0, limit: 5 },
    false,
  )
  const _statusDistribution = useStatusDistributionProQuery(id, {
    enabled: connectedUser.isPro,
  })

  useEffectFn(company, (_) => {
    _reports.updateFilters({
      hasCompany: true,
      siretSirenList: [_.siret],
      offset: 0,
      limit: 5,
    })
    _reports.enable()
  })

  return (
    <>
      {company && (
        <>
          <div className="grid lg:grid-cols-2 gap-20">
            <div>
              <CompanyCoreNumbers id={id} siret={company.siret} />
              <CompanyChartPanel
                companyId={id}
                company={company}
                reportTotals={_statusDistribution.data?.totals}
              />
              <StatusDistribution<ReportStatusPro>
                values={_statusDistribution.data?.distribution}
                loading={_statusDistribution.isLoading}
                statusDesc={(s: ReportStatusPro) => m.reportStatusDescPro[s]}
                statusShortLabel={(s: ReportStatusPro) =>
                  m.reportStatusShortPro[s]
                }
                statusColor={(s: ReportStatusPro) => reportStatusProColor[s]}
                alwaysExpanded
              />
            </div>
            <div>
              <CompanyInfo company={company} />
              <ResponseReviewsDistribution companyId={id} />
              <EngagementReviewsDistribution companyId={id} />
            </div>
          </div>
        </>
      )}
    </>
  )
}
