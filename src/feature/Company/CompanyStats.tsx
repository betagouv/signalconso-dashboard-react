import {List, ListItem} from '@mui/material'
import {useI18n} from 'core/i18n'
import {HorizontalBarChart} from 'shared/Chart/HorizontalBarChart'
import {reportStatusColor} from 'shared/ReportStatus'
import {useEffectFn, useMemoFn} from '../../alexlibs/react-hooks-lib'
import {ReportStatus} from '../../core/client/report/Report'
import {CompanyWithReportsCount, UserWithPermission} from '../../core/model'
import {useGetHostsQuery} from '../../core/queryhooks/companyQueryHooks'
import {useReportSearchQuery} from '../../core/queryhooks/reportQueryHooks'
import {useGetTagsQuery, useStatusDistributionQuery} from '../../core/queryhooks/statsQueryHooks'
import {CompanyChartPanel} from './CompanyChartPanel'
import {ReportsShortListPanel} from './ReportsShortList'
import {CompanyInfo} from './stats/CompanyInfo'
import {ReportWordDistribution} from './stats/ReportWordDistribution'
import {ReviewDistribution} from './stats/ReviewDistribution'
import {StatusDistribution} from './stats/StatusDistribution'

import {UseQueryResult} from '@tanstack/react-query'
import {ApiError} from 'core/client/ApiClient'
import {CleanDiscreetPanel} from 'shared/Panel/simplePanels'
import {CompanyStatsNumberWidgets} from './companyStatsNumberWidgets'
import {EngagementReviewDistribution} from './stats/EngagementReviewDistribution'
export type ExtendedUser = UserWithPermission & {
  isPro: boolean
}

export function CompanyStats({connectedUser, company}: {connectedUser: ExtendedUser; company: CompanyWithReportsCount}) {
  const {m} = useI18n()
  const id = company.id
  const _hosts = useGetHostsQuery(id, {enabled: !connectedUser.isPro})
  const _reports = useReportSearchQuery({hasCompany: true, offset: 0, limit: 5}, false)
  const _tags = useGetTagsQuery(id)
  const _statusDistribution = useStatusDistributionQuery(id, {enabled: !connectedUser.isPro})

  useEffectFn(company, _ => {
    _reports.updateFilters({hasCompany: true, siretSirenList: [_.siret], offset: 0, limit: 5})
    _reports.enable()
  })

  const tagsDistribution = useMemoFn(_tags.data, _ =>
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

          <CompanyChartPanel companyId={id} company={company} reportTotals={_statusDistribution.data?.totals} />

          <div className="grid lg:grid-cols-2 gap-4">
            <div>
              <StatusDistribution<ReportStatus>
                loading={_statusDistribution.isLoading}
                values={_statusDistribution.data?.distribution}
                statusDesc={(s: ReportStatus) => m.reportStatusDesc[s]}
                statusShortLabel={(s: ReportStatus) => m.reportStatusShort[s]}
                statusColor={(s: ReportStatus) => reportStatusColor[s]}
              />
              <TagsDistribution {...{tagsDistribution}} />
              <ReportsShortListPanel {...{_reports}} />
            </div>
            <div>
              <CompanyInfo company={company} />
              <ReviewDistribution companyId={id} />
              <EngagementReviewDistribution companyId={id} />
              <ReportWordDistribution companyId={id} />
              <WebsitesDistribution {...{_hosts}} />
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
    <CleanDiscreetPanel>
      <h2 className="font-bold text-lg">Répartition par tags</h2>
      <HorizontalBarChart data={tagsDistribution} grid />
    </CleanDiscreetPanel>
  )
}

function WebsitesDistribution({_hosts}: {_hosts: UseQueryResult<string[], ApiError>}) {
  const {m} = useI18n()
  return (
    <CleanDiscreetPanel loading={_hosts.isLoading}>
      <h2 className="font-bold text-lg">{m.websites}</h2>
      <div style={{maxHeight: 260, overflow: 'auto'}}>
        <List dense>
          {_hosts.data?.map((host, i) => (
            <ListItem key={i}>{host}</ListItem>
          ))}
        </List>
      </div>
    </CleanDiscreetPanel>
  )
}
