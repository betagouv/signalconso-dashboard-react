import {Box, Grid} from '@mui/material'
import {useI18n} from 'core/i18n'
import {Page, PageTitle} from 'shared/Page'
import {Panel, PanelHead} from 'shared/Panel'
import {reportStatusProColor} from 'shared/ReportStatus'
import {Txt} from '../../alexlibs/mui-extension'
import {useEffectFn} from '../../alexlibs/react-hooks-lib'
import {ReportStatusPro} from '../../core/client/report/Report'
import {CompanyWithReportsCount, Id, UserWithPermission} from '../../core/model'
import {useGetCompanyByIdQuery} from '../../core/queryhooks/companyQueryHooks'
import {useReportSearchQuery} from '../../core/queryhooks/reportQueryHooks'
import {useGetProStatusQuery} from '../../core/queryhooks/statsQueryHooks'
import {CompanyChartPanel} from './CompanyChartPanel'
import {ReportsShortList} from './ReportsShortList'
import {CompanyStatsNumberWidgets} from './companyStatsNumberWidgets'
import {CompanyInfo} from './stats/CompanyInfo'
import {ReviewDistribution} from './stats/ReviewDistribution'
import {StatusDistribution} from './stats/StatusDistribution'

export type ExtendedUser = UserWithPermission & {
  isPro: boolean
}

type ProUserComponentProps = {
  id: Id
  connectedUser: ExtendedUser
  company?: CompanyWithReportsCount
}

export const CompanyStatsPro: React.FC<ProUserComponentProps> = ({id, connectedUser, company}) => {
  const {m} = useI18n()
  const _companyById = useGetCompanyByIdQuery(id)

  const _reports = useReportSearchQuery({hasCompany: true, offset: 0, limit: 5}, false)

  const _getProStatus = useGetProStatusQuery(id, {enabled: connectedUser.isPro})

  useEffectFn(company, _ => {
    _reports.updateFilters({hasCompany: true, siretSirenList: [_.siret], offset: 0, limit: 5})
    _reports.enable()
  })

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
              <StatusDistribution<ReportStatusPro>
                values={_getProStatus.data}
                loading={_getProStatus.isLoading}
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
    </Page>
  )
}
