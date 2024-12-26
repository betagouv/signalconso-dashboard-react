import { useI18n } from 'core/i18n'
import { HorizontalBarChart } from 'shared/Chart/HorizontalBarChart'
import { reportStatusColor } from 'shared/ReportStatus'
import { useEffectFn, useMemoFn } from '../../alexlibs/react-hooks-lib'
import { ReportStatus } from '../../core/client/report/Report'
import { CompanyWithReportsCount, User } from '../../core/model'
import { useGetHostsQuery } from '../../core/queryhooks/companyQueryHooks'
import { useReportSearchQuery } from '../../core/queryhooks/reportQueryHooks'
import {
  useGetTagsQuery,
  useStatusDistributionQuery,
} from '../../core/queryhooks/statsQueryHooks'
import { CompanyChartPanel } from './CompanyChartPanel'
import { CompanyInfo } from './stats/CompanyInfo'
import { ReportWordDistribution } from './stats/ReportWordDistribution'
import { StatusDistribution } from './stats/StatusDistribution'

import { Icon } from '@mui/material'
import { UseQueryResult } from '@tanstack/react-query'
import { ApiError } from 'core/client/ApiClient'
import { CleanInvisiblePanel } from 'shared/Panel/simplePanels'
import { AlbertCompanyProblems } from 'shared/albert/AlbertCompanyProblems'
import { CompanyStatsNumberWidgets } from './companyStatsNumberWidgets'
import { AcceptedDistribution } from './stats/AcceptedDistribution'
import {
  EngagementReviewsDistribution,
  ResponseReviewsDistribution,
} from './stats/ReviewDistribution'
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
  const _hosts = useGetHostsQuery(id, { enabled: !connectedUser.isPro })
  const _reports = useReportSearchQuery(
    { hasCompany: true, offset: 0, limit: 5 },
    false,
  )
  const _tags = useGetTagsQuery(id)
  const _statusDistribution = useStatusDistributionQuery(id, {
    enabled: !connectedUser.isPro,
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
          <CompanyStatsNumberWidgets id={id} siret={company.siret} />

          <div className="grid lg:grid-cols-2 gap-20">
            <div>
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
              <CompanyInfo company={company} />
              <ResponseReviewsDistribution companyId={id} />
              <EngagementReviewsDistribution companyId={id} />
              <ReportWordDistribution companyId={id} />
              <WebsitesDistribution {...{ _hosts }} />
              {/* <ReportsShortListPanel {...{ _reports }} /> */}
            </div>
          </div>
        </>
      )}
    </>
  )
}

function TagsDistribution({
  tagsDistribution,
}: {
  tagsDistribution:
    | {
        label: string
        value: number
      }[]
    | undefined
}) {
  return (
    <CleanInvisiblePanel>
      <h2 className="font-bold text-2xl">Répartition par tags</h2>
      <HorizontalBarChart data={tagsDistribution} grid />
    </CleanInvisiblePanel>
  )
}

function WebsitesDistribution({
  _hosts,
}: {
  _hosts: UseQueryResult<string[], ApiError>
}) {
  const { m } = useI18n()
  return (
    <CleanInvisiblePanel loading={_hosts.isLoading}>
      <h2 className="font-bold text-2xl mb-2">{m.websites}</h2>
      <ul className="grid grid-cols-2">
        {_hosts.data?.map((host, i) => (
          <li key={i} className="flex gap-1 items-center">
            <Icon fontSize="small">public</Icon>
            {host}
          </li>
        ))}
      </ul>
    </CleanInvisiblePanel>
  )
}
