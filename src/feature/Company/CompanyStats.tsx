import {Box, Grid, List, ListItem} from '@mui/material'
import {useI18n} from 'core/i18n'
import * as React from 'react'
import {HorizontalBarChart} from 'shared/Chart/HorizontalBarChart'
import {Page, PageTitle} from 'shared/Page'
import {Panel, PanelBody, PanelHead} from 'shared/Panel'
import {reportStatusColor} from 'shared/ReportStatus'
import {Txt} from '../../alexlibs/mui-extension'
import {useEffectFn, useMemoFn} from '../../alexlibs/react-hooks-lib'
import {ReportStatus} from '../../core/client/report/Report'
import {CompanyWithReportsCount, Id, UserWithPermission} from '../../core/model'
import {useGetCompanyByIdQuery, useGetHostsQuery} from '../../core/queryhooks/companyQueryHooks'
import {useReportSearchQuery} from '../../core/queryhooks/reportQueryHooks'
import {useGetStatusQuery, useGetTagsQuery} from '../../core/queryhooks/statsQueryHooks'
import {CompanyChartPanel} from './CompanyChartPanel'
import {ReportsShortList} from './ReportsShortList'
import {CompanyInfo} from './stats/CompanyInfo'
import {ReportWordDistribution} from './stats/ReportWordDistribution'
import {ReviewDistribution} from './stats/ReviewDistribution'
import {StatusDistribution} from './stats/StatusDistribution'

import {CompanyStatsNumberWidgets} from './companyStatsNumberWidgets'
export type ExtendedUser = UserWithPermission & {
  isPro: boolean
}

type NonProUserComponentProps = {
  id: Id
  connectedUser: ExtendedUser
  company?: CompanyWithReportsCount
}

export const CompanyStats: React.FC<NonProUserComponentProps> = ({id, connectedUser, company}) => {
  const {m} = useI18n()
  const _companyById = useGetCompanyByIdQuery(id)
  const _hosts = useGetHostsQuery(id, {enabled: !connectedUser.isPro})
  const _reports = useReportSearchQuery({hasCompany: true, offset: 0, limit: 5}, false)
  const _tags = useGetTagsQuery(id)
  const _getStatus = useGetStatusQuery(id, {enabled: !connectedUser.isPro})

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
          <CompanyStatsNumberWidgets id={id} siret={company.siret} />

          <CompanyChartPanel companyId={id} company={company} />

          <Grid container spacing={2}>
            <Grid item sm={12} md={7}>
              <StatusDistribution<ReportStatus>
                loading={_getStatus.isLoading}
                values={_getStatus.data}
                statusDesc={(s: ReportStatus) => m.reportStatusDesc[s]}
                statusShortLabel={(s: ReportStatus) => m.reportStatusShort[s]}
                statusColor={(s: ReportStatus) => reportStatusColor[s]}
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
            </Grid>
          </Grid>
        </>
      )}
    </Page>
  )
}
