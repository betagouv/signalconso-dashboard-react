import { useI18n } from 'core/i18n'
import { reportStatusColor } from 'shared/reportStatusUtils'
import { useMemoFn } from '../../alexlibs/react-hooks-lib'
import { ReportStatus } from '../../core/client/report/Report'
import { CompanyWithReportsCount, User } from '../../core/model'
import {
  useGetTagsQuery,
  useStatusDistributionQuery,
} from '../../core/queryhooks/statsQueryHooks'
import { CompanyChartPanel } from './stats/CompanyChartPanel'
import { CompanyInfo } from './stats/CompanyInfo'
import { ReportWordDistribution } from './stats/ReportWordDistribution'
import { StatusDistribution } from './stats/StatusDistribution'

import { AlbertCompanyProblems } from 'shared/albert/AlbertCompanyProblems'
import { AcceptedDistribution } from './stats/AcceptedDistribution'
import { MostActiveUsers } from './stats/MostActiveUsers'
import { PhonesDistribution } from './stats/PhonesDistribution'
import {
  EngagementReviewsDistribution,
  ResponseReviewsDistribution,
} from './stats/ReviewDistribution'
import { TagsDistribution } from './stats/TagsDistribution'
import { WebsitesDistribution } from './stats/WebsitesDistribution'
import {
  CompanyConfidentialNumbers,
  CompanyCoreNumbers,
} from './stats/companyNumberWidgets'

type ExtendedUser = User & {
  isPro: boolean
}

export function CompanyStats({
  connectedUser,
  company,
}: {
  connectedUser: ExtendedUser
  company: CompanyWithReportsCount
}) {
  const { m } = useI18n()
  const id = company.id
  const _tags = useGetTagsQuery(id)
  const _statusDistribution = useStatusDistributionQuery(id, {
    enabled: !connectedUser.isPro,
  })

  const tagsDistribution = useMemoFn(_tags.data, (_) =>
    Object.entries(_).map(([label, count]) => ({
      label,
      value: count,
    })),
  )

  return (
    <>
      {company && (
        <>
          <div className="grid lg:grid-cols-2 gap-20">
            <div>
              <CompanyCoreNumbers id={id} siret={company.siret} />
              <AlbertCompanyProblems companyId={id} />
              <CompanyChartPanel
                companyId={id}
                company={company}
                reportTotals={_statusDistribution.data?.totals}
              />
              <StatusDistribution<ReportStatus>
                loading={_statusDistribution.isLoading}
                values={_statusDistribution.data?.distribution}
                statusDesc={(s: ReportStatus) => m.reportStatusDesc[s]}
                statusShortLabel={(s: ReportStatus) => m.reportStatusShort[s]}
                statusColor={(s: ReportStatus) => reportStatusColor[s]}
              />
              <AcceptedDistribution companyId={id} />
              <TagsDistribution {...{ tagsDistribution }} />
            </div>
            <div>
              <CompanyConfidentialNumbers id={id} siret={company.siret} />
              <CompanyInfo company={company} />
              <MostActiveUsers companyId={id} siret={company.siret} />
              <WebsitesDistribution companyId={id} />
              <PhonesDistribution companyId={id} />
              <ReportWordDistribution companyId={id} />
              <ResponseReviewsDistribution companyId={id} />
              <EngagementReviewsDistribution companyId={id} />
            </div>
          </div>
        </>
      )}
    </>
  )
}
