import React, {useEffect, useMemo} from 'react'
import {Page, PageTitle} from '../../shared/Page'
import {Panel, PanelBody} from '../../shared/Panel'
import {Datatable} from '../../shared/Datatable/Datatable'
import {useI18n} from '../../core/i18n'
import {Badge, Box, Grid, Icon, MenuItem, Tooltip} from '@mui/material'
import {useLayoutContext} from '../../core/Layout/LayoutContext'
import {Alert, Btn, Fender, makeSx, Txt} from '../../alexlibs/mui-extension'

import {styleUtils} from '../../core/theme'
import {SelectDepartments} from '../../shared/SelectDepartments/SelectDepartments'
import {ScSelect} from '../../shared/Select/Select'
import {useHistory} from 'react-router'
import {siteMap} from '../../core/siteMap'
import {EntityIcon} from '../../core/EntityIcon'
import {ScButton} from '../../shared/Button'
import {
  mapArrayFromQuerystring,
  mapDateFromQueryString,
  mapDatesToQueryString,
  useQueryString,
} from '../../core/helper/useQueryString'
import {config} from '../../conf/config'
import {ExportReportsPopper} from '../../shared/ExportPopperBtn'
import {PeriodPicker} from '../../shared/PeriodPicker'
import {SelectCompaniesByPro} from '../../shared/SelectCompaniesByPro/SelectCompaniesByPro'
import compose from '../../core/helper/compose'
import {DebouncedInput} from 'shared/DebouncedInput'
import {Enum} from '../../alexlibs/ts-utils'
import {cleanObject, openInNew} from '../../core/helper'
import {Report, ReportSearchResult, ReportStatus, ReportStatusPro, ReportType} from '../../core/client/report/Report'
import {ReportSearch} from '../../core/client/report/ReportSearch'
import {ScOption} from 'core/helper/ScOption'
import {ScInput} from '../../shared/ScInput'
import {useGetAccessibleByProQuery} from '../../core/queryhooks/companyQueryHooks'
import {useReportSearchQuery} from '../../core/queryhooks/reportQueryHooks'
import {useListReportBlockedNotificationsQuery} from 'core/queryhooks/reportBlockedNotificationQueryHooks'
import {ReportColumns} from './ReportColumns'

export const css = makeSx({
  card: {
    fontSize: t => styleUtils(t).fontSize.normal,
    display: 'flex',
    alignItems: 'center',
    py: 1,
    px: 2,
  },
  card_content: {
    flex: 1,
  },
  iconDash: {
    my: 0,
    mx: 1,
  },
  card_head: {
    display: 'flex',
    alignItems: 'center',
    mb: 1 / 2,
  },
  filters: {
    mb: 3,
  },
  filtersBody: {
    pb: t => `${t.spacing(1)} !important`,
  },
  actions: {
    flexWrap: 'wrap',
    whiteSpace: 'nowrap',
    mt: 2,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'flex-end',
    '& > *': {
      mb: 1,
      ml: 1,
    },
  },
})

const minRowsBeforeDisplayFilters = 2

interface ReportFiltersQs {
  readonly departments?: string[] | string
  readonly siretSirenList?: string[] | string
  start?: string
  end?: string
  status?: string[]
}
interface ReportsProProps {
  reportType: 'open' | 'closed'
}

export const ReportsPro = ({reportType}: ReportsProProps) => {
  const queryString = useQueryString<Partial<ReportSearch>, Partial<ReportFiltersQs>>({
    toQueryString: mapDatesToQueryString,
    fromQueryString: compose(mapDateFromQueryString, mapArrayFromQuerystring(['status', 'siretSirenList', 'departments'])),
  })

  const _reports = useReportSearchQuery({offset: 0, limit: 10, ...queryString.get()})
  const _accessibleByPro = useGetAccessibleByProQuery()
  const _blockedNotifications = useListReportBlockedNotificationsQuery()

  const {isMobileWidth} = useLayoutContext()
  const columns = ReportColumns({reportType, isMobileWidth, css})
  const history = useHistory()
  const {formatDate, m} = useI18n()

  const hasFilters = useMemo(() => {
    const {limit, offset, ...values} = _reports.filters
    return Object.keys(cleanObject(values)).length > 0 || offset > 0
  }, [_reports.filters])

  const isFirstVisit = useMemo(
    () => !hasFilters && _reports.result.data?.entities.every(_ => _.report.status === ReportStatus.TraitementEnCours),
    [_reports.result.data],
  )

  const displayFilters = useMemo(
    () => (_reports.result.data && _reports.result.data.totalCount > minRowsBeforeDisplayFilters) || hasFilters,
    [_reports.result.data],
  )

  const filtersCount = useMemo(() => {
    const {offset, limit, ...filters} = _reports.filters
    return Object.keys(cleanObject(filters)).length
  }, [_reports.filters])

  useEffect(() => {
    queryString.update(cleanObject(_reports.filters))
  }, [_reports.filters])

  const entities = _reports.result.data?.entities || []

  const filteredReports = entities.filter(report =>
    reportType === 'open'
      ? Report.getStatusProByStatus(report.report.status) !== ReportStatusPro.Cloture
      : Report.getStatusProByStatus(report.report.status) === ReportStatusPro.Cloture,
  )

  useEffect(() => {
    queryString.update(cleanObject(_reports.filters))
  }, [_reports.filters])

  return (
    <Page loading={_accessibleByPro.isLoading}>
      <PageTitle
        action={
          <div className="flex gap-2">
            <Btn variant="outlined" {...({target: '_blank'} as any)} href="https://tally.so/r/woMGGe">
              {m.Feedback}
              <Icon sx={{ml: 1}}>feedback</Icon>
            </Btn>
            <Btn
              variant="outlined"
              // color="primary"
              // icon="help"
              {...({target: '_blank'} as any)}
              href={config.appBaseUrl + '/centre-aide'}
            >
              {m.help}
              <Icon sx={{ml: 1}}>help</Icon>
            </Btn>
          </div>
        }
      >
        {reportType === 'open' ? m.OpenReports_pageTitle : m.ClosedReports_pageTitle}
      </PageTitle>

      {isFirstVisit && (
        <Alert type="success" deletable persistentDelete sx={{mb: 2}}>
          <span dangerouslySetInnerHTML={{__html: m.yourAccountIsActivated}} />
        </Alert>
      )}
      {ScOption.from(_accessibleByPro.data)
        .map(companies => (
          <>
            {displayFilters && (
              <Panel elevation={3} sx={css.filters}>
                <PanelBody sx={css.filtersBody}>
                  <Grid container spacing={1}>
                    <Grid item sm={6} xs={12}>
                      <DebouncedInput
                        value={_reports.filters.fullText ?? ''}
                        onChange={_ => _reports.updateFilters(prev => ({...prev, fullText: _}))}
                      >
                        {(value, onChange) => (
                          <ScInput
                            label={m.search}
                            placeholder={m.searchByNameOrReference}
                            value={value}
                            onChange={e => onChange(e.target.value)}
                            fullWidth
                            sx={{mr: 1}}
                          />
                        )}
                      </DebouncedInput>
                    </Grid>
                    <Grid item sm={6} xs={12}>
                      <DebouncedInput
                        value={
                          _reports.filters.hasWebsite === undefined
                            ? ReportType.Both
                            : _reports.filters.hasWebsite
                            ? ReportType.Internet
                            : ReportType.Shop
                        }
                        onChange={e => {
                          const hasWebsite = e === ReportType.Both ? undefined : e === ReportType.Internet
                          _reports.updateFilters(prev => ({...prev, hasWebsite}))
                        }}
                      >
                        {(value, onChange) => (
                          <ScSelect
                            value={value}
                            variant="outlined"
                            onChange={x => {
                              onChange(x.target.value as ReportType)
                            }}
                            id="select-report-type-pro"
                            sx={{mr: 1}}
                            label={m.reportType}
                            fullWidth
                          >
                            {Enum.values(ReportType).map(type => (
                              <MenuItem key={type} value={type}>
                                {m.ReportTypeDesc[type]}
                              </MenuItem>
                            ))}
                          </ScSelect>
                        )}
                      </DebouncedInput>
                    </Grid>
                    <Grid item sm={6} xs={12}>
                      <DebouncedInput
                        value={_reports.filters.siretSirenList}
                        onChange={_ =>
                          _reports.updateFilters(prev => ({
                            ...prev,
                            hasCompany: true,
                            siretSirenList: _,
                          }))
                        }
                      >
                        {(value, onChange) => (
                          <SelectCompaniesByPro
                            values={value}
                            onChange={onChange}
                            fullWidth
                            sx={{mr: 1}}
                            accessibleCompanies={companies}
                          />
                        )}
                      </DebouncedInput>
                    </Grid>
                    <Grid item sm={6} xs={12}>
                      <DebouncedInput
                        value={_reports.filters.departments}
                        onChange={departments => _reports.updateFilters(prev => ({...prev, departments}))}
                      >
                        {(value, onChange) => (
                          <SelectDepartments label={m.departments} value={value} onChange={onChange} sx={{mr: 1}} fullWidth />
                        )}
                      </DebouncedInput>
                    </Grid>
                  </Grid>

                  <DebouncedInput<[Date | undefined, Date | undefined]>
                    value={[_reports.filters.start, _reports.filters.end]}
                    onChange={([start, end]) => _reports.updateFilters(prev => ({...prev, start, end}))}
                  >
                    {(value, onChange) => <PeriodPicker fullWidth value={value} onChange={onChange} />}
                  </DebouncedInput>
                  <Box sx={css.actions}>
                    <Badge color="error" badgeContent={filtersCount} hidden={filtersCount === 0}>
                      <ScButton icon="clear" onClick={_reports.clearFilters} variant="outlined" color="primary">
                        {m.removeAllFilters}
                      </ScButton>
                    </Badge>
                    <ExportReportsPopper
                      disabled={ScOption.from(_reports?.result.data?.totalCount)
                        .map(_ => _ > config.reportsLimitForExport)
                        .getOrElse(false)}
                      tooltipBtnNew={ScOption.from(_reports?.result.data?.totalCount)
                        .map(_ =>
                          _ > config.reportsLimitForExport ? m.cannotExportMoreReports(config.reportsLimitForExport) : '',
                        )
                        .getOrElse('')}
                      filters={_reports.filters}
                    >
                      <Btn variant="outlined" color="primary" icon="get_app">
                        {m.exportInXLS}
                      </Btn>
                    </ExportReportsPopper>
                  </Box>
                </PanelBody>
              </Panel>
            )}
            {_blockedNotifications.data && _blockedNotifications.data.length > 0 && (
              <Alert type="info">
                {_blockedNotifications.data.length === 1
                  ? m.activateNotificationsAlertSingle
                  : m.activateNotificationsAlertMultiple(_blockedNotifications.data.length)}
              </Alert>
            )}

            <Panel>
              <Datatable<ReportSearchResult>
                id={reportType === 'open' ? 'opened-reports' : 'closed-reports'}
                paginate={{
                  minRowsBeforeDisplay: minRowsBeforeDisplayFilters,
                  offset: _reports.filters.offset,
                  limit: _reports.filters.limit,
                  onPaginationChange: pagination => _reports.updateFilters(prev => ({...prev, ...pagination})),
                }}
                data={filteredReports}
                loading={_accessibleByPro.isLoading}
                total={filteredReports?.length || 0}
                onClickRows={(_, e) => {
                  if (e.metaKey || e.ctrlKey) {
                    openInNew(siteMap.logged.report(_.report.id))
                  } else {
                    history.push(siteMap.logged.report(_.report.id))
                  }
                }}
                columns={columns}
                renderEmptyState={
                  <Fender
                    icon={EntityIcon.report}
                    title={m.noReportsTitle}
                    description={
                      <>
                        <Txt color="hint" size="big" block gutterBottom>
                          {m.noReportsDesc}
                        </Txt>
                        <ScButton icon="clear" onClick={_reports.clearFilters} variant="contained" color="primary">
                          {m.removeAllFilters}
                        </ScButton>
                      </>
                    }
                  />
                }
              />
            </Panel>
          </>
        ))
        .toUndefined()}
    </Page>
  )
}
